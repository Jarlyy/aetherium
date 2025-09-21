import { NextRequest, NextResponse } from 'next/server';
import { generateImageFromText } from '@/lib/hugging-face';
import { v4 as uuidv4 } from 'uuid';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Промпт обязателен' },
        { status: 400 }
      );
    }

    const imageId = uuidv4();
    
    console.log(`Generating image ${imageId} with prompt: "${prompt}"`);

    // Создаем папки для сохранения
    const publicDir = path.join(process.cwd(), 'public');
    const imagesDir = path.join(publicDir, 'images');
    await mkdir(imagesDir, { recursive: true });

    // Генерируем изображение
    const imageBlob = await generateImageFromText(prompt);

    // Сохраняем файл
    const fileName = `${imageId}.jpg`;
    const imagePath = path.join(imagesDir, fileName);
    const imageBuffer = Buffer.from(await imageBlob.arrayBuffer());
    
    await writeFile(imagePath, imageBuffer);

    const imageUrl = `/images/${fileName}`;

    console.log(`Image generated successfully: ${imageId}`);

    return NextResponse.json({
      success: true,
      data: {
        imageId,
        imageUrl,
        prompt
      }
    });

  } catch (error) {
    console.error('Error generating image:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Ошибка генерации изображения' 
      },
      { status: 500 }
    );
  }
}