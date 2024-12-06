import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

type Props = {
  className?: string;
  disableAnimation?: boolean;
} & PropsWithChildren;

const Animated: React.FC<Props> = ({
  className,
  children,
  disableAnimation,
}) => {
  return (
    <motion.div
      layout={!disableAnimation}
      initial={disableAnimation ? undefined : { opacity: 0, scale: 0.95 }}
      animate={disableAnimation ? undefined : { opacity: 1, scale: 1 }}
      exit={disableAnimation ? undefined : { opacity: 0, scale: 0.95 }}
      transition={disableAnimation ? undefined : { duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default Animated;
