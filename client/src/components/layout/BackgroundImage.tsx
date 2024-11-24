import Image from 'next/image';
import background from '../../../public/background.png';

const BackgroundImage: React.FC = () => {
  return (
    <Image
      src={background}
      alt="background"
      width={2348}
      height={1600}
      className="fixed inset-x-1/2 object-cover w-[2348px] h-[1600px] -z-10 blur-3xl -translate-x-1/2"
    />
  );
};

export default BackgroundImage;
