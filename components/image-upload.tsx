"use client";

import { useState, useCallback } from "react";
import { useLanguage } from "./language-provider";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Upload, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { performOCR } from "@/lib/ocr";
import Image from "next/image";

async function getImageBlob(url: string): Promise<Blob> {
  // 使用wsrv.nl作为图片代理
  const proxyUrl = `https://wsrv.nl/?url=${encodeURIComponent(url)}`;
  try {
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error('图片加载失败');
    }
    return await response.blob();
  } catch (error) {
    console.error('图片加载错误:', error);
    throw new Error('图片加载失败，请检查URL是否正确');
  }
}

export function ImageUpload({ onImageProcess }: { onImageProcess: (text: string) => void }) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleImageUpload = useCallback(async (file: File) => {
    setIsProcessing(true);
    try {
      const text = await performOCR(file);
      onImageProcess(text);
      toast({
        title: t('success.ocr'),
        description: t('success.ocr_description'),
      });
    } catch (error) {
      toast({
        title: t('error.processing'),
        description: error instanceof Error ? error.message : '处理失败',
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [onImageProcess, t, toast]);

  const handleUrlSubmit = useCallback(async () => {
    if (!imageUrl) return;
    setIsProcessing(true);
    try {
      const blob = await getImageBlob(imageUrl);
      const text = await performOCR(blob);
      onImageProcess(text);
      toast({
        title: t('success.ocr'),
        description: t('success.ocr_description'),
      });
    } catch (error) {
      toast({
        title: t('error.processing'),
        description: error instanceof Error ? error.message : '处理失败',
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [imageUrl, onImageProcess, t, toast]);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6">
          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">{t('upload.title')}</p>
          <p className="text-sm text-muted-foreground mb-4">{t('upload.description')}</p>
          <Button
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={isProcessing}
          >
            {isProcessing ? t('upload.processing') : t('upload.button')}
          </Button>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
          />
        </div>

        <div className="flex gap-2">
          <Input
            placeholder={t('url.placeholder')}
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            disabled={isProcessing}
          />
          <Button onClick={handleUrlSubmit} disabled={!imageUrl || isProcessing}>
            <Link className="h-4 w-4 mr-2" />
            {isProcessing ? t('url.processing') : t('url.button')}
          </Button>
        </div>
      </div>
    </Card>
  );
}