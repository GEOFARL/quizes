"use client";

import PaginationComponent from "@/components/common/Pagination";
import MaxWidthWrapper from "@/components/utils/MaxWidthWrapper";
import useQuizzes from "@/hooks/quiz/use-quizzes";
import { Dictionary } from "@/types/dictionary";
import { Pagination as PaginationType } from "@/types/pagination";
import { Quiz } from "@/types/quiz/quiz";
import { useEffect, useState } from "react";
import QuizCard from "./QuizCard";
import ConfirmationModal from "@/components/common/modal/Confirm";
import { useCategories } from "@/hooks/categories/use-categories";
import MultiSelect from "@/components/common/MultiSelect";

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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const {
    data,
    isLoading,
    refetch,
    deleteQuiz: { mutate },
  } = useQuizzes(
    currentPage,
    pagination.limit,
    {
      data: quizzes,
      pagination,
    },
    { categories: selectedCategories }
  );

  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategories();

  const categories = categoriesData?.data.map((category) => ({
    id: category.id,
    name: category.name,
    icon: (
      <div
        style={{ backgroundColor: category.color }}
        className="h-4 w-4 rounded-full"
      />
    ),
  }));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const openConfirmationModal = (quizId: string) => {
    setDeletingQuizId(quizId);
  };

  useEffect(() => {
    refetch();
    setTotalQuizzes(data?.pagination?.total ?? 0);
  }, [selectedCategories, refetch, setTotalQuizzes, data]);

  return (
    <MaxWidthWrapper className="space-y-4 w-full">
      {
        <div className="w-80">
          {categoriesLoading ? (
            <div className="animate-pulse h-10 bg-gray-200 rounded-md" />
          ) : (
            <MultiSelect
              options={categories || []}
              selectedOptions={selectedCategories}
              setSelectedOptions={setSelectedCategories}
              translation={translation}
            />
          )}
        </div>
      }
      {(data?.data?.length ?? 0) === 0 && (
        <p className="text-center text-lg font-semibold text-gray-500 dark:text-gray-300">
          {translation.quizzes.noQuizzes}
        </p>
      )}

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
      {totalPages > 1 && (
        <PaginationComponent
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalPages={totalPages}
          translation={translation}
        />
      )}
    </MaxWidthWrapper>
  );
};

export default QuizzesList;
