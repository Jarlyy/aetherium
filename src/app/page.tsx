import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-primary">Aetherium</h1>
              <Badge variant="secondary">MVP</Badge>
            </div>
            <div className="flex items-center space-x-4">
              {/* Убрана дублирующая кнопка */}
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Создавайте 3D модели с помощью ИИ
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Просто опишите что вы хотите создать, и нейросеть сгенерирует для вас уникальную 3D модель
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/generate">
            <Button size="lg">Начать создание</Button>
          </Link>
          <Button variant="outline" size="lg">Посмотреть примеры</Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Возможности</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>ИИ Генерация</CardTitle>
              <CardDescription>
                Используем Hunyuan3D-2.1 для создания качественных 3D моделей
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>3D Просмотр</CardTitle>
              <CardDescription>
                Интерактивный просмотр моделей прямо в браузере
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Экспорт Файлов</CardTitle>
              <CardDescription>
                Скачивайте модели в различных форматах: OBJ, STL
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Public Gallery Preview */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Публичная галерея</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Пласейхолдеры для моделей */}
          {[1, 2, 3].map((i) => (
            <Card key={i} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground">3D Модель {i}</span>
                </div>
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold mb-2">Пример модели {i}</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  "Красивый современный объект..."
                </p>
                <div className="flex justify-between items-center">
                  <Badge variant="outline">Пользователь</Badge>
                  <span className="text-sm text-muted-foreground">♥ 0</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2025 Aetherium. Создано с помощью ИИ для создания 3D моделей.</p>
        </div>
      </footer>
    </div>
  );
}
