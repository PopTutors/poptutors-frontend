import { useQuery, type QueryKey, type UseQueryOptions } from '@tanstack/react-query';
import { useEffect } from 'react';
import api from '../lib/api';

export function useFetch<T>(
  queryKey: QueryKey,
  url: string,
  enabled = true,
  options?: Omit<
    Partial<UseQueryOptions<T, Error, T, QueryKey>>,
    'queryKey' | 'queryFn' | 'enabled'
  > & {
    onSuccessCallback?: (data: T) => void;
    onErrorCallback?: (error: Error) => void;
  }
) {
  const query = useQuery<T, Error>({
    queryKey,
    queryFn: () => api.get<T>(url).then(res => res.data),
    enabled,
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && options?.onSuccessCallback) {
      options.onSuccessCallback(query.data as T);
    }
    if (query.isError && options?.onErrorCallback) {
      options.onErrorCallback(query.error as Error);
    }
  }, [query.isSuccess, query.isError]);

  return query; 
}
