import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Dictionary } from "@/types/dictionary";

type ConfirmationModalProps = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
  translation: Dictionary;
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  message,
  translation,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{translation.global.modals.confirm.title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-4">
          <Button variant="secondary" onClick={onCancel}>
            {translation.global.modals.confirm.cancel}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {translation.global.modals.confirm.confirm}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
