"use client";

import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'upload.title': 'Upload Image',
    'upload.description': 'Upload an image or paste a URL to extract text',
    'upload.button': 'Upload Image',
    'url.placeholder': 'Paste image URL here',
    'result.title': 'Extracted Text',
    'processing': 'Processing...',
    'error.upload': 'Error uploading image',
    'error.processing': 'Error processing image',
  },
  zh: {
    'upload.title': '上传图片',
    'upload.description': '上传图片或粘贴URL以提取文字',
    'upload.button': '上传图片',
    'url.placeholder': '在此粘贴图片URL',
    'result.title': '提取的文字',
    'processing': '处理中...',
    'error.upload': '上传图片出错',
    'error.processing': '处理图片出错',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};