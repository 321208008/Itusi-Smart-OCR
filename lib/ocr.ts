import { createWorker } from 'tesseract.js';

type ImageInput = string | File | Blob;

function isString(value: ImageInput): value is string {
  return typeof value === 'string';
}

export async function performOCR(imageData: ImageInput): Promise<string> {
  try {
    const worker = await createWorker('chi_sim+eng');
    
    let imageUrl: string;
    if (isString(imageData)) {
      imageUrl = imageData;
    } else {
      imageUrl = URL.createObjectURL(imageData);
    }

    const { data: { text } } = await worker.recognize(imageUrl);
    
    if (!isString(imageData)) {
      URL.revokeObjectURL(imageUrl);
    }
    
    await worker.terminate();
    return text;
  } catch (error) {
    console.error('OCR Error:', error);
    throw error;
  }
}

export async function detectLanguage(text: string): Promise<string> {
  // TODO: Implement language detection
  throw new Error("Not implemented");
}

export function formatText(text: string, language: string): string {
  // TODO: Implement text formatting based on detected language
  return text;
}