import { requireAuth } from "@/lib/auth-utils";

interface Pageprops{
    params:Promise<{
        credentialID:string
    }>

}
export default async function Credentials({params}:Pageprops){
    await requireAuth()
    
    const {credentialID}=await params;
    return <div>Credentials Page{credentialID}</div>; 
}