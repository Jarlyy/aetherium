"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedModel, setGeneratedModel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] = useState<string>("");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setProgress(0);
    setGeneratedModel(null);
    setError(null);
    setGenerationStatus("Подготовка к генерации...");

    try {
      // Имитация прогресса
      const progressMessages = [
        "Обработка промпта...",
        "Генерация изображения...",
        "Создание 3D модели...",
        "Оптимизация геометрии...",
        "Финальная обработка..."
      ];
      
      let messageIndex = 0;
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 15;
          if (messageIndex < progressMessages.length) {
            setGenerationStatus(progressMessages[messageIndex]);
            messageIndex++;
          }
          if (newProgress >= 90) {
            clearInterval(progressInterval);
            setGenerationStatus("Завершение генерации...");
            return 90;
          }
          return newProgress;
        });
      }, 1500);

      // Отправляем запрос на генерацию 3D модели
      const response = await fetch('/api/generate/3d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style: 'realistic',
          quality: 'medium'
        }),
      });

      const result = await response.json();

      clearInterval(progressInterval);
      setProgress(100);
      setGenerationStatus("Модель готова!");

      if (result.success) {
        setGeneratedModel(result.data.modelId);
        console.log('Model generated:', result.data);
      } else {
        throw new Error(result.error || 'Ошибка генерации');
      }
    } catch (error) {
      console.error('Generation error:', error);
      setProgress(0);
      setError(error instanceof Error ? error.message : 'Неизвестная ошибка генерации');
      setGenerationStatus("");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-primary">Aetherium</h1>
              <Badge variant="secondary">MVP</Badge>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline">← Главная</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Генерация 3D Модели</h1>
            <p className="text-xl text-muted-foreground">
              Опишите, что вы хотите создать, и наша ИИ сгенерирует для вас 3D модель
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Форма ввода */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Описание</h3>
                  <Textarea
                    id="prompt"
                    placeholder="например, современный деревянный стул с мягкой обивкой"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={10}
                    disabled={isGenerating}
                    className="resize-none"
                  />
                </div>

                <Button 
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? "Генерирую..." : "Создать 3D модель"}
                </Button>
              </CardContent>
            </Card>

            {/* Результаты генерации */}
            {(isGenerating || generatedModel || error) && (
              <Card className="mt-8">
                <CardContent className="pt-6">
                  {isGenerating && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center mb-4">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">{generationStatus}</p>
                          </div>
                        </div>
                        <Progress value={progress} className="w-full" />
                        <p className="text-sm text-muted-foreground mt-2">
                          {progress}% завершено
                        </p>
                      </div>
                    </div>
                  )}

                  {generatedModel && !isGenerating && (
                    <div className="space-y-4">
                      <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl mb-4">🎯</div>
                          <p className="text-muted-foreground">3D модель готова!</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Link href={`/model/${generatedModel}`}>
                          <Button variant="default" className="w-full">
                            Просмотреть 3D
                          </Button>
                        </Link>
                        <Button variant="outline" className="w-full" onClick={() => {
                          window.open(`/api/download/${generatedModel}?format=obj`, '_blank');
                        }}>
                          Скачать OBJ
                        </Button>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="space-y-4">
                      <div className="w-full h-64 bg-destructive/10 border border-destructive rounded-lg flex items-center justify-center">
                        <div className="text-center p-6">
                          <div className="text-4xl mb-4 text-destructive">⚠️</div>
                          <h3 className="text-lg font-semibold mb-2 text-destructive">Ошибка генерации</h3>
                          <p className="text-sm text-muted-foreground mb-4">{error}</p>
                          <Button 
                            onClick={() => {
                              setError(null);
                              setProgress(0);
                            }}
                            variant="outline"
                            size="sm"
                          >
                            Попробовать снова
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Примеры промптов */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Примеры описаний</CardTitle>
              <CardDescription>
                Попробуйте эти примеры для вдохновения
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "Современный минималистичный стул из светлого дерева",
                  "Футуристический робот в стиле sci-fi с металлическим корпусом",
                  "Декоративная ваза с геометрическим узором",
                  "Игрушечная машинка в ретро стиле 50-х годов",
                  "Абстрактная скульптура из переплетенных форм",
                  "Уютный домик для птиц с резными элементами"
                ].map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-left h-auto p-4 whitespace-normal"
                    onClick={() => setPrompt(example)}
                    disabled={isGenerating}
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}