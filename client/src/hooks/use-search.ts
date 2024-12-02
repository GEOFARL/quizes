import { useState, useEffect, useMemo } from "react";

export const useSearch = <T>(
  items: T[],
  query: string,
  getSearchableContent: (item: T) => string
) => {
  const [matches, setMatches] = useState<number[]>([]);

  const searchableItems = useMemo(() => {
    return items.map(getSearchableContent);
  }, [items, getSearchableContent]);

  useEffect(() => {
    if (!query.trim()) {
      setMatches([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const matchedIndices = searchableItems
      .map((content, index) =>
        content.toLowerCase().includes(lowerQuery) ? index : -1
      )
      .filter((index) => index !== -1);

    setMatches(matchedIndices);
  }, [query, searchableItems]);

  return matches;
};
