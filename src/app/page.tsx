import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { categories } from '@/lib/words';
import { Cat, Tv, User, Users, Languages } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconMap: { [key: string]: LucideIcon } = {
  Cat,
  Tv,
  User,
  Users,
  Languages,
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-primary font-headline">
          Forehead Frenzy
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mt-2">
          Choose a category to start the fun!
        </p>
      </div>

      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {categories.map((category) => {
          const Icon = iconMap[category.icon];
          return (
            <Link key={category.name} href={`/game?category=${encodeURIComponent(category.name)}`} passHref>
              <Card className="hover:bg-accent transition-colors duration-200 cursor-pointer h-full flex flex-col justify-center shadow-md hover:shadow-lg transform hover:-translate-y-1">
                <CardHeader className="flex-row items-center gap-4 pb-2">
                  {Icon && <Icon className="w-8 h-8 text-primary" />}
                  <CardTitle className="text-2xl font-semibold font-headline">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Guess words from the {category.name} category.</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
       <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>Place your phone on your forehead and guess the word!</p>
        <p>Tilt down for ✔️ and up to ❌.</p>
      </footer>
    </main>
  );
}
