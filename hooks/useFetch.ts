import { useState, useEffect } from "react";

const useFetch = <T>(url: string | null) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!url) return;
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

        const responseData: T = await response.json();
        setData(responseData);
        setError(null); // Reset error state on success
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message); // Now TypeScript knows err.message exists
        } else {
          setError("An unknown error occurred");
        }
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
