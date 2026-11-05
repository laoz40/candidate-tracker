import { PasswordException, PDFParse } from "pdf-parse";

export const DOCUMENT_MAX_CHARACTERS = 50_000;

type ExtractionResult = { text: string } | { error: string };

export async function extractPdfText(file: File): Promise<ExtractionResult> {
  const parser = new PDFParse({ data: new Uint8Array(await file.arrayBuffer()) });

  try {
    const result = await parser.getText();

    const text = result.pages
      .map((page) => page.text)
      .join("\n\n")
      .trim();

    if (!text) return { error: "No text found in this PDF. Image-only PDFs are not supported" };

    if (text.length > DOCUMENT_MAX_CHARACTERS) {
      return { error: `Extracted text exceeds ${DOCUMENT_MAX_CHARACTERS} characters` };
    }

    return { text };
  } catch (error) {
    if (error instanceof PasswordException) return { error: "Encrypted PDFs are not supported" };

    return { error: "This PDF is invalid or could not be read" };
  } finally {
    await parser.destroy();
  }
}
