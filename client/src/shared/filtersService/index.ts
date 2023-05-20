import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const useFilter = (key: string) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(() => {
    return searchParams.get(key) ?? "";
  });

  const handleChange = useCallback(
    (value: string) => {
      setValue(value);
      setSearchParams(() => {
        const next = new URLSearchParams(window.location.search);
        if (!value) {
          next.delete(key);
        } else {
          next.set(key, value);
        }
        return next;
      });
    },
    [key, setSearchParams]
  );

  useEffect(() => {
    const paramValue = searchParams.get(key) ?? "";
    if (value !== paramValue) {
      setValue(paramValue);
    }
  }, [value, searchParams, key]);

  return [value, handleChange] as const;
};

const checkedValue = "true";

export const useBooleanFilter = (key: string) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(() => {
    return searchParams.get(key) === checkedValue;
  });

  const handleChange = useCallback(
    (value: boolean) => {
      setValue(value);
      setSearchParams(() => {
        const next = new URLSearchParams(window.location.search);
        if (!value) {
          next.delete(key);
        } else {
          next.set(key, checkedValue);
        }
        return next;
      });
    },
    [key, setSearchParams]
  );

  useEffect(() => {
    const paramValue = searchParams.get(key) === checkedValue;
    if (value !== paramValue) {
      setValue(paramValue);
    }
  }, [value, searchParams, key]);

  return [value, handleChange] as const;
};
