import { inngest } from "@/inngest/client";
import { sendWorkflowExecution } from "@/inngest/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try{
        const url = new URL(req.url)
        const workflowId = url.searchParams.get("workflowId")
        if(!workflowId){
            throw new Error("Missing required query param: WorkFlow Id ")
        }
        const body = await req.json()
        const formData = {
            formId : body.formId,
            formtitle:body.formTitle,
            responseId : body.responseId,
            timestamp : body.timestamp,
            respondentEmail:body.respondentEmail,
            response: body.response,
            raw:body,

        }
        await sendWorkflowExecution({
                workflowId:workflowId,
                initialData:{
                    googleForm:formData
                }
            })

    }catch(error){
     console.error("Google Form Webhook Error",error)
     return NextResponse.json({success:false,error:"Failed to process Google Form Submission"},{
        status:500
     })
    }
}