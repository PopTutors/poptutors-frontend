import { useQuery, type QueryKey, type UseQueryOptions } from '@tanstack/react-query';
import { useEffect } from 'react';
import api from '../lib/api';

// Helper function to get cookie value
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

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
    useTokenFromCookie?: boolean; // New option to use token from cookie
    cookieName?: string; // Custom cookie name (defaults to 'authToken')
    requiresAuth?: boolean; // Whether this request requires authentication
  }
) {
  const {
    onSuccessCallback,
    onErrorCallback,
    useTokenFromCookie = false,
    cookieName = 'authToken',
    requiresAuth = true,
    ...queryOptions
  } = options || {};

  const query = useQuery<T, Error>({
    queryKey,
    queryFn: async () => {
      // Create config object for the request
      const config: any = {
        headers: {}
      };

      // Handle authentication token
      if (requiresAuth) {
        let token: string | null = null;

        if (useTokenFromCookie) {
          // Get token from cookie
          token = getCookie(cookieName);
        } else {
          // Get token from localStorage or sessionStorage
          token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        }

        // Add Authorization header if token exists
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      } else {
        // Clear authorization header if auth is not required
        config.headers['Authorization'] = '';
      }

      try {
        const response = await api.get<T>(url, config);
        return response.data;
      } catch (error: any) {
        // Handle specific error cases
        if (error.response?.status === 401 && requiresAuth) {
          // Token might be expired or invalid
          if (useTokenFromCookie) {
            // Clear cookie if using cookie-based auth
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          } else {
            // Clear localStorage/sessionStorage tokens
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('authToken');
          }
        }
        throw error;
      }
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData,
    ...queryOptions,
  });

  useEffect(() => {
    if (query.isSuccess && onSuccessCallback && query.data) {
      onSuccessCallback(query.data as T);
    }
    if (query.isError && onErrorCallback && query.error) {
      onErrorCallback(query.error as Error);
    }
  }, [query.isSuccess, query.isError, query.data, query.error, onSuccessCallback, onErrorCallback]);

  return {
    ...query,
    // Additional helper properties
    isLoading: query.isLoading || query.isFetching,
    hasError: query.isError,
    errorMessage: query.error?.message,
  };
}

// Alternative version with more granular token handling
export function useFetchWithAuth<T>(
  queryKey: QueryKey,
  url: string,
  authConfig?: {
    enabled?: boolean;
    useTokenFromCookie?: boolean;
    cookieName?: string;
    fallbackToStorage?: boolean; // If cookie fails, try localStorage/sessionStorage
  },
  options?: Omit<
    Partial<UseQueryOptions<T, Error, T, QueryKey>>,
    'queryKey' | 'queryFn' | 'enabled'
  > & {
    onSuccessCallback?: (data: T) => void;
    onErrorCallback?: (error: Error) => void;
  }
) {
  const {
    enabled = true,
    useTokenFromCookie = false,
    cookieName = 'authToken',
    fallbackToStorage = true
  } = authConfig || {};

  return useFetch<T>(
    queryKey,
    url,
    enabled,
    {
      ...options,
      useTokenFromCookie,
      cookieName,
      requiresAuth: true,
    }
  );
}
