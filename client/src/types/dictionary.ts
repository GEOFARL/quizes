type Home = {
  title: string;
};
type Global = {
  auth: {
    signOut: string;
    signIn: string;
    signUp: string;
  };
  theme: {
    name: string;
    light: string;
    dark: string;
  };
  language: string;
};
export type Dictionary = {
  home: Home;
  global: Global;
};
