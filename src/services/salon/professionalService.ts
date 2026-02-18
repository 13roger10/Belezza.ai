// Professional Service - API calls for professional management

import { api } from './api';
import type {
  Professional,
  ProfessionalCreateInput,
  ProfessionalUpdateInput,
  ProfessionalFilters,
  ProfessionalAvailability,
  ProfessionalPerformance,
  ProfessionalRanking,
} from '@/types/salon';
import type { PaginatedResponse, PaginationParams, DateRange } from '@/types/salon/common';

const BASE_PATH = '/salon/professionals';

export const professionalService = {
  // List professionals with pagination and filters
  list: (
    params: PaginationParams & ProfessionalFilters
  ): Promise<PaginatedResponse<Professional>> => {
    return api.get<PaginatedResponse<Professional>>(BASE_PATH, params);
  },

  // Get all professionals (no pagination, for selects)
  getAll: (params?: ProfessionalFilters): Promise<Professional[]> => {
    return api.get<Professional[]>(`${BASE_PATH}/all`, params);
  },

  // Get single professional by ID
  getById: (id: string): Promise<Professional> => {
    return api.get<Professional>(`${BASE_PATH}/${id}`);
  },

  // Create new professional
  create: (data: ProfessionalCreateInput): Promise<Professional> => {
    return api.post<Professional>(BASE_PATH, data);
  },

  // Update existing professional
  update: (id: string, data: ProfessionalUpdateInput): Promise<Professional> => {
    return api.patch<Professional>(`${BASE_PATH}/${id}`, data);
  },

  // Delete professional (soft delete)
  delete: (id: string): Promise<void> => {
    return api.delete(`${BASE_PATH}/${id}`);
  },

  // Get professional availability for a date
  getAvailability: (
    id: string,
    date: Date,
    serviceIds: string[]
  ): Promise<ProfessionalAvailability> => {
    return api.get<ProfessionalAvailability>(`${BASE_PATH}/${id}/availability`, {
      date: date.toISOString(),
      serviceIds: serviceIds.join(','),
    });
  },

  // Update professional schedule
  updateSchedule: (
    id: string,
    schedule: Professional['schedule']
  ): Promise<Professional> => {
    return api.patch<Professional>(`${BASE_PATH}/${id}/schedule`, { schedule });
  },

  // Get professional performance metrics
  getPerformance: (
    id: string,
    dateRange: DateRange
  ): Promise<ProfessionalPerformance> => {
    return api.get<ProfessionalPerformance>(`${BASE_PATH}/${id}/performance`, {
      startDate: dateRange.startDate.toISOString(),
      endDate: dateRange.endDate.toISOString(),
    });
  },

  // Get professional ranking
  getRanking: (params: {
    metricType: 'revenue' | 'appointments' | 'rating';
    dateRange?: DateRange;
    unitId?: string;
    limit?: number;
  }): Promise<ProfessionalRanking[]> => {
    return api.get<ProfessionalRanking[]>(`${BASE_PATH}/ranking`, {
      ...params,
      startDate: params.dateRange?.startDate?.toISOString(),
      endDate: params.dateRange?.endDate?.toISOString(),
    });
  },

  // Update services offered by professional
  updateServices: (id: string, serviceIds: string[]): Promise<Professional> => {
    return api.patch<Professional>(`${BASE_PATH}/${id}/services`, { serviceIds });
  },

  // Update commission settings
  updateCommission: (
    id: string,
    data: { commissionType: 'percentage' | 'fixed'; commissionValue: number }
  ): Promise<Professional> => {
    return api.patch<Professional>(`${BASE_PATH}/${id}/commission`, data);
  },

  // Add break time
  addBreak: (
    id: string,
    date: Date,
    startTime: string,
    endTime: string,
    reason?: string
  ): Promise<void> => {
    return api.post(`${BASE_PATH}/${id}/breaks`, {
      date: date.toISOString(),
      startTime,
      endTime,
      reason,
    });
  },

  // Get breaks for a date range
  getBreaks: (
    id: string,
    startDate: Date,
    endDate: Date
  ): Promise<{ date: Date; startTime: string; endTime: string; reason?: string }[]> => {
    return api.get(`${BASE_PATH}/${id}/breaks`, {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  },

  // Upload avatar
  uploadAvatar: (id: string, file: File): Promise<{ avatarUrl: string }> => {
    return api.upload(`${BASE_PATH}/${id}/avatar`, file);
  },
};
