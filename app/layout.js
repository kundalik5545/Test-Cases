import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Footer from "@/components/Footer";

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
          <main className="container mx-auto px-0 ">
            {children}
            <footer className="text-center py-8 border-t border-gray-200">
              <Footer />
            </footer>
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
