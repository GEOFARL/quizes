import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X } from "lucide-react";
import { memo, useEffect, useRef } from "react";

type Props = {
  value: string;
  updateValue: (value: string) => void;
  save: () => void;
  cancelEditing: () => void;
};

const EditText: React.FC<Props> = memo(
  ({ value, updateValue, save, cancelEditing }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      inputRef.current?.focus();
    }, []);

    return (
      <div className="flex items-center space-x-2 w-full">
        <Input
          value={value}
          onChange={(e) => updateValue(e.target.value)}
          className="flex-1"
          ref={inputRef}
        />
        <Button size="sm" variant="ghost" onClick={save}>
          <Check />
        </Button>
        <Button size="sm" variant="ghost" onClick={cancelEditing}>
          <X />
        </Button>
      </div>
    );
  }
);

export default EditText;
