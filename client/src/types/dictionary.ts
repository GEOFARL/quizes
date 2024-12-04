import home from "../../public/dictionaries/en/home.json";
import auth from "../../public/dictionaries/en/auth.json";
import global from "../../public/dictionaries/en/global.json";
import quizzes from "../../public/dictionaries/en/quizzes.json";

export type Dictionary = {
  home: typeof home;
  global: typeof global;
  auth: typeof auth;
  quizzes: typeof quizzes;
};
