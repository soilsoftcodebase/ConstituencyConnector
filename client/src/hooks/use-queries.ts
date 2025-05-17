import { useQuery } from '@tanstack/react-query';
import { TeamMember, Request, Appointment } from '@shared/schema';

export function useTeamMembersQuery() {
  return useQuery<TeamMember[]>({
    queryKey: ['/api/team'],
  });
}

export function useRequestsQuery(filters?: {
  category?: string;
  priority?: string;
  status?: string;
  search?: string;
}) {
  return useQuery<Request[]>({
    queryKey: ['/api/requests', filters],
  });
}

export function useRequestDetailsQuery(id: number) {
  return useQuery<any>({
    queryKey: ['/api/requests/details', id],
    enabled: !!id,
  });
}

export function useRequestCountQuery(filters?: {
  category?: string;
  priority?: string;
  status?: string;
  search?: string;
}) {
  return useQuery<number>({
    queryKey: ['/api/requests/count', filters],
  });
}

export function useStatsQuery(timePeriod?: string) {
  return useQuery<any>({
    queryKey: ['/api/stats', { timePeriod }],
  });
}

export function useCategoryStatsQuery(timePeriod?: string) {
  return useQuery<any[]>({
    queryKey: ['/api/stats/categories', { timePeriod }],
  });
}

export function useStatusStatsQuery(timePeriod?: string) {
  return useQuery<any[]>({
    queryKey: ['/api/stats/statuses', { timePeriod }],
  });
}

export function useUpcomingAppointmentsQuery() {
  return useQuery<Appointment[]>({
    queryKey: ['/api/appointments/upcoming'],
  });
}