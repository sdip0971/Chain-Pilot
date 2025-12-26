-- CreateEnum
CREATE TYPE "ExecutionStatus" AS ENUM ('SUCCESS', 'FAILED', 'RUNNING');

-- CreateTable
CREATE TABLE "Execution" (
    "id" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "error" TEXT,
    "errorStack" TEXT,
    "status" "ExecutionStatus" NOT NULL DEFAULT 'RUNNING',
    "completedAt" TIMESTAMP(3),
    "workflowId" TEXT NOT NULL,
    "inngestEventId" TEXT NOT NULL,
    "output" JSONB,

    CONSTRAINT "Execution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Execution_inngestEventId_key" ON "Execution"("inngestEventId");

-- CreateIndex
CREATE INDEX "Connection_workflowId_idx" ON "Connection"("workflowId");

-- CreateIndex
CREATE INDEX "Connection_SourceNodeId_idx" ON "Connection"("SourceNodeId");

-- CreateIndex
CREATE INDEX "Connection_DestinationNodeId_idx" ON "Connection"("DestinationNodeId");

-- CreateIndex
CREATE INDEX "Credentials_userId_idx" ON "Credentials"("userId");

-- CreateIndex
CREATE INDEX "Node_workflowId_idx" ON "Node"("workflowId");

-- CreateIndex
CREATE INDEX "Node_credentialId_idx" ON "Node"("credentialId");

-- CreateIndex
CREATE INDEX "Workflow_userId_idx" ON "Workflow"("userId");

-- CreateIndex
CREATE INDEX "Workflow_id_idx" ON "Workflow"("id");

-- AddForeignKey
ALTER TABLE "Execution" ADD CONSTRAINT "Execution_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
