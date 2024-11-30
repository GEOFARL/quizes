const Hero: React.FC = () => {
  return (
    <section className="px-4 sm:px-8">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-center text-gray-800 dark:text-white">
        Questions Generator
      </h1>

      <p className="mt-2 sm:mt-4 text-center text-muted-foreground text-sm lg:text-md max-w-3xl mx-auto">
        Enter a passage of text, and let our generator create a list of
        interactive and insightful questions for you to use. Perfect for
        quizzes, exams, or just expanding knowledge!
      </p>
    </section>
  );
};

export default Hero;
