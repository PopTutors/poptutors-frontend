import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../lib/api';

// Generic mutation data type
interface MutationData {
  endpoint: string;
  data: any;
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  requiresAuth?: boolean;
  successMessage?: string;
  errorMessage?: string;
  invalidateKeys?: string[];
  onSuccessCallback?: (data: any) => void;
  onErrorCallback?: (error: any) => void;
}

// Generic API response type
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export function useGenericMutation<TResponse = any>() {
  const queryClient = useQueryClient();

  const mutation = useMutation<ApiResponse<TResponse>, Error, MutationData>({
    mutationFn: async ({ endpoint, data, method = 'POST', requiresAuth = true }) => {
      const config: any = {};

      // Set headers if auth is not required (override default auth)
      if (!requiresAuth) {
        config.headers = {
          Authorization: '', // Clear auth header
        };
      }

      let response;

      switch (method) {
        case 'POST':
          response = await api.post(endpoint, data, config);
          break;
        case 'PUT':
          response = await api.put(endpoint, data, config);
          break;
        case 'PATCH':
          response = await api.patch(endpoint, data, config);
          break;
        case 'DELETE':
          response = await api.delete(endpoint, config);
          break;
        default:
          response = await api.post(endpoint, data, config);
      }

      return response;
    },
    onSuccess: (response, variables) => {
      // Show success message
      if (variables.successMessage) {
        showToast(variables.successMessage, 'success');
      }

      // Invalidate specified query keys
      if (variables.invalidateKeys && variables.invalidateKeys.length > 0) {
        variables.invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }

      // Execute custom success callback
      if (variables.onSuccessCallback) {
        variables.onSuccessCallback(response.data);
      }
    },
    onError: (error: any, variables) => {
      // Show error message
      const errorMsg =
        variables.errorMessage ||
        error?.response?.data?.message ||
        error?.message ||
        'An error occurred';

      showToast(errorMsg, 'error');

      // Execute custom error callback
      if (variables.onErrorCallback) {
        variables.onErrorCallback(error);
      }
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
}

// Toast utility function using react-hot-toast
function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  switch (type) {
    case 'success':
      toast.success(message, {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: '#fff',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#10B981',
        },
      });
      break;
    case 'error':
      toast.error(message, {
        duration: 5000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: '#fff',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#EF4444',
        },
      });
      break;
    default:
      toast(message, {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#3B82F6',
          color: '#fff',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#3B82F6',
        },
      });
  }
}
