import { AppHeader } from "@/components/ui/mycomponents/app-header"

const Layout = ({children}:{children:React.ReactNode})=>{
    return (
        <>
        <AppHeader/>
        <main className="flex-1">{children}</main>

            </>
    )
}