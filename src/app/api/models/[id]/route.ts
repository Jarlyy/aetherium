import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID модели обязателен' },
        { status: 400 }
      );
    }

    // Читаем метаданные модели
    const modelDir = path.join(process.cwd(), 'public', 'models', id);
    const metadataPath = path.join(modelDir, 'metadata.json');

    try {
      const metadataContent = await readFile(metadataPath, 'utf-8');
      const metadata = JSON.parse(metadataContent);

      return NextResponse.json({
        success: true,
        data: metadata
      });
    } catch (fileError) {
      // Если файл не найден, возвращаем mock-данные для демонстрации
      const mockData = {
        id,
        title: `Модель ${id}`,
        prompt: "Пример промпта для демонстрации",
        author: "Демо пользователь",
        fileUrl: `/models/${id}/${id}.obj`,
        previewImageUrl: `/models/${id}/${id}_preview.jpg`,
        isPublic: true,
        likes: Math.floor(Math.random() * 50),
        downloads: Math.floor(Math.random() * 20),
        fileSize: "2.4 MB",
        formats: ["OBJ", "STL"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        data: mockData
      });
    }

  } catch (error) {
    console.error('Error fetching model:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Ошибка получения модели' 
      },
      { status: 500 }
    );
  }
}