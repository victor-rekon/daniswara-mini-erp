import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daniswara Mini ERP",
  description: "SistemBeres internal operations dashboard for PT Daniswara Gas Indonesia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
