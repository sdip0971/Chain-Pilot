"use client";

import { useCallback } from "react";
import { useReactFlow } from "@xyflow/react";
import { GlobeIcon, MousePointerIcon } from "lucide-react";
import { toast } from "sonner";
import { createId } from "@paralleldrive/cuid2";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NodeType } from "@prisma/clients";



type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
};

const triggerNodes: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Trigger manually",
    description:
      "Runs the flow on clicking a button. Good for getting started quickly",
    icon: MousePointerIcon,
  },
  {
    type: NodeType.GOOGLE_FORM_TRIGGER,
    label: "Google Form submission",
    description: "Runs when a Google Form receives a response",
    icon: "/icons/google-forms.svg",
  },
  {
    type: NodeType.STRIPE_TRIGGER,
    label: "Stripe Event",
    description: "Runs when a Stripe event is captured",
    icon: "/icons/stripe.svg",
  },
];

const executionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Makes an HTTP request",
    icon: GlobeIcon,
  },
  {
    type: NodeType.GEMINI,
    label: "Gemini",
    description: "Makes a Gemini API call",
    icon: "/icons/image.svg",
  },
  {
    type: NodeType.ANTHROPIC,
    label: "Anthropic",
    description: "Makes an Anthropic API call",
    icon: "/icons/ant.png",
  },
  {
    type: NodeType.OPENAI,
    label: "OPENAI",
    description: "Makes an OpenAI API call",
    icon: "/icons/openai-svgrepo-com.svg",
  },
];



export function NodeSelector({
  open,
  onOpenChangeAction,
  children,
}: {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  children?: React.ReactNode;
}) {
  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

  const handleNodeSelect = useCallback(
    (selection: NodeTypeOption) => {
      if (
        selection.type === NodeType.MANUAL_TRIGGER &&
        getNodes().some((n) => n.type === NodeType.MANUAL_TRIGGER)
      ) {
        toast.error("Manual Trigger already exists");
        return;
      }

     setNodes((nodes) => {
        // 2. Check for the Initial/Placeholder Node (The Fix)
        const hasInitialTrigger = nodes.some(
          (node) => node.type === NodeType.INITIAl 
        );

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const flowPosition = screenToFlowPosition({
          x: centerX + (Math.random() - 0.5) * 200,
          y: centerY + (Math.random() - 0.5) * 200,
        });

        const newNode = {
          id: createId(),
          type: selection.type,
          position: flowPosition,
          data: {},
        };

     
        if (hasInitialTrigger) {
          return [newNode];
        }

        return [...nodes, newNode];
      });

      toast.success(`${selection.label} added`);
      onOpenChangeAction(false);
    },
    [getNodes, screenToFlowPosition, setNodes, onOpenChangeAction]
  );

  

  const renderCard = (node: NodeTypeOption) => {
    const Icon = node.icon as any;

    return (
      <div
        key={node.type}
        onClick={() => handleNodeSelect(node)}
        className="
          group relative cursor-pointer
          rounded-xl p-4
          bg-background/60
          backdrop-blur
          shadow-[0_8px_24px_rgba(0,0,0,0.08)]
          transition-all duration-300
          hover:-translate-y-0.5
          hover:shadow-[0_16px_40px_rgba(0,0,0,0.16)]
          overflow-hidden
        "
      >
        {/* accent bar */}
        <div className="absolute left-0 top-0 h-full w-0.75 bg-linear-to-b from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* shimmer */}
        <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.08),transparent)] opacity-0 group-hover:opacity-100 animate-shimmer" />

        <div className="relative flex items-center gap-4">
          <div
            className="
            h-11 w-11 rounded-xl
            bg-linear-to-br from-muted via-muted/70 to-muted/40
            ring-1 ring-border
            flex items-center justify-center
            shadow-inner
          "
          >
            {typeof node.icon === "string" ? (
              <img src={node.icon} className="h-5 w-5" />
            ) : (
              <Icon className="h-5 w-5" />
            )}
          </div>

          <div>
            <div className="font-semibold">{node.label}</div>
            <div className="text-xs text-muted-foreground">
              {node.description}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChangeAction}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent
        side="right"
        className="
          p-0 w-full sm:max-w-md
          bg-linear-to-b from-background via-background/95 to-background/90
        "
      >
        {/* Sticky header */}
        <SheetHeader className="sticky top-0 z-10 px-6 py-5 bg-background/80 backdrop-blur border-b">
          <SheetTitle>What triggers this workflow?</SheetTitle>
          <SheetDescription>
            A trigger is a step that starts your workflow.
          </SheetDescription>
        </SheetHeader>

        {/* CONTENT */}
        <div className="p-5 space-y-10">
          {/* TRIGGERS */}
          <section className="space-y-4">
            <div className="text-xs font-bold tracking-widest text-muted-foreground">
              TRIGGERS
            </div>
            <div className="space-y-3">{triggerNodes.map(renderCard)}</div>
          </section>

          {/* ACTIONS */}
          <section className="space-y-4">
            <div className="text-xs font-bold tracking-widest text-muted-foreground">
              ACTIONS
            </div>
            <div className="space-y-3">{executionNodes.map(renderCard)}</div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
