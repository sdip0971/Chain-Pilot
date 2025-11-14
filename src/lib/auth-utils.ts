import { headers } from "next/headers";
import { redirect } from "next/navigation";
 import { auth } from "./auth";
 //next.js middleware specifically should be for better user experience not last line of defense because of sevral instances where middleware has been broken into so we simply use this layer to protect our pages 
 // on page.tsx => await requireAuth() => to protect auth pages
 // on page.tsx => await requireUnAuth() => to protect unauth pages like login page


 export const requireAuth =async()=>{
   const session = await auth.api.getSession({
     headers: await headers(),
   });
  
    if(session){
        redirect("/");
    }
    return session;
 }
 export const requireUnAuth = async () => {
   const session = await auth.api.getSession({
     headers: await headers(),
   });
   if (session) {
     redirect("/");
   }
 
 };
