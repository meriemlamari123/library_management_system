import api, { BOOKS_SERVICE_URL } from './api';
import { rabbitMQService } from './rabbitmq.service';
import type { Book, BooksResponse, SearchBooksResponse, CreateBookRequest, BookReview, CreateReviewRequest } from '@/types/book.types';

interface BooksParams {
  page?: number;
  page_size?: number;
}

interface SearchParams {
  q: string;
  min_rating?: number;
}

interface ReviewsParams {
  page?: number;
  page_size?: number;
}

interface ReviewsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BookReview[];
}

export const booksService = {
  getBooks: (params?: BooksParams) =>
    api.get<BooksResponse>(`${BOOKS_SERVICE_URL}/books/`, { params }),

  getBook: (id: number) =>
    api.get<Book>(`${BOOKS_SERVICE_URL}/books/${id}/`),

  createBook: (data: CreateBookRequest) =>
    api.post<Book>(`${BOOKS_SERVICE_URL}/books/create/`, data),

  updateBook: (id: number, data: CreateBookRequest) =>
    api.put<Book>(`${BOOKS_SERVICE_URL}/books/update/${id}/`, data),

  partialUpdateBook: (id: number, data: Partial<CreateBookRequest>) =>
    api.patch<Book>(`${BOOKS_SERVICE_URL}/books/partial-update/${id}/`, data),

  deleteBook: (id: number) =>
    api.delete(`${BOOKS_SERVICE_URL}/books/delete/${id}/`),

  searchBooks: (params: SearchParams) =>
    api.get<SearchBooksResponse>(`${BOOKS_SERVICE_URL}/search/`, { params }),

  getReviews: (id: number, params?: ReviewsParams) =>
    api.get<ReviewsResponse>(`${BOOKS_SERVICE_URL}/books/${id}/reviews/`, { params }),

  createReview: (id: number, data: CreateReviewRequest) =>
    api.post<BookReview>(`${BOOKS_SERVICE_URL}/books/${id}/reviews/create/`, data),
};
