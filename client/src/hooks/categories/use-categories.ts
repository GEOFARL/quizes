import { categoryApi } from "@/api/category-api";
import getToken from "@/lib/getToken";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const token = await getToken();
      return categoryApi.getCategories(token);
    },
  });
};
