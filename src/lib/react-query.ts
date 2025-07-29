import type { UseMutationOptions, DefaultOptions } from '@tanstack/react-query';

export const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60, // 1 minute
  },
};

export type ApiFnReturnType<FnType extends (...args: any[]) => Promise<any>> = Awaited<
  ReturnType<FnType>
>;

export type QueryConfig<T extends (...args: any[]) => any> = Partial<
  Omit<ReturnType<T>, 'queryKey' | 'queryFn'>
>;

export type MutationConfig<MutationFnType extends (...args: any[]) => Promise<any>> =
  UseMutationOptions<ApiFnReturnType<MutationFnType>, Error, Parameters<MutationFnType>[0]>;
