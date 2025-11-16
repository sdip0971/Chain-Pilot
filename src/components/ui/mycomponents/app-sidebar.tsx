"use client"
import {
    CreditCardIcon,
    LogOutIcon,
    FolderOpen,
    KeyIcon,
    StarIcon,
    HistoryIcon,
    icons
} from "lucide-react"
import { Sidebar, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { title } from "process"
import { SidebarContent } from "../sidebar"
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime"
const menuitems = [
  {
    title: "Workflows",
    items: [
      {
        title: "All Workflows",
        icon: FolderOpen,
        url: "/workflows",
      },
    ],
  },
  {
    title: "Credentials",
    items: [
      {
        title: "Credentials",
        icon: KeyIcon,
        url: "/credentials",
      },
    ],
  },
  {
    title: "Executions",
    items: [
      {
        title: "Executions",
        icon: HistoryIcon,
        url: "/executions",
        },
    ],
  }
];
function AppSidebar() {
    const router =useRouter()
    const pathname = usePathname();
  return (
    <div>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-12 px-3">
              <Link prefetch href="/">
                <Image src="/logo.svg" alt="Nodebase" width={30} height={30} />
                <span className="ml-2 font-bold text-xl">ChainPilot</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarHeader>
        <SidebarContent>
          {menuitems.map((Group) => {
            return (
              <>
                <SidebarGroup key={Group.title}>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {Group.items.map((item) => {
                        return (
                          <>
                            <SidebarMenuItem key={item.title}>
                              <SidebarMenuButton
                                tooltip={item.title}
                                isActive={
                                  item.url === "/"
                                    ? pathname === "/"
                                    : pathname.startsWith(item.url)
                                }
                                asChild
                                className="gap-x-4 h-10 px-4"
                              >
                                <Link href={item.url} prefetch>
                                  {/* Link can prefetch what is in href so that page loads faster as if it was cached */}
                                  <item.icon className="size-4" />
                                  <span>{item.title}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </>
            );
          })}
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Billing Portal"
                className="gap-x-4 h-10 px-4"
                onClick={() => {}}
              >
                <CreditCardIcon className="h-4 w-4" />
                <span>Billing Portal</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </div>
  );

}

export default AppSidebar
