import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Team Henry Castillo - Portal de Entrenamiento',
  description: 'Sistema integral de gestión de entrenamiento personal y clientes VIP.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-slate-900 text-white min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
