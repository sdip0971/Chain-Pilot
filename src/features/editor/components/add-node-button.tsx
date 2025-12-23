import { Button } from "@/components/ui/button";
import { NodeSelector } from "@/components/ui/mycomponents/node-selector";
import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";

export const AddNodeButton = memo(() => {
    const [selectorOpen , setSelectorOpen] = useState(false);
  return (
    <NodeSelector open={selectorOpen} onOpenChangeAction={setSelectorOpen}>
      <Button
        onClick={() => {}}
        size="icon"
        variant="outline"
        className="bg-background"
      >
        <PlusIcon />
      </Button>
    </NodeSelector>
  );
});

AddNodeButton.displayName = "AddNodeButton";
