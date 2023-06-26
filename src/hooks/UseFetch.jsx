import { useEffect, useState } from "react";
import { fetchData } from "../service/service";

function UseFetch(query) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    setLoading("loading...");
    setData(null);
    setError(null);

    fetchData(query)
      .then((res) => {
        setLoading(false);
        setData(res);
      })
      .catch((err) => {
        setLoading(false);
        setError("Something went wrong!");
      });
  }, [query]);
  return { data, loading, error };
}

export default UseFetch;
