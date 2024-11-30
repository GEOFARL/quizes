import { PropsWithChildren } from "react";

type Props = PropsWithChildren;

const ScreenWrapper: React.FC<Props> = ({ children }) => {
  return <div className="mt-[50px] md:mt-[125px] mx-4 md:mx-0">{children}</div>;
};

export default ScreenWrapper;
