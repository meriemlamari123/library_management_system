import api, { LOANS_SERVICE_URL } from './api';
import { rabbitMQService } from './rabbitmq.service';
import type {
  Loan,
  CreateLoanRequest,
  CreateLoanResponse,
  ReturnLoanResponse,
  RenewLoanResponse,
  UserLoansResponse,
  ActiveLoansResponse,
  OverdueLoansResponse,
  LoanHistoryResponse
} from '@/types/loan.types';

export const loansService = {
  createLoan: async (data: CreateLoanRequest) => {
    const response = await api.post<CreateLoanResponse>(`${LOANS_SERVICE_URL}/`, data);
    return response.data;
  },

  returnLoan: async (id: number, userId: number) => {
    const response = await api.put<ReturnLoanResponse>(`${LOANS_SERVICE_URL}/${id}/return/`, { user_id: userId });
    return response.data;
  },

  renewLoan: async (id: number, userId: number) => {
    const response = await api.put<RenewLoanResponse>(`${LOANS_SERVICE_URL}/${id}/renew/`, { user_id: userId });
    return response.data;
  },

  getUserLoans: (userId: number) =>
    api.get<UserLoansResponse>(`${LOANS_SERVICE_URL}/user/${userId}/`),

  getUserActiveLoans: (userId: number) =>
    api.get<ActiveLoansResponse>(`${LOANS_SERVICE_URL}/user/${userId}/active/`),

  getAllLoans: () =>
    api.get<{ count: number; loans: Loan[] }>(`${LOANS_SERVICE_URL}/list/`),

  getActiveLoans: () =>
    api.get<ActiveLoansResponse>(`${LOANS_SERVICE_URL}/active/`),

  getOverdueLoans: () =>
    api.get<OverdueLoansResponse>(`${LOANS_SERVICE_URL}/overdue/`),

  getLoan: (id: number) =>
    api.get<Loan>(`${LOANS_SERVICE_URL}/${id}/`),

  getLoanHistory: (id: number) =>
    api.get<LoanHistoryResponse>(`${LOANS_SERVICE_URL}/${id}/history/`),

  healthCheck: () =>
    api.get<{ status: string; service: string; timestamp: string }>(`${LOANS_SERVICE_URL}/health/`),
};
