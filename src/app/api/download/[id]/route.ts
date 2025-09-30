import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'obj';

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID модели обязателен' },
        { status: 400 }
      );
    }

    // Путь к файлу модели
    const modelDir = path.join(process.cwd(), 'public', 'models', id);
    const fileName = `${id}.${format.toLowerCase()}`;
    const filePath = path.join(modelDir, fileName);

    try {
      // Читаем файл
      const fileBuffer = await readFile(filePath);
      
      // Определяем MIME тип
      const mimeTypes: Record<string, string> = {
        'obj': 'text/plain',
        'stl': 'application/octet-stream',
        'svg': 'image/svg+xml'
      };

      const mimeType = mimeTypes[format.toLowerCase()] || 'application/octet-stream';

      // Возвращаем файл для скачивания
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': mimeType,
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'Content-Length': fileBuffer.length.toString(),
        },
      });

    } catch (fileError) {
      return NextResponse.json(
        { success: false, error: 'Файл модели не найден' },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('Error downloading model:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Ошибка скачивания' 
      },
      { status: 500 }
    );
  }
}