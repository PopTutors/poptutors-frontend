import { queryOptions, useQuery } from '@tanstack/react-query';
import type { Assignment } from '../../../types/api';
import type { QueryConfig } from '../../../lib/react-query';
import api from '../../../lib/api';

export const getAssignments = (): Promise<{ data: Assignment[] }> => {
  return api.get('/dashboard/assignments');
};

export const getAssignmentsQueryOptions = () => {
  return queryOptions({
    queryKey: ['assignments'],
    queryFn: () => getAssignments(),
    refetchOnWindowFocus: false,
  });
};

type UseTeamsOptions = {
  queryConfig?: QueryConfig<typeof getAssignmentsQueryOptions>;
};

export const useAssignments = ({ queryConfig = {} }: UseTeamsOptions = {}) => {
  return useQuery({
    ...getAssignmentsQueryOptions(),
    ...queryConfig,
  });
};
