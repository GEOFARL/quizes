import { TokenStorage } from "./jwt/token-storage";
import { LocalStorageStrategy } from "./storage/local-storage";
import { StorageStrategy } from "./storage/storage";

type StorageStrategyConstructor = new () => StorageStrategy;

const getToken = async (
  Strategy: StorageStrategyConstructor = LocalStorageStrategy
): Promise<string> => {
  const strategyInstance = new Strategy();
  const tokenStorage = new TokenStorage(strategyInstance);
  return (await tokenStorage.load()) ?? "";
};

export default getToken;
