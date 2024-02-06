import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Sidebar from "@/components/sidebar/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Skills&Work",
    template: "%s | Skills&Work",
  },
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className={`${inter.className} min-w-[400px]  h-screen`}>
        <main className="flex h-fit ">
          <Sidebar />
          <div className="flex flex-col justify-between items-center h-full m-auto">
            {children}
            <Footer />
          </div>
        </main>
      </body>
    </html>
  );
}
