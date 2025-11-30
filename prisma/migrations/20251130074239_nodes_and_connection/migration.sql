-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('INITIAl');

-- CreateTable
CREATE TABLE "Node" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "NodeType" NOT NULL,
    "position" JSONB NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workflowId" TEXT NOT NULL,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Connection" (
    "id" TEXT NOT NULL,
    "SourceNodeId" TEXT NOT NULL,
    "DestinationNodeId" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "fromOutput" TEXT NOT NULL DEFAULT 'main',
    "toInput" TEXT NOT NULL DEFAULT 'main',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Connection_SourceNodeId_DestinationNodeId_fromOutput_toInpu_key" ON "Connection"("SourceNodeId", "DestinationNodeId", "fromOutput", "toInput", "workflowId");

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_SourceNodeId_fkey" FOREIGN KEY ("SourceNodeId") REFERENCES "Node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_DestinationNodeId_fkey" FOREIGN KEY ("DestinationNodeId") REFERENCES "Node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
