import { useState } from "react";
import { TRPCClientError } from "@trpc/client";
import UpgradeModal from "@/components/ui/mycomponents/upgrade-modal";
export const useUpgradeModal = () => {
  const [open, setOpen] = useState(false);

  const handleError = (error: unknown) => {
    if (error instanceof TRPCClientError) {
      if (error.data?.code === "FORBIDDEN") {
        setOpen(true);
        return true;
      }
    }
    return false;
  };

  const modal = <UpgradeModal open={open} onOpenChange={setOpen} />;

  return {
    handleError,
    modal,
  };
};
