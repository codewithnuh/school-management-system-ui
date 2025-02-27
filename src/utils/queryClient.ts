import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Limit retries for failed requests <button class="citation-flag" data-index="7">
      refetchOnWindowFocus: false, // Disable background refetching <button class="citation-flag" data-index="7">
    },
  },
});
