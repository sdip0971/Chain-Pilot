import Link from "next/link";
import React from "react";
import Image from "next/image";
export default function Layout({children}:{children : React.ReactNode}){
    return (
        <div>
            <div className="bg-muted flex min-h-svh flex-col justify-center gap-6 items-center p-6 md:p-10 min-w-screen">
    <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href='/' className="flex items-center gap-2 self-center font-medium">
        <Image src="/logo.svg" alt="NoeBase" width={30} height={30}/>NodeBase</Link>
    {children}
</div>
</div>
        </div>
    )
}