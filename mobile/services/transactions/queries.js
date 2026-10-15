import { useInfiniteQuery } from "@tanstack/react-query";
import { getTransactions } from "./api";

export function useTransactionsInfinite(type) {
  return useInfiniteQuery({
    queryKey: ["transactions", type],
    queryFn: ({ pageParam = 1 }) =>
      getTransactions({
        page: pageParam,
        limit: 10,
        ...(type ? { type } : {}),
        sort: "date"
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce((acc, page) => acc + (page.data?.length || 0), 0);
      if (lastPage?.total && loadedCount < lastPage.total) {
        return allPages.length + 1;
      }
      return undefined;
    }
  });
}
