import { Polar } from "@polar-sh/sdk";
export const polarClient = ()=>{
    accesssToken : process.env.POLAR_ACCESS_TOKEN;
    server: process.env.NODE_ENV !== "production" ? "sandbox" : "production"
}