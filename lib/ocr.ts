import { createWorker } from 'tesseract.js';

type ImageInput = string | File | Blob;

function isBlob(value: ImageInput): value is Blob | File {
  return value instanceof Blob || value instanceof File;
}

export async function performOCR(imageData: ImageInput): Promise<string> {
  try {
    const worker = await createWorker('chi_sim+eng');
    
    let imageUrl: string;
    if (isBlob(imageData)) {
      imageUrl = URL.createObjectURL(imageData);
    } else {
      imageUrl = imageData;
    }

    const { data: { text } } = await worker.recognize(imageUrl);
    
    if (isBlob(imageData)) {
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