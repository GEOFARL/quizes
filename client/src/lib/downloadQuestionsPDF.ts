/* eslint-disable @typescript-eslint/no-explicit-any */

import { Dictionary } from "@/types/dictionary";
import { GenerateQuestionsResponse } from "@/types/questions/response";
import { jsPDF } from "jspdf";
import { v4 as uuidv4 } from "uuid";

const downloadPDFQuestionsPDF = (
  translation: Dictionary,
  questions: GenerateQuestionsResponse["questions"]
) => {
  const doc = new jsPDF();
  const fileName = `questions-${uuidv4().slice(0, 8)}.pdf`;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;
  const lineHeight = 7;
  const topPadding = 20;
  let cursorY = margin + topPadding;

  doc.setFont("times", "bold");
  doc.setFontSize(20);
  const title = translation.home.questions.title;
  const wrappedTitle = doc.splitTextToSize(title, contentWidth);
  doc.text(wrappedTitle, margin, cursorY);
  cursorY += wrappedTitle.length * lineHeight + 5;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 10;

  questions.forEach((question, index) => {
    const questionText = `${index + 1}. ${question.question}`;
    const wrappedQuestion = doc.splitTextToSize(questionText, contentWidth);
    const questionHeight = wrappedQuestion.length * lineHeight;

    const wrappedOptions: { text: string[]; isCorrect: boolean }[] = [];
    let optionsHeight = 0;
    if (question.options && question.options.length > 0) {
      question.options.forEach((option, optIndex) => {
        const optionLabel = `  ${String.fromCharCode(
          97 + optIndex
        )}) ${option}`;
        const wrappedOption = doc.splitTextToSize(optionLabel, contentWidth);
        wrappedOptions.push({
          text: wrappedOption,
          isCorrect: question.correctAnswers.includes(option),
        });
        optionsHeight += wrappedOption.length * lineHeight;
      });
    }

    const explanationText = question.explanation
      ? `${translation.home.questions.explanation}: ${question.explanation}`
      : "";
    const wrappedExplanation = doc.splitTextToSize(
      explanationText,
      contentWidth
    );
    const explanationHeight = question.explanation
      ? wrappedExplanation.length * lineHeight + 5
      : 0;

    const totalHeight = questionHeight + optionsHeight + explanationHeight + 10;

    if (cursorY + totalHeight > pageHeight - margin) {
      doc.addPage();
      cursorY = margin + topPadding;
    }

    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.text(wrappedQuestion, margin, cursorY);
    cursorY += questionHeight + 5;

    wrappedOptions.forEach(({ text, isCorrect }) => {
      if (isCorrect) {
        doc.setTextColor(0, 128, 0);
        doc.setFont("times", "bold");
      } else {
        doc.setTextColor(0, 0, 0);
        doc.setFont("times", "normal");
      }

      text.forEach((line) => {
        doc.text(line, margin + 5, cursorY);
        cursorY += lineHeight;
      });
    });

    doc.setTextColor(0, 0, 0);
    doc.setFont("times", "normal");

    // Render explanation
    if (wrappedExplanation.length > 0) {
      doc.setFont("times", "italic");
      wrappedExplanation.forEach((line: any) => {
        doc.text(line, margin, cursorY);
        cursorY += lineHeight;
      });
      cursorY += 5;
    }

    doc.setDrawColor(0, 0, 0);
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 10;
  });

  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("times", "italic");
    doc.setFontSize(10);
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin - 30,
      pageHeight - margin
    );
  }

  doc.save(fileName);
};

export default downloadPDFQuestionsPDF;
