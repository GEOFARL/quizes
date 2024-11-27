import { Avatar as BaseAvatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/lib/user/user";

type Props = {
  user: string;
};

const Avatar: React.FC<Props> = ({ user }) => {
  const deserializedUser = user ? User.fromString(user) : null;
  return (
    <BaseAvatar className="h-10 w-10">
      <AvatarFallback className="text-base">
        {deserializedUser
          ?.fullName()
          ?.split(" ")
          ?.map((v) => v.at(0)?.toUpperCase())
          ?.join("")}
      </AvatarFallback>
    </BaseAvatar>
  );
};

export default Avatar;
