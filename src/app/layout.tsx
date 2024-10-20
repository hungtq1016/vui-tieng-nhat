import "./globals.css";

import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import { Metadata } from "next/types";
 
export const metadata: Metadata = {
  title: 'Vui Tiếng Nhật | 楽しい日本語',
  description: 'Chia động từ tiếng Nhật',
  
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
 
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
 
  return (
    <html lang={locale}>
      <body className="bg-gray-100 font-Noto">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
