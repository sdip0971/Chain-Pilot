import { inngest } from "@/inngest/client";
import { sendWorkflowExecution } from "@/inngest/utils";
import { timeStamp } from "console";
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
          evnetId:body.id,
          eventType:body.type,
          timestamp:body.created,
          livemode:body.livemode,
          raw:body.data?.object
        }
        await sendWorkflowExecution({
                workflowId:workflowId,
                initialData:{
                    stripe:formData
                }
            })
            
            
            return NextResponse.json({ success: true });

    }catch(error){
     console.error("Stripe Webhook Error",error)
     return NextResponse.json({success:false,error:"Failed to process Stripe Submission"},{
        status:500
     })
    }
}