import { User } from "@/lib/user/user";

type Props = {
  user: string;
};

const Info: React.FC<Props> = ({ user }) => {
  const deserializedUser = user ? User.fromString(user) : null;
  return (
    <div className="flex flex-col space-y-1">
      <p className="text-sm font-medium leading-none">
        {deserializedUser?.fullName()}
      </p>
      <p className="text-xs leading-none text-muted-foreground">
        {deserializedUser?.email()}
      </p>
    </div>
  );
};

export default Info;
