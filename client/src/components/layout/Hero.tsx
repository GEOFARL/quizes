import { Dictionary } from "@/types/dictionary";

type Props = {
  translation: Dictionary;
};

const Hero: React.FC<Props> = ({ translation }) => {
  return (
    <section className="px-4 sm:px-8">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-center text-gray-800 dark:text-white">
        {translation.home.hero.title}
      </h1>

      <p className="mt-2 sm:mt-4 text-center text-muted-foreground text-sm lg:text-md max-w-3xl mx-auto">
        {translation.home.hero.description}
      </p>
    </section>
  );
};

export default Hero;
