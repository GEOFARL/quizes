import { TokenStorage } from "./jwt/token-storage";
import { LocalStorageStrategy } from "./storage/local-storage";

const getToken = async (): Promise<string> => {
  return (await new TokenStorage(new LocalStorageStrategy()).load()) ?? "";
};

export default getToken;
