// app/layout.tsx
import "./globals.css";
import { Poppins } from "next/font/google";

export const metadata = {
  title: "Headstarter LinkedIn Network MCP Server",
  description:
    "A Model Context Protocol (MCP) Server that provides AI assistants with access to LinkedIn profile data from the Headstarter network. Enables intelligent querying, searching, and analysis of LinkedIn profiles for recruiting, networking, and community building.",
  keywords: [
    "MCP",
    "Model Context Protocol",
    "LinkedIn",
    "Headstarter",
    "AI assistant",
    "networking",
    "recruiting",
    "community building",
    "LinkedIn profiles",
    "talent sourcing",
    "career opportunities",
  ],
  authors: [{ name: "Headstarter" }],
  creator: "Headstarter",
  publisher: "Headstarter",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    title: "Headstarter LinkedIn Network MCP Server",
    description:
      "AI-powered LinkedIn profile access through Model Context Protocol. Search, query, and analyze Headstarter network profiles for recruiting and networking.",
    siteName: "Headstarter MCP Server",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Headstarter LinkedIn Network MCP Server",
    description:
      "AI-powered LinkedIn profile access through Model Context Protocol. Search, query, and analyze Headstarter network profiles.",
    creator: "@headstarter",
  },
  category: "technology",
  classification: "AI Tools",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
