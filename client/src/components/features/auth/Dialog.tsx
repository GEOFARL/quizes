"use client";

import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import {
  Dialog as BaseDialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

type Props = {
  title?: string;
  description?: string;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  className?: string;
} & PropsWithChildren;

const Dialog: React.FC<Props> = ({
  children,
  title,
  description,
  onOpenChange,
  open,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    if (typeof open === "boolean") {
      setIsOpen(open);
    }
  }, [open]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      onOpenChange?.(open);
      setIsOpen(open);
    },
    [onOpenChange]
  );

  return (
    <BaseDialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className={className}>
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
