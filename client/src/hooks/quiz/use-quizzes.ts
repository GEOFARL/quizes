import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { quizApi } from "@/api/quiz-api";
import { GetQuizzesResponse } from "@/types/quiz/response";
import getToken from "@/lib/getToken";

export const useQuizzes = (
  page: number,
  limit: number,
  initialData?: GetQuizzesResponse,
  filters?: { categories?: string[] }
) => {
  const queryClient = useQueryClient();

  console.log("Filters", filters);
  const query = useQuery<GetQuizzesResponse, Error>({
    queryKey: ["quizzes", page, limit],
    queryFn: async () =>
      await quizApi.getQuizzes(
        page,
        limit,
        await getToken(),
        filters?.categories
      ),
    initialData: page === 1 ? initialData : undefined,
    staleTime: 1000,
  });

  const deleteQuiz = useMutation({
    mutationFn: async (quizId: string) => {
      const token = await getToken();
      return quizApi.deleteQuiz(quizId, token);
    },
    onMutate: async (quizId: string) => {
      await queryClient.cancelQueries({ queryKey: ["quizzes"] });

      const previousData = queryClient.getQueryData<GetQuizzesResponse>([
        "quizzes",
        page,
        limit,
        filters?.categories ?? [],
      ]);
      if (previousData) {
        queryClient.setQueryData(["quizzes", page, limit], {
          ...previousData,
          data: previousData.data.filter((quiz) => quiz.id !== quizId),
        });
      }
      return { previousData };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["quizzes", page, limit], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
    },
  });

  return { ...query, deleteQuiz };
};

export default useQuizzes;
