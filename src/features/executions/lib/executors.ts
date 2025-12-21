import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "./execution-registry";
import ky, { Options as KyOptions } from "ky";
import Handlebars from "handlebars"
import { httpRequestChannel } from "@/inngest/channels/workflowChannel";
export type MANUAL_TRIGGER_DATA = Record<string,unknown>
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
Handlebars.registerHelper("json",(context)=>{
    const jsonString = JSON.stringify(context,null,2)
    const safestring = new Handlebars.SafeString(jsonString)
    return safestring
});
export type HTTP_TRIGGER_DATA = {
    variableName: string
    endpoint:string,
    body?:string
    method  : "GET" | "PUT" | "POST" | "DELETE"
}

export const httprequestexecutor : NodeExecutor<HTTP_TRIGGER_DATA> = async({
    nodeId,
    context,
    step,
    data,
    publish

})=>{

// publish loading state for http request

if(!data.endpoint){
    throw new NonRetriableError("Endpoint is missing")
}

if(!data.method){
    throw new NonRetriableError("Method not configured")
}

const result = await step.run("http-request",async()=>{
    const method = data.method || "GET"
    const endpoint = Handlebars.compile(data.endpoint)(context);
    // Handle bar is going to read this data.ednpoint which looks like https://...//{{todo.httpResponse.data.userId}}
    // and populate {todo.httpResponse.data.userId} from the context in which we have all previous data and compile {{todo.httpResponse.data.userId} to whatever the user id is
    if(!data.endpoint){ 
        throw new NonRetriableError("No Enpoint Configured ")
    }
    if(!data.method ){
          throw new NonRetriableError("No method Configured ")
    }
   
    const options :KyOptions = {method};
    if(["POST","PUT","PATCH"].includes(method)){
        const resolved = Handlebars.compile(data.body || "{}"  )(context) //json parse will fail if we dont pass anything so an empty object
        JSON.parse(resolved)
        options.body =resolved
        options.headers = {
            "Content-Type" : "application/json",
        }
    }
    const response = await ky(endpoint,options)
   
    const responseData = await response.json().catch(()=>response.text())
     const responsePayload = {
        hhtpResponse : {
        status:response.status,
        statusText:response.statusText,
        data:responseData,
    } 
    }
    
    return response
})
if (data.variableName && data.variableName.trim() !== "") {
    return {
      ...context,
      [data.variableName]: result,
    };
  }
// publish success state for http request 
return context

}
