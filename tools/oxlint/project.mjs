import { defineRule, eslintCompatPlugin } from "@oxlint/plugins";
import { resolve, dirname } from "node:path";

const noEmDash = defineRule({
  meta: {
    type: "problem",
    schema: [],
    messages: { forbidden: "Replace the em dash with plain punctuation." },
  },
  create(context) {
    return {
      Program() {
        const source = context.sourceCode;

        for (const match of source.text.matchAll(/\u2014/gu)) {
          context.report({
            loc: source.getLocFromIndex(match.index),
            messageId: "forbidden",
          });
        }
      },
    };
  },
});

const noSuppressions = defineRule({
  meta: {
    type: "problem",
    schema: [],
    messages: {
      forbidden: "Fix the code or configure a justified scoped rule instead of suppressing checks.",
    },
  },
  create(context) {
    return {
      Program() {
        for (const comment of context.sourceCode.getAllComments()) {
          if (
            /\b(?:eslint|oxlint)-(?:disable|ignore)|@ts-(?:ignore|nocheck)|(?:prettier|oxfmt)-ignore/u.test(
              comment.value,
            )
          ) {
            context.report({ loc: comment.loc, messageId: "forbidden" });
          }
        }
      },
    };
  },
});

const noRelativeImports = defineRule({
  meta: {
    type: "problem",
    schema: [],
    messages: { forbidden: "Use a package import or path alias instead of a relative import." },
  },
  create(context) {
    function check(node) {
      if (/^(?:\.{1,2})(?:\/|$)/u.test(String(node.value))) {
        context.report({ node, messageId: "forbidden" });
      }
    }

    return {
      "ImportDeclaration > Literal.source": check,
      "ExportNamedDeclaration > Literal.source": check,
      "ExportAllDeclaration > Literal.source": check,
      "ImportExpression > Literal.source": check,
      "CallExpression[callee.name='require'] > Literal.arguments": check,
      "TSImportType > Literal": check,
      "TSImportType > TSLiteralType > Literal": check,
      "TSExternalModuleReference > Literal.expression": check,
    };
  },
});

function backendLayer(filename) {
  if (filename.endsWith(".service.ts")) return "service";

  if (filename.endsWith(".repository.ts")) return "repository";

  if (/\.(?:handlers|routes)\.ts$/u.test(String(filename))) return "handler";

  if (filename.endsWith("/app.ts")) return "app";

  return "module";
}

function typeOnlyImport(node) {
  const declaration = node.parent;

  if (declaration.type === "TSImportType" || declaration.type === "TSLiteralType") return true;

  if (declaration.importKind === "type" || declaration.exportKind === "type") return true;

  if (declaration.type !== "ImportDeclaration" || declaration.specifiers.length === 0) return false;

  return declaration.specifiers.every((specifier) => specifier.importKind === "type");
}

function databaseImport(source, filename) {
  const resolved = source.startsWith(".")
    ? resolve(dirname(String(filename)), String(source)).replaceAll("\\", "/")
    : source;

  return (
    /^(?:drizzle-orm|pg|postgres)(?:\/|$)|^#(?:db|schema)(?:\/|$)/u.test(String(source)) ||
    resolved.includes("/apps/server/src/db/")
  );
}

function wrongFeatureLayer(layer, source, typeOnly) {
  switch (layer) {
    case "app":
      return /\.(?:service|repository)(?:\.[cm]?[jt]s)?$/u.test(String(source));
    case "handler":
      return /\.repository(?:\.[cm]?[jt]s)?$/u.test(String(source));
    case "service":
      return /\.(?:handlers|routes)(?:\.[cm]?[jt]s)?$/u.test(String(source));
    case "repository":
      return (
        /\.(?:handlers|routes)(?:\.[cm]?[jt]s)?$/u.test(String(source)) ||
        (!typeOnly && /\.service(?:\.[cm]?[jt]s)?$/u.test(String(source)))
      );
    default:
      return false;
  }
}

