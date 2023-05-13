import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export const useFilter = (key: string) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(searchParams.get(key) ?? "");

  const handleChange = (value: string) => {
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
  };

  return [value, handleChange] as const;
};
