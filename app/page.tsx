"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ImageUpload } from "@/components/image-upload";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";

export default function Home() {
  const [extractedText, setExtractedText] = useState<string>("");
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <ImageUpload onImageProcess={setExtractedText} />
          
          {extractedText && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">{t('result.title')}</h2>
              <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap">
                {extractedText}
              </div>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}