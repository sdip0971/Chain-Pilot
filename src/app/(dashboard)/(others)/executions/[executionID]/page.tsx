import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
    params: {
        executionID: string;
    };
}
export default async function ExecutionPage({params}:PageProps) {
    await requireAuth();
    
    const executionID = await params.executionID;
return <div>Execution Page {executionID}</div>;
}
