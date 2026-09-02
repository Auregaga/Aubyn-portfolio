import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/src/components/layout/LenisProvider";
import { BasePathProvider } from "@/src/components/layout/BasePathProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "个人作品集",
  description: "全栈工程师个人作品集网站",
};

// 从环境变量读取 basePath
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-CN"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <BasePathProvider basePath={basePath}>
          <LenisProvider>{children}</LenisProvider>
        </BasePathProvider>
      </body>
    </html>
  );
}
