import { requireUnAuth } from "@/lib/auth-utils";

const Page = async()=>{
    await requireUnAuth();
return <div>
    
</div>
}
export default Page;