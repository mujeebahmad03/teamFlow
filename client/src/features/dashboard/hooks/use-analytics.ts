import { useQuery } from "@tanstack/react-query";

import { apiRoutes } from "@/config";
import { api } from "@/lib/api";
import type { DashboardAnalytics } from "@/dashboard/types";

export const useAnalytics = () => {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      return await api.get<DashboardAnalytics>(
        apiRoutes.dashboard.getAllAnalytics,
      );
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
