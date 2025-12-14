import { Home, NotebookPen, NotebookTabs, Users } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/admin/dashboard/inicio",
    icon: Home,
  },
  {
    title: "Miembros",
    url: "/admin/dashboard/miembros#",
    icon: Users,
  },
  {
    title: "Planes",
    url: "/admin/dashboard/planes#",
    icon: NotebookTabs,
  },
  {
    title: "Membresías",
    url: "/admin/dashboard/membresias#",
    icon: NotebookPen,
  },
  {
    title: "Usuarios",
    url: "/admin/dashboard/usuarios#",
    icon: Users,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}