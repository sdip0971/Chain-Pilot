import AppSidebar from "@/components/ui/mycomponents/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";


function Dashboardlayout({ children }: { children: React.ReactNode }) {
return (
    <SidebarProvider>
        <AppSidebar/>
        <SidebarInset>
            {children}
        </SidebarInset>

    </SidebarProvider>
)
}
export default Dashboardlayout;