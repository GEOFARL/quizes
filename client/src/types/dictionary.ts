import home from "../../public/dictionaries/en/home.json";
import auth from "../../public/dictionaries/en/auth.json";
import global from "../../public/dictionaries/en/global.json";

export type Dictionary = {
  home: typeof home;
  global: typeof global;
  auth: typeof auth;
};
