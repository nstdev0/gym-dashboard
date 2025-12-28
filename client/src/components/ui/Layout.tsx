import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden h-full w-full">
        <AppHeader />
        <main className="flex-1 overflow-hidden p-4">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}