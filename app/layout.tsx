import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Un aiuto — Un momento per te', description: 'Uno spazio tranquillo per fare una pausa dal lavoro e ritrovare il presente.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="it"><body>{children}</body></html>; }
