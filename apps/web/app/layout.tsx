import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Fintech App",
  description: "Fintech monorepo app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {/* Оборачиваем все дочерние страницы приложения */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
