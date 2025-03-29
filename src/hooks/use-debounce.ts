import { useEffect, useState } from 'react';

export function NOT_READY_useDebounce<T>(value: T, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      setDebouncedValue(value)
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return [debouncedValue, loading];
}
