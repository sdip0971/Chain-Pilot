"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExecutionStatus } from "@/generated/prisma/enums";
import { useSuspenseIndividualExecution } from "@/hooks/use-execution";
import { CheckCircle2, Loader2, XCircle, ChevronDown } from "lucide-react";

interface StatusConfigAttrs {
  icon: React.ElementType;
  label: string;
  gradient: string;
  bg: string;
  text: string;
  ring: string;
}

export const ExecutionView = ({ executionId }: { executionId: string }) => {
  const { data: execution } = useSuspenseIndividualExecution(executionId);
  const [showDetails, setShowDetails] = useState(false);

  if (!execution) return null;

  const statusConfigMap: Record<ExecutionStatus, StatusConfigAttrs> = {
    SUCCESS: {
      icon: CheckCircle2,
      label: "Success",
      gradient: "from-emerald-400 to-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      text: "text-emerald-600 dark:text-emerald-400",
      ring: "ring-emerald-300/40",
    },
    FAILED: {
      icon: XCircle,
      label: "Failed",
      gradient: "from-rose-400 to-rose-600",
      bg: "bg-rose-50 dark:bg-rose-900/20",
      text: "text-rose-600 dark:text-rose-400",
      ring: "ring-rose-300/40",
    },
    RUNNING: {
      icon: Loader2,
      label: "Running",
      gradient: "from-blue-400 to-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-600 dark:text-blue-400",
      ring: "ring-blue-300/40",
    },
    CANCELLED: {
      icon: XCircle,
      label: "Cancelled",
      gradient: "from-slate-400 to-slate-600",
      bg: "bg-slate-100 dark:bg-slate-900/20",
      text: "text-slate-600 dark:text-slate-400",
      ring: "ring-slate-300/40",
    },
  };

  const status = execution.status as ExecutionStatus;
  const config = statusConfigMap[status];
  const StatusIcon = config.icon;



  const duration =
    execution.completedAt &&
    Math.round(
      (new Date(execution.completedAt).getTime() -
        new Date(execution.startedAt).getTime()) /
        1000
    );

  return (
    <Card className="relative h-full overflow-hidden border bg-background/70 backdrop-blur transition-all hover:shadow-lg hover:-translate-y-px">
      <div
        className={`absolute inset-y-0 left-0 w-1 bg-linear-to-b ${config.gradient}`}
      />

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`relative flex h-12 w-12 items-center justify-center rounded-xl ring-2 ${config.bg} ${config.text} ${config.ring}`}
            >
              {status === "RUNNING" && (
                <span className="absolute inset-0 rounded-xl animate-ping bg-blue-400/20" />
              )}
              <StatusIcon
                className={`relative h-6 w-6 ${
                  status === "RUNNING" ? "animate-spin" : ""
                }`}
              />
            </div>

            <div>
              <CardTitle className="text-lg leading-tight">
                {execution.workflow.name}
              </CardTitle>
              <CardDescription className="text-xs">
                Execution&nbsp;
                <span className="font-mono text-muted-foreground">
                  {execution.id}
                </span>
              </CardDescription>
            </div>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${config.bg} ${config.text}`}
          >
            {config.label}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* metadata row */}
        <div className="grid grid-cols-2 gap-6 rounded-lg border bg-muted/40 p-4">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Workflow
            </p>
            <Link
              href={`workflows/${execution.workflowId}`}
              className="text-sm font-medium hover:underline"
            >
              {execution.workflow.name}
            </Link>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Duration
            </p>
            <p className="text-sm font-medium">
              {duration ? `${duration}s` : "—"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowDetails((v) => !v)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              showDetails ? "rotate-180" : ""
            }`}
          />
          {showDetails ? "Hide execution output" : "Show execution output"}
        </button>

        {showDetails && (
          <div className="-mx-6">
            <pre
              className="max-h-[60vh]
      overflow-auto
      border-t
      bg-muted
      px-6
      py-4
      text-xs
      font-mono
      whitespace-pre-wrap
      wrap-break-word"
            >
              {typeof execution.output === "string"
                ? execution.output
                : JSON.stringify(execution.output, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
