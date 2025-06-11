
import { Wrench } from 'lucide-react';
import Link from 'next/link';

export function AppHeader() {
  return (
    <header className="py-4 px-6 border-b border-border bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-primary hover:text-primary/90 transition-colors">
          <Wrench className="h-7 w-7 sm:h-8 sm:w-8" />
          <h1 className="text-xl sm:text-2xl font-headline font-semibold">Layla</h1>
        </Link>
      </div>
    </header>
  );
}
