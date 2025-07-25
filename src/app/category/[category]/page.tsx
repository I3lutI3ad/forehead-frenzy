// src/app/category/[category]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { wordCategories, categories } from '@/lib/words';

export default function SubCategorySelectionPage() {
  const router = useRouter();
  const params = useParams();
  const categoryName = Array.isArray(params.category) ? params.category[0] : params.category;
  const decodedCategoryName = decodeURIComponent(categoryName);

  const categoryInfo = categories.find(c => c.name === decodedCategoryName);
  const categoryVariants = wordCategories[decodedCategoryName];

  if (!categoryInfo || !categoryVariants) {
    // Redirect to home if category is invalid
    if (typeof window !== 'undefined') {
      router.push('/');
    }
    return null;
  }

  const variants = Object.keys(categoryVariants);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-primary font-headline">
          {decodedCategoryName}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mt-2">
          Choose a version to play.
        </p>
      </div>

      <div className="w-full max-w-md grid grid-cols-1 gap-4 sm:gap-6">
        {variants.map((variant) => (
          <Link
            key={variant}
            href={`/game?category=${encodeURIComponent(decodedCategoryName)}&variant=${encodeURIComponent(variant)}`}
            passHref
          >
            <Card className="hover:bg-accent transition-colors duration-200 cursor-pointer h-full flex flex-col justify-center shadow-md hover:shadow-lg transform hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold font-headline text-center">{variant}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
