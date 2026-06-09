// app/layout.tsx
import { Providers } from "./providers"; // или ваш путь к провайдеру
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* 🌟 suppressHydrationWarning обязателен при работе с темами! */}
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
