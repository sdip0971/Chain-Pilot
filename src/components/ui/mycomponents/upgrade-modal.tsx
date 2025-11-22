"use client"
import React from 'react'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogPortal,
    AlertDialogOverlay,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { authClient } from '@/lib/auth-client';
interface UpgradeModalProp{
    open : boolean,
    onOpenChange : (open:boolean)=>void
}
function UpgradeModal({open,onOpenChange}:UpgradeModalProp) {
  return (
    <div>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Upgrade to Pro</AlertDialogTitle>
            <AlertDialogDescription>
              You need an active subscription to perform this action. Upgrade to
              Pro to unlock all features.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
            //   onClick={() => authClient.checkout({ slug: "pro" })}
            >
              Upgrade Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default UpgradeModal
