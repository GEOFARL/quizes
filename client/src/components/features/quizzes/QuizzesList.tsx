"use client";

import PaginationComponent from "@/components/common/Pagination";
import MaxWidthWrapper from "@/components/utils/MaxWidthWrapper";
import useQuizzes from "@/hooks/quiz/use-quizzes";
import { Dictionary } from "@/types/dictionary";
import { Pagination as PaginationType } from "@/types/pagination";
import { Quiz } from "@/types/quiz/quiz";
import { useState } from "react";
import QuizCard from "./QuizCard";
import ConfirmationModal from "@/components/common/modal/Confirm";

type QuizzesListProps = {
  quizzes: Quiz[];
  translation: Dictionary;
  pagination: PaginationType;
};

const QuizzesList: React.FC<QuizzesListProps> = ({
  quizzes,
  translation,
  pagination,
}) => {
  const [openQuizId, setOpenQuizId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(pagination.page);
  const [totalQuizzes, setTotalQuizzes] = useState<number>(pagination.total);
  const totalPages = Math.ceil(totalQuizzes / pagination.limit);
  const [deletingQuizId, setDeletingQuizId] = useState<string | null>(null);

  const {
    data,
    isLoading,
    deleteQuiz: { mutate },
  } = useQuizzes(currentPage, pagination.limit, {
    data: quizzes,
    pagination,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const openConfirmationModal = (quizId: string) => {
    setDeletingQuizId(quizId);
  };

  return (
    <MaxWidthWrapper className="space-y-4 w-full">
      {(isLoading ? quizzes : data?.data ?? []).map((quiz) => (
        <QuizCard
          key={quiz.id}
          quiz={quiz}
          translation={translation}
          openQuizId={openQuizId}
          setOpenQuizId={setOpenQuizId}
          onDelete={() => openConfirmationModal(quiz.id)}
        />
      ))}

      {!!deletingQuizId && (
        <ConfirmationModal
          translation={translation}
          isOpen={!!deletingQuizId}
          onConfirm={() => {
            mutate(deletingQuizId ?? "", {
              onSettled: () => {
                setTotalQuizzes((prevTotal) => prevTotal - 1);
                if (data?.data.length === 1 && currentPage > 1) {
                  setCurrentPage((prev) => prev - 1);
                }
              },
            });
            setDeletingQuizId(null);
          }}
          onCancel={() => setDeletingQuizId(null)}
          message={translation.quizzes.card.confirmDelete.message}
        />
      )}

      <PaginationComponent
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalPages={totalPages}
        translation={translation}
      />
    </MaxWidthWrapper>
  );
};

export default QuizzesList;
