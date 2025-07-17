import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ChevronLeft, Menu } from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "QA Test",
  description: "Manage your manual testing with AI and automation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-gray-100`}>
        <SidebarProvider>
          {/* App side bar component */}
          <AppSidebar />
          <SidebarTrigger />
          {/* Main component */}
          <main>{children}</main>
        </SidebarProvider>
      </body>
    </html>
  );
}