export const noBackendLayerImports = defineRule({
  meta: {
    type: "problem",
    schema: [],
    messages: {
      forbidden:
        "The {{layer}} layer must not import {{source}}. Keep HTTP handling in handlers, orchestration in services, and database operations in repositories.",
    },
  },
  create(context) {
    const filename = context.filename.replaceAll("\\", "/");

    if (!filename.includes("/apps/server/src/")) return {};

    const layer = backendLayer(filename);
    const databaseFile = filename.includes("/apps/server/src/db/");
    const entrypoint = filename.endsWith("/apps/server/src/index.ts");

    function check(node) {
      const source = String(node.value);
      const honoImport = /^(?:hono|@hono\/[^/]+)(?:\/|$)/u.test(source);
      const lifecycleImport = entrypoint && source === "#db";

      const invalidDatabase =
        databaseImport(source, filename) &&
        layer !== "repository" &&
        !databaseFile &&
        !lifecycleImport;

      const invalidHono = honoImport && layer !== "handler" && layer !== "app" && !entrypoint;
      const invalidFeature = wrongFeatureLayer(layer, source, typeOnlyImport(node));

      if (invalidDatabase || invalidHono || invalidFeature) {
        context.report({ node, messageId: "forbidden", data: { layer, source } });
      }
    }

    return {
      "ImportDeclaration > Literal.source": check,
      "ExportNamedDeclaration > Literal.source": check,
      "ExportAllDeclaration > Literal.source": check,
      "ImportExpression > Literal.source": check,
      "CallExpression[callee.name='require'] > Literal.arguments": check,
      "TSImportType > Literal": check,
      "TSImportType > TSLiteralType > Literal": check,
      "TSExternalModuleReference > Literal.expression": check,
    };
  },
});

export const focusedRepositoryOperations = defineRule({
  meta: {
    type: "problem",
    schema: [],
    messages: {
      multiple:
        "Keep each repository function focused on one database operation. Coordinate independent queries in the service; group atomic writes in one transaction.",
    },
  },
  create(context) {
    const filename = context.filename.replaceAll("\\", "/");

    if (!filename.includes("/apps/server/src/") || !filename.endsWith(".repository.ts")) return {};

    const databaseBindings = new Set();
    const functions = [];

    function isDatabaseBinding(initialScope, name) {
      for (let scope = initialScope; scope; scope = scope.upper) {
        const variable = scope.set.get(name);

        if (!variable) continue;

        return variable.defs.some((definition) => databaseBindings.has(definition.node));
      }

      return false;
    }

    function enterFunction() {
      functions.push(0);
    }

    function exitFunction(node) {
      const operations = functions.pop();

      if (operations > 1) context.report({ node, messageId: "multiple" });
    }

    return {
      ImportDeclaration(node) {
        if (node.source.value !== "#db") return;

        for (const specifier of node.specifiers) {
          if (specifier.type !== "ImportSpecifier" || specifier.imported.name !== "db") continue;

          databaseBindings.add(specifier);
        }
      },
      ":function": enterFunction,
      ":function:exit": exitFunction,
      CallExpression(node) {
        const callee = node.callee;

        if (functions.length === 0 || callee.type !== "MemberExpression") return;

        if (
          callee.object.type !== "Identifier" ||
          !isDatabaseBinding(context.sourceCode.getScope(node), callee.object.name)
        )
          return;

        const method = String(callee.computed ? callee.property.value : callee.property.name);

        if (
          ![
            "select",
            "selectDistinct",
            "selectDistinctOn",
            "insert",
            "update",
            "delete",
            "execute",
            "transaction",
          ].includes(method)
        )
          return;

        functions[functions.length - 1] += 1;
      },
    };
  },
});

export default eslintCompatPlugin({
  meta: { name: "project" },
  rules: {
    "no-em-dash": noEmDash,
    "no-suppressions": noSuppressions,
    "no-relative-imports": noRelativeImports,
    "no-backend-layer-imports": noBackendLayerImports,
    "focused-repository-operations": focusedRepositoryOperations,
  },
});
