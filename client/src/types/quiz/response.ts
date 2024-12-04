import { Pagination } from "../pagination";
import { Quiz } from "./quiz";

export type GetQuizzesResponse = {
  data: Quiz[];
  pagination: Pagination;
};
