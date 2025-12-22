"use client";
import { useCallback, useMemo } from "react";
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
import useSuspenseWorkFlows, { useAutoSaveWorkflow, useSuspenseIndividualWorkFlow, useUpdateWorkflow, useUpdateWorkflows } from "@/hooks/use-workflows";
import {  SaveIcon } from "lucide-react";
import Link from "next/link";
import { useEffect , useRef , useState } from "react";
import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "./add-node-button";
import { useAtomValue, useSetAtom } from "jotai";
import { editorAtom } from "../store/atoms";
import { NodeType } from "@/generated/prisma/enums";
import ExecuteButton from "@/components/ui/mycomponents/execute-button";



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
  const setEditor = useSetAtom(editorAtom)

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
    const hasManualTrigger = useMemo(()=>{
      return nodes.some((node)=>node.type===NodeType.MANUAL_TRIGGER)
    } , [nodes])
    const autoSave = useAutoSaveWorkflow();
    useEffect(() => {
    // Debounce to prevent saving on every pixel of movement
    const timeoutId = setTimeout(() => {
      autoSave.mutate({
        id: workflowId,
        nodes,
        edges,
      });
    }, 1000); // 1 second delay

    return () => clearTimeout(timeoutId);
  }, [nodes, edges, workflowId]);

  return (
     <div className="relative h-full w-full bg-gradient-to-r from-background via-background to-muted/20">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setEditor}
        proOptions={{
          hideAttribution: true,
        }}
        nodeTypes = {nodeComponents}
        fitView
        snapGrid={[10,10]}
        snapToGrid
        panOnScroll
        panOnDrag={false}
        selectionOnDrag
        
      >

            
{/* //     How it works at runtime: */}

{/* // React Flow sees a node object: { type: "HTTP_REQUEST", ... }. */}
{/* 
// It looks at nodeTypes prop.
// It finds the key "HTTP_REQUEST".
// It grabs the value HttpRequestNode from /config/node-components.ts
// It renders <HttpRequestNode />. */}
 
         <Background gap={22} size={1} color="rgba(120,120,120,0.18)" />
        <Controls />
        <MiniMap />
        <Panel>
          <AddNodeButton/>  
          {/* using panel we can add our custom components in reactflow canvas */}
        </Panel>
         {
            hasManualTrigger && (
              <Panel position="bottom-center">
                <ExecuteButton workflowId ={workflowId}/>
                </Panel>
            )
          }
      </ReactFlow>
    </div>
  );
};
export const EditorSaveButton = ({ workflowId }: { workflowId: string }) => {
  const editor = useAtomValue(editorAtom)
  const saveWorkflow = useUpdateWorkflow()
  const handleSave = async ()=>{
    if(!editor) return
    const nodes = editor.getNodes()
    const edges = editor.getEdges()
    saveWorkflow.mutate({id:workflowId,
      nodes,edges
    })
  }
  return (
    <div className="ml-auto">
      <Button size="sm" onClick={handleSave} disabled={saveWorkflow.isPending}>
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