import { useCallback, useEffect, useState } from "react";
import { actionErrorMessage } from "../utils/format";
import { useAuth } from "./useAuth";

// Carga varias listas del backend en paralelo.
// loaders: { clave: (authenticatedRequest) => Promise<array> }
// Definir `loaders` fuera del componente para que sea estable entre renders.
export function useCrmLists(loaders) {
  const { authenticatedRequest } = useAuth();
  const [data, setData] = useState(() =>
    Object.fromEntries(Object.keys(loaders).map((key) => [key, []])),
  );
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const reload = useCallback(async () => {
    setIsLoading(true);
    const entries = Object.entries(loaders);
    const results = await Promise.allSettled(
      entries.map(([, load]) => load(authenticatedRequest)),
    );
    const nextData = {};
    const nextErrors = {};

    results.forEach((result, index) => {
      const key = entries[index][0];
      if (result.status === "fulfilled") {
        nextData[key] = result.value;
      } else {
        nextData[key] = [];
        nextErrors[key] = actionErrorMessage(result.reason);
      }
    });

    setData(nextData);
    setErrors(nextErrors);
    setIsLoading(false);
  }, [authenticatedRequest, loaders]);

  useEffect(() => {
    const timer = window.setTimeout(reload, 0);
    return () => window.clearTimeout(timer);
  }, [reload]);

  return { data, errors, isLoading, reload, authenticatedRequest };
}
