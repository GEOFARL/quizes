import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import SignOut from "../actions/SignOut";
import UserInfo from "./Info";
import { Dictionary } from "@/types/dictionary";

type Props = {
  user: string;
  translation: Dictionary;
};

const Menu: React.FC<Props> = (props) => {
  return (
    <>
      <DropdownMenuLabel className="font-normal">
        <UserInfo {...props} />
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <SignOut variant={"ghost"} translation={props.translation} />
      </DropdownMenuItem>
    </>
  );
};

export default Menu;
