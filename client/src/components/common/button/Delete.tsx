import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

type Props = {
  onClick: () => void;
};

const DeleteButton: React.FC<Props> = ({ onClick }) => {
  return (
    <Button
      variant="destructive"
      className="h-[32px] w-[32px] [&_svg]:size-3"
      onClick={onClick}
    >
      <Trash />
    </Button>
  );
};

export default DeleteButton;
