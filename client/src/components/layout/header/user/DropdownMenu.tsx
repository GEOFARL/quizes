"use client";
import {
  DropdownMenu as BaseDropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import UserAvatar from "../user/Avatar";
import UserMenu from "./Menu";

type Props = {
  user: string;
};

const DropdownMenu: React.FC<Props> = (props) => {
  return (
    <BaseDropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar {...props} />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56" forceMount>
        <UserMenu {...props} />
      </DropdownMenuContent>
    </BaseDropdownMenu>
  );
};

export default DropdownMenu;
