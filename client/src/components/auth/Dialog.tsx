"use client";

import { PropsWithChildren, useCallback, useState } from "react";
import {
  Dialog as BaseDialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useRouter } from "next/navigation";

type Props = {
  title: string;
  description: string;
} & PropsWithChildren;

const Dialog: React.FC<Props> = ({ children, title, description }) => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        router.back();
      }
      setIsOpen(open);
    },
    [router]
  );

  return (
    <BaseDialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </BaseDialog>
  );
};

export default Dialog;
