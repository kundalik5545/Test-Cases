"use client";
import { useState, useEffect } from "react";
import {
  Calendar,
  Home,
  Inbox,
  LayoutDashboard,
  List,
  Search,
  Settings,
  Upload,
  Menu,
  ChevronLeft,
  X,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function AppSidebar({ isCollapsed, setIsCollapsed }) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobile &&
        !isCollapsed &&
        !event.target.closest(".sidebar-container")
      ) {
        setIsCollapsed(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isCollapsed, setIsCollapsed]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 md:hidden hover:bg-gray-50 transition-colors"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      )}

      <div className="sidebar-container">
        <Sidebar
          className={`
            fixed top-0 left-0 h-screen z-50 
            transition-all duration-300 ease-in-out
            ${isMobile ? "w-80" : isCollapsed ? "w-16" : "w-64"}
            ${isMobile && isCollapsed ? "-translate-x-full" : "translate-x-0"}
            bg-gradient-to-b from-gray-50 to-white
            border-r border-gray-200/60 shadow-xl
            flex flex-col
          `}
        >
          {/* Header */}
          <SidebarHeader className="p-4 border-b border-gray-200/60 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex gap-3 items-center group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity" />
                  <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-1.5 rounded-lg">
                    <Image
                      src="/logo.svg"
                      width={24}
                      height={24}
                      alt="Logo"
                      className="filter invert brightness-0"
                    />
                  </div>
                </div>
                {(!isCollapsed || isMobile) && (
                  <div className="flex flex-col">
                    <span className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      Test{" "}
                      <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                        Cases
                      </span>
                    </span>
                    <span className="text-xs text-gray-500 -mt-1">
                      Management Suite
                    </span>
                  </div>
                )}
              </Link>

              {/* Desktop collapse button */}
              {!isMobile && (
                <button
                  onClick={toggleSidebar}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft
                    size={16}
                    className={`transition-transform duration-300 ${
                      isCollapsed ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}
            </div>
          </SidebarHeader>

          {/* Content */}
          <SidebarContent className="flex-1 p-4 space-y-6 overflow-y-auto">
            <SidebarGroup>
              <SidebarGroupLabel
                className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ${
                  isCollapsed && !isMobile ? "text-center" : ""
                }`}
              >
                {!isCollapsed || isMobile ? "Navigation" : "•••"}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {items.map(({ title, url, icon: Icon, badge }) => {
                    const isActive = pathname === url;
                    return (
                      <SidebarMenuItem key={title}>
                        <SidebarMenuButton asChild>
                          <Link
                            href={url}
                            className={`
                              group relative flex items-center gap-3 px-3 py-2.5 rounded-xl 
                              transition-all duration-200 
                              ${
                                isCollapsed && !isMobile
                                  ? "justify-center px-2"
                                  : ""
                              }
                              ${
                                isActive
                                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 transform scale-105"
                                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-600 hover:shadow-sm hover:scale-105"
                              }
                            `}
                            onClick={() => isMobile && setIsCollapsed(true)}
                          >
                            <div className="relative">
                              <Icon
                                size={20}
                                strokeWidth={isActive ? 2.5 : 2}
                                className={`transition-all duration-200 ${
                                  isActive
                                    ? "drop-shadow-sm"
                                    : "group-hover:scale-110"
                                }`}
                              />
                              {badge && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                  {badge}
                                </span>
                              )}
                            </div>

                            {(!isCollapsed || isMobile) && (
                              <div className="flex items-center justify-between w-full">
                                <span className="text-sm font-medium whitespace-nowrap">
                                  {title}
                                </span>
                                {isActive && (
                                  <div className="w-2 h-2 bg-white rounded-full opacity-80" />
                                )}
                              </div>
                            )}

                            {/* Tooltip for collapsed state */}
                            {isCollapsed && !isMobile && (
                              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                {title}
                              </div>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Quick Actions */}
            {(!isCollapsed || isMobile) && (
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Quick Actions
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="space-y-2">
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Search size={16} />
                      Search Tests
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Calendar size={16} />
                      Schedule Run
                    </button>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>

          {/* Footer */}
          <SidebarFooter className="mt-auto p-4 border-t border-gray-200/60 bg-white/80 backdrop-blur-sm">
            {(!isCollapsed || isMobile) && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">U</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">John Doe</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            )}
            {isCollapsed && !isMobile && (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white text-sm font-bold">U</span>
              </div>
            )}
          </SidebarFooter>
        </Sidebar>
      </div>
    </>
  );
}

// Menu items with enhanced data
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Test Report",
    url: "/test-report",
    icon: Upload,
    badge: "",
  },
  {
    title: "To Do List",
    url: "/to-do-list",
    icon: List,
    badge: "12",
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];
