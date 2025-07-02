import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "../components/Providers";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "CU Chatbot - AI-Powered Chat Assistant",
    template: "%s | CU Chatbot",
  },
  description:
    "CU Chatbot is an intelligent AI chat assistant built with Next.js. Experience seamless conversations with advanced AI technology, file uploads, and responsive design. Try our free AI chatbot today.",
  keywords: [
    "AI chatbot",
    "artificial intelligence",
    "chat assistant",
    "AI conversation",
    "intelligent chatbot",
    "CU Chatbot",
    "Next.js chatbot",
    "AI chat interface",
    "conversational AI",
    "smart assistant",
    "AI messaging",
    "chatbot application",
  ],
  authors: [{ name: "CU Chatbot Team" }],
  creator: "CU Chatbot",
  publisher: "CU Chatbot",
  icons: {
    icon: [
      { url: "/MainLogo1.svg" },
      { url: "/MainLogo1.svg", sizes: "32x32", type: "image/svg" },
      { url: "/MainLogo1.svg", sizes: "16x16", type: "image/svg" },
    ],
    apple: [
      { url: "/MainLogo1.svg" },
      { url: "/MainLogo1.svg", sizes: "180x180", type: "image/svg" },
    ],
    shortcut: "/MainLogo1.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cu-chatbot.com",
    siteName: "CU Chatbot",
    title: "CU Chatbot - AI-Powered Chat Assistant",
    description:
      "Experience intelligent conversations with CU Chatbot. Advanced AI technology, file uploads, and seamless user experience. Start chatting now!",
    images: [
      {
        url: "/MainLogo1.svg",
        width: 1200,
        height: 630,
        alt: "CU Chatbot - AI Chat Assistant Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CU Chatbot - AI-Powered Chat Assistant",
    description:
      "Intelligent AI conversations made simple. Try CU Chatbot for seamless AI chat experience.",
    images: ["/MainLogo1.svg"],
    creator: "@cu_chatbot",
  },
  alternates: {
    canonical: "https://cu-chatbot.com",
  },
  category: "Technology",
  classification: "AI Chatbot Application",
  other: {
    "application-name": "CU Chatbot",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "CU Chatbot",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#0e0e0e",
    "theme-color": "#ffffff",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  const html = document.documentElement;
                  
                  if (theme === 'light') {
                    html.classList.remove('dark');
                    html.classList.add('light');
                  } else {
                    html.classList.add('dark');
                    html.classList.remove('light');
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
