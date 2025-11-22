import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
    params: {
        workflowID: string;
    };
}
export default async function WorkFlowPage({params}:PageProps) {

      await requireAuth()
    const workflowId =  await params.workflowID;
return <div>WorkFlow page</div>;
}
