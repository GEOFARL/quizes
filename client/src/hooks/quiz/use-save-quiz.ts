import { useMutation } from "@tanstack/react-query";
import { quizApi } from "@/api/quiz-api";
import { useToast } from "@/hooks/use-toast";
import getToken from "@/lib/getToken";
import { SaveQuizPayload } from "@/types/quiz/payload";

export const useSaveQuiz = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: SaveQuizPayload) => {
      await quizApi.saveQuiz(data, await getToken());
    },
    onSuccess: () => {
      toast({ title: "Quiz saved successfully!" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving quiz",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
