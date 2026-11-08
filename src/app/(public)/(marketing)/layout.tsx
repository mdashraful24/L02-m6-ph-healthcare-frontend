import type { ReactNode } from "react";
import Footer from "@/components/layout/public/Footer";
import Header from "@/components/layout/public/Header";
import ChatWidget from "@/components/modules/chat/chat-widget";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
