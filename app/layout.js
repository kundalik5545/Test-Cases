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

          {/* Main component */}
          <main className="container mx-auto px-0 ">
            <nav className="flex justify-between  bg-white p-3 md:hidden">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-500 to-blue-600 bg-clip-text text-transparent">
                QA Test
              </h1>
              <SidebarTrigger />
            </nav>
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
