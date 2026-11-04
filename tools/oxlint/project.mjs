import { defineRule, eslintCompatPlugin } from "@oxlint/plugins";

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

export default eslintCompatPlugin({
  meta: { name: "project" },
  rules: {
    "no-em-dash": noEmDash,
    "no-suppressions": noSuppressions,
    "no-relative-imports": noRelativeImports,
  },
});
