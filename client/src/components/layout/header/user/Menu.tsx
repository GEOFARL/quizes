import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import SignOut from "../actions/SignOut";
import UserInfo from "./Info";

type Props = {
  user: string;
};

const Menu: React.FC<Props> = (props) => {
  return (
    <>
      <DropdownMenuLabel className="font-normal">
        <UserInfo {...props} />
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <SignOut variant={"ghost"} />
      </DropdownMenuItem>
    </>
  );
};

export default Menu;
