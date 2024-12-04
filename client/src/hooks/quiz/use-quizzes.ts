import { useQuery } from "@tanstack/react-query";
import { quizApi } from "@/api/quiz-api";
import { GetQuizzesResponse } from "@/types/quiz/response";
import getToken from "@/lib/getToken";

export const useQuizzes = (
  page: number,
  limit: number,
  initialData?: GetQuizzesResponse
) => {
  return useQuery<GetQuizzesResponse, Error>({
    queryKey: ["quizzes", page, limit],
    queryFn: async () =>
      await quizApi.getQuizzes(page, limit, await getToken()),
    initialData: page === 1 ? initialData : undefined,
    staleTime: 1000,
  });
};

export default useQuizzes;
