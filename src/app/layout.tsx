import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ThemeProvider } from '@/context/ThemeContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "H-Tracker",
  description: "Track your daily mood, activity, and sweet food consumption",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200`}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <header className="bg-indigo-600 text-white shadow-lg">
              <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                  <Link 
                    href="/" 
                    className="text-2xl font-bold hover:text-indigo-100"
                  >
                    Personal Tracker
                  </Link>
                  <nav className="flex space-x-4">
                    <Link 
                      href="/" 
                      className="hover:text-indigo-100 font-medium"
                    >
                      Daily Input
                    </Link>
                    <Link 
                      href="/history" 
                      className="hover:text-indigo-100 font-medium"
                    >
                      History
                    </Link>
                    <Link 
                      href="/insights" 
                      className="hover:text-indigo-100 font-medium"
                    >
                      Insights
                    </Link>
                  </nav>
                </div>
              </div>
            </header>
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="bg-gray-100 border-t">
              <div className="container mx-auto px-4 py-4 text-center text-gray-600 text-sm">
                Personal Tracker App &copy; {new Date().getFullYear()}
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
