import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dream Globe - Where Dreams Meet Destinations",
  description: "An immersive dream-journey web experience that transforms your travel desires into reality",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className="antialiased dark font-sans"
      >
        {children}
      </body>
    </html>
  );
}
