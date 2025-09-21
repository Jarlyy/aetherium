"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import type { Model3D } from "@/types/model";

interface ModelPageProps {
  params: {
    id: string;
  };
}

export default function ModelPage({ params }: ModelPageProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [modelData, setModelData] = useState<Model3D | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных модели
  useEffect(() => {
    const fetchModel = async () => {
      try {
        const response = await fetch(`/api/models/${params.id}`);
        const result = await response.json();
        
        if (result.success) {
          setModelData(result.data);
        } else {
          setError(result.error || 'Ошибка загрузки модели');
        }
      } catch (err) {
        setError('Ошибка сети');
      } finally {
        setLoading(false);
      }
    };

    fetchModel();
  }, [params.id]);
  
  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const handleDownload = (format: string) => {
    window.open(`/api/download/${params.id}?format=${format}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка модели...</p>
        </div>
      </div>
    );
  }

  if (error || !modelData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Ошибка</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Link href="/">
            <Button variant="outline">На главную</Button>
          </Link>
        </div>
      </div>
    );
  }

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
              <Link href="/generate">
                <Button variant="outline">Создать новую</Button>
              </Link>
              <Link href="/">
                <Button variant="outline">← Главная</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 3D Viewer */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>3D Модель</CardTitle>
                <CardDescription>
                  Интерактивный просмотр модели (Three.js будет добавлен на этапе 3)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    {modelData.previewImageUrl ? (
                      <img 
                        src={modelData.previewImageUrl} 
                        alt={modelData.title}
                        className="max-w-full max-h-full object-contain rounded"
                      />
                    ) : (
                      <>
                        <div className="text-8xl mb-4">🎯</div>
                        <h3 className="text-xl font-semibold mb-2">3D Viewer</h3>
                        <p className="text-muted-foreground">Three.js интеграция на этапе 3</p>
                        <div className="mt-4 space-x-2">
                          <Badge>Вращение</Badge>
                          <Badge>Масштаб</Badge>
                          <Badge>Освещение</Badge>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Контролы для 3D */}
                <div className="flex justify-center space-x-2 mt-4">
                  <Button variant="outline" size="sm">Сбросить вид</Button>
                  <Button variant="outline" size="sm">Полный экран</Button>
                  <Button variant="outline" size="sm">Wireframe</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Информация о модели */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{modelData.title}</CardTitle>
                <CardDescription>
                  ID: {modelData.id}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Описание</h4>
                  <p className="text-muted-foreground">{modelData.prompt}</p>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Автор:</span>
                    <p className="font-medium">{modelData.author}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Дата:</span>
                    <p className="font-medium">{modelData.createdAt}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Размер:</span>
                    <p className="font-medium">{modelData.fileSize}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Скачиваний:</span>
                    <p className="font-medium">{modelData.downloads}</p>
                  </div>
                </div>
                
                <Separator />
                
                {/* Действия */}
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <Button 
                      variant={isLiked ? "default" : "outline"}
                      size="sm"
                      onClick={toggleLike}
                      className="flex-1"
                    >
                      {isLiked ? "♥" : "♡"} {modelData.likes + (isLiked ? 1 : 0)}
                    </Button>
                    <Button 
                      variant={isFavorited ? "default" : "outline"}
                      size="sm"
                      onClick={toggleFavorite}
                      className="flex-1"
                    >
                      {isFavorited ? "★" : "☆"} В избранное
                    </Button>
                  </div>
                  
                  <Button variant="default" className="w-full" onClick={() => handleDownload('obj')}>
                    Скачать все форматы
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Форматы скачивания */}
            <Card>
              <CardHeader>
                <CardTitle>Форматы файлов</CardTitle>
                <CardDescription>
                  Выберите нужный формат для скачивания
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {modelData.formats.map((format) => (
                  <div key={format} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <span className="font-medium">.{format.toLowerCase()}</span>
                      <p className="text-sm text-muted-foreground">
                        {format === 'OBJ' ? 'Универсальный формат' : '3D печать'}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleDownload(format.toLowerCase())}>
                      Скачать
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Похожие модели */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6">Похожие модели</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">Модель {i}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold mb-1">Похожая модель {i}</h4>
                  <p className="text-sm text-muted-foreground mb-2">Автор{i}</p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-xs">♡ {i * 3}</Badge>
                    <span className="text-xs text-muted-foreground">2 дня назад</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}