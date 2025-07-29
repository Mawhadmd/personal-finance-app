import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainerComponent } from "@/hooks/useToast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "PFinance",
  description: "Manage your personal finances with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function getStoredTheme() {
                  try {
                    const theme = localStorage.getItem('theme');
                    if (theme === 'dark' || theme === 'light') return theme;
                  } catch (e) {}
                  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                
                const theme = getStoredTheme();
                document.documentElement.setAttribute('data-theme', theme);
                document.documentElement.classList.toggle('dark', theme === 'dark');
              })();
            `,
          }}
          async
        />
      </head>
      <body
        className={`${inter.className} antialiased bg-background  text-text h-svh`}
      >
        {children}
        <ToastContainerComponent/>
      </body>
    </html>
  );
}
