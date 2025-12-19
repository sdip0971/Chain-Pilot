import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "./execution-registry";
import ky, { Options as KyOptions } from "ky";
type MANUAL_TRIGGER_DATA = Record<string,unknown>
export const manualtriggerexecutor : NodeExecutor<MANUAL_TRIGGER_DATA> = async({
    nodeId,
    context,
    step

})=>{
// publish loading state for manual trigger
const result = await step.run("manual-trigger",async()=>context)
// publish success state for manualTrigger 
return result

}
type HTTP_TRIGGER_DATA = {
    endpoint?:string,
    body?:string
    method? : "GET" | "PUT" | "POST" | "DELETE"
}

export const httprequestexecutor : NodeExecutor<HTTP_TRIGGER_DATA> = async({
    nodeId,
    context,
    step,
    data

})=>{

// publish loading state for http request
if(!data.endpoint){
    throw new NonRetriableError("Endpoint is missing")
}
const result = await step.run("http-request",async()=>{
    const method = data.method || "GET"
    const endpoint = data.endpoint!;
    const options :KyOptions = {method};
    if(["POST","PUT","PATCH"].includes(method)){
        options.body =data?.body
    }
    const response = await ky(endpoint,options)
    const responseData = await response.json().catch(()=>response.text())
    return {
        ...context,
        httpResponse : {
            status:response.status,
            statusText:response.statusText,
            data:responseData
        }
    }
})
// publish success state for http request 
return result

}
