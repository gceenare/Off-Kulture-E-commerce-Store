import { useState, useEffect, useCallback } from 'react';
import { ApiError } from '../services/api';

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

export interface UseApiOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
  initialData?: T;
}

export function useApi<T>(
  apiFunction: () => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const [state, setState] = useState<ApiState<T>>({
    data: options.initialData || null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiFunction();
      setState({ data: result, loading: false, error: null });
      options.onSuccess?.(result);
      return result;
    } catch (error) {
      const apiError = error instanceof ApiError ? error : new ApiError('Unknown error');
      setState(prev => ({ ...prev, loading: false, error: apiError }));
      options.onError?.(apiError);
      throw apiError;
    }
  }, [apiFunction, options]);

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [execute, options.immediate]);

  const reset = useCallback(() => {
    setState({
      data: options.initialData || null,
      loading: false,
      error: null,
    });
  }, [options.initialData]);

  return {
    ...state,
    execute,
    reset,
    refetch: execute,
  };
}

export function useApiWithParams<T, P>(
  apiFunction: (params: P) => Promise<T>,
  initialParams: P,
  options: UseApiOptions<T> = {}
) {
  const [params, setParams] = useState<P>(initialParams);
  const [state, setState] = useState<ApiState<T>>({
    data: options.initialData || null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (newParams?: P) => {
    const paramsToUse = newParams || params;
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiFunction(paramsToUse);
      setState({ data: result, loading: false, error: null });
      options.onSuccess?.(result);
      return result;
    } catch (error) {
      const apiError = error instanceof ApiError ? error : new ApiError('Unknown error');
      setState(prev => ({ ...prev, loading: false, error: apiError }));
      options.onError?.(apiError);
      throw apiError;
    }
  }, [apiFunction, params, options]);

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [execute, options.immediate]);

  const updateParams = useCallback((newParams: P) => {
    setParams(newParams);
  }, []);

  const reset = useCallback(() => {
    setState({
      data: options.initialData || null,
      loading: false,
      error: null,
    });
    setParams(initialParams);
  }, [options.initialData, initialParams]);

  return {
    ...state,
    params,
    execute,
    updateParams,
    reset,
    refetch: () => execute(),
  };
}

// Hook for managing multiple API calls
export function useMultiApi<T extends Record<string, (...args: any[]) => any>>(
  apiFunctions: T,
  options: {
    immediate?: boolean;
    parallel?: boolean;
    onSuccess?: (results: { [K in keyof T]: Awaited<ReturnType<T[K]>> }) => void;
    onError?: (error: ApiError, key: keyof T) => void;
  } = {}
) {
  const [states, setStates] = useState<Record<keyof T, ApiState<any>>>(
    Object.keys(apiFunctions).reduce((acc, key) => ({
      ...acc,
      [key]: { data: null, loading: false, error: null }
    }), {} as Record<keyof T, ApiState<any>>)
  );

  const execute = useCallback(async (key?: keyof T) => {
    if (key) {
      // Execute single API function
      const apiFunction = apiFunctions[key];
      setStates(prev => ({
        ...prev,
        [key]: { ...prev[key], loading: true, error: null }
      }));

      try {
        const result = await apiFunction();
        setStates(prev => ({
          ...prev,
          [key]: { data: result, loading: false, error: null }
        }));
        return result;
      } catch (error) {
        const apiError = error instanceof ApiError ? error : new ApiError('Unknown error');
        setStates(prev => ({
          ...prev,
          [key]: { ...prev[key], loading: false, error: apiError }
        }));
        options.onError?.(apiError, key);
        throw apiError;
      }
    } else {
      // Execute all API functions
      const keys = Object.keys(apiFunctions) as (keyof T)[];

      if (options.parallel) {
        // Execute in parallel
        setStates(prev =>
          keys.reduce((acc, k) => ({
            ...acc,
            [k]: { ...prev[k], loading: true, error: null }
          }), prev)
        );

        try {
          const promises = keys.map(k => apiFunctions[k]());
          const results = await Promise.all(promises);
          const resultsMap = keys.reduce((acc, k, index) => ({
            ...acc,
            [k]: results[index]
          }), {} as { [K in keyof T]: Awaited<ReturnType<T[K]>> });

          setStates(prev =>
            keys.reduce((acc, k) => ({
              ...acc,
              [k]: { data: resultsMap[k], loading: false, error: null }
            }), prev)
          );

          options.onSuccess?.(resultsMap);
          return resultsMap;
        } catch (error) {
          const apiError = error instanceof ApiError ? error : new ApiError('Unknown error');
          setStates(prev =>
            keys.reduce((acc, k) => ({
              ...acc,
              [k]: { ...prev[k], loading: false, error: apiError }
            }), prev)
          );
          throw apiError;
        }
      } else {
        // Execute sequentially
        const results: any = {};

        for (const k of keys) {
          try {
            setStates(prev => ({
              ...prev,
              [k]: { ...prev[k], loading: true, error: null }
            }));

            results[k] = await apiFunctions[k]();

            setStates(prev => ({
              ...prev,
              [k]: { data: results[k], loading: false, error: null }
            }));
          } catch (error) {
            const apiError = error instanceof ApiError ? error : new ApiError('Unknown error');
            setStates(prev => ({
              ...prev,
              [k]: { ...prev[k], loading: false, error: apiError }
            }));
            options.onError?.(apiError, k);
            throw apiError;
          }
        }

        options.onSuccess?.(results);
        return results;
      }
    }
  }, [apiFunctions, options]);

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [execute, options.immediate]);

  const reset = useCallback((key?: keyof T) => {
    if (key) {
      setStates(prev => ({
        ...prev,
        [key]: { data: null, loading: false, error: null }
      }));
    } else {
      setStates(
        Object.keys(apiFunctions).reduce((acc, k) => ({
          ...acc,
          [k]: { data: null, loading: false, error: null }
        }), {} as Record<keyof T, ApiState<any>>)
      );
    }
  }, [apiFunctions]);

  return {
    states,
    execute,
    reset,
    isLoading: Object.values(states).some(state => state.loading),
    hasError: Object.values(states).some(state => state.error !== null),
  };
}