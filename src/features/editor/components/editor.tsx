"use client";
import { useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  NodeChange,
  EdgeChange,
  Connection,
  Background,
  Controls,
  MiniMap,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErrorView,LoadingView } from "@/components/ui/mycomponents/entity-components";
import { SidebarTrigger } from "@/components/ui/sidebar";
import useSuspenseWorkFlows, { useSuspenseIndividualWorkFlow, useUpdateWorkflows } from "@/hooks/use-workflows";
import {  SaveIcon } from "lucide-react";
import Link from "next/link";
import { useEffect , useRef , useState } from "react";
import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "./add-node-button";



export const EditorLoading = () => {
  return <LoadingView message="Loading editor..." />;
};

export const EditorError = () => {
  return <ErrorView message="Error loading editor" />;
};
 
const initialNodes = [
  { id: "n1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
  { id: "n2", position: { x: 0, y: 100 }, data: { label: "Node 2" } },
];
const initialEdges = [{ id: "n1-n2", source: "n1", target: "n2" }];
export const Editor = ({ workflowId }: { workflowId: string }) => {

  const { data: workflow } = useSuspenseIndividualWorkFlow(workflowId);
    const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
    const [edges, setEdges] = useState<Edge[]>(workflow.edges);
    const onNodesChange: OnNodesChange = useCallback(
      (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
      [setNodes]
    );
    const onEdgesChange: OnEdgesChange = useCallback(
      (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
      [setEdges]
    );
    const onConnect: OnConnect = useCallback(
      (connection:Connection) => setEdges((eds) => addEdge(connection, eds)),
      [setEdges]
    );
 
  return (
    <div className="  size-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        proOptions={{
          hideAttribution: true,
        }}
        nodeTypes = {nodeComponents}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
        <Panel>
          <AddNodeButton/>  //using panel we can add our custom components in reactflow canvas
        </Panel>
      </ReactFlow>
    </div>
  );
};
export const EditorSaveButton = ({ workflowId }: { workflowId: string }) => {
  return (
    <div className="ml-auto">
      <Button size="sm" onClick={() => {}} disabled={false}>
        <SaveIcon className="size-4" />
        Save
      </Button>
    </div>
  );
};
export const EditorNameInput = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseIndividualWorkFlow(workflowId);
  const updateWorkflow = useUpdateWorkflows();

  const [name, setName] = useState(workflow.name || "");
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (workflow?.name) {
      setName(workflow.name);
    }
  }, [workflow.name]);

 
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select(); 
    }
  }, [isEditing]);

  const handleSave = async () => {
   //exit edit mode
    setIsEditing(false);

    // no change in name so we do none
    if (name === workflow.name) {
      return;
    }

    // update
    try {
      
      await updateWorkflow.mutateAsync({ id: workflowId, name });
    } catch {
      // if error revert to orignal name
      setName(workflow.name || "");
    }
  };

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    }
    if (e.key === "Escape") {
     
      setName(workflow.name || "");
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <BreadcrumbItem>
        <Input
          disabled={updateWorkflow.isPending}
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeydown}
          className="h-6 py-0 px-2 w-[200px]" // Style to match breadcrumb height
        />
      </BreadcrumbItem>
    );
  }

  return (
    <BreadcrumbItem
      onClick={() => setIsEditing(true)}
      className="cursor-pointer hover:underline text-foreground"
    >
      {workflow?.name || "Untitled Workflow"} 
    </BreadcrumbItem>
  );
};
export const EditorBreadCrumbs = ({ workflowId }: { workflowId: string }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link prefetch href="/workflows">
              Workflows
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <EditorNameInput workflowId={workflowId} />
      </BreadcrumbList>
    </Breadcrumb>
  );
}
export const EditorHeader = ({ workflowId }: { workflowId: string }) => {

      return (
        <>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
            <SidebarTrigger />
            <div className="flex flex-row items-center justify-between gap-x-4 w-full">
              <EditorBreadCrumbs workflowId={workflowId} />
              <EditorSaveButton workflowId={workflowId} />
            </div>
          </header>
        </>
      );

}