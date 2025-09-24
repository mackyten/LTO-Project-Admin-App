import { useQuery } from '@tanstack/react-query';
import { getDashboardData, getDashboardOverview } from '../../../../firebase/dashboard';

// Query Keys
export const DASHBOARD_QUERY_KEYS = {
  dashboardData: ['dashboard', 'data'] as const,
  dashboardOverview: ['dashboard', 'overview'] as const,
} as const;

/**
 * Hook to get full dashboard data including charts and detailed analytics
 */
export const useDashboardData = () => {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.dashboardData,
    queryFn: getDashboardData,
    staleTime: 2 * 60 * 1000, // 2 minutes - dashboard data should be relatively fresh
    gcTime: 5 * 60 * 1000, // 5 minutes cache time
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000), // Exponential backoff
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchOnMount: true, // Always refetch on mount for fresh data
  });
};

/**
 * Hook to get dashboard overview data only (lighter query for key metrics)
 */
export const useDashboardOverview = () => {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.dashboardOverview,
    queryFn: getDashboardOverview,
    staleTime: 1 * 60 * 1000, // 1 minute - overview should be very fresh
    gcTime: 3 * 60 * 1000, // 3 minutes cache time
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 30 * 1000, // Auto-refetch every 30 seconds for key metrics
  });
};

/**
 * Hook to get dashboard state with loading and error handling
 */
export const useDashboardState = () => {
  const dashboardQuery = useDashboardData();
  const overviewQuery = useDashboardOverview();

  return {
    // Full dashboard data
    dashboardData: dashboardQuery.data,
    isDashboardLoading: dashboardQuery.isLoading,
    isDashboardError: dashboardQuery.isError,
    dashboardError: dashboardQuery.error,
    refetchDashboard: dashboardQuery.refetch,
    
    // Overview data
    overviewData: overviewQuery.data,
    isOverviewLoading: overviewQuery.isLoading,
    isOverviewError: overviewQuery.isError,
    overviewError: overviewQuery.error,
    refetchOverview: overviewQuery.refetch,
    
    // Combined states
    isLoading: dashboardQuery.isLoading || overviewQuery.isLoading,
    isError: dashboardQuery.isError || overviewQuery.isError,
    error: dashboardQuery.error || overviewQuery.error,
    
    // Refetch all data
    refetchAll: () => {
      dashboardQuery.refetch();
      overviewQuery.refetch();
    },
  };
};

/**
 * Hook for real-time dashboard metrics (overview only)
 * Perfect for header widgets or summary cards
 */
export const useRealTimeDashboard = () => {
  const overviewQuery = useDashboardOverview();

  return {
    data: overviewQuery.data,
    isLoading: overviewQuery.isLoading,
    isError: overviewQuery.isError,
    error: overviewQuery.error,
    refetch: overviewQuery.refetch,
    
    // Convenience getters for common metrics
    totalViolationsToday: overviewQuery.data?.totalViolationsToday || 0,
    totalViolationsThisMonth: overviewQuery.data?.totalViolationsThisMonth || 0,
    totalPaidFines: overviewQuery.data?.totalPaidFines || 0,
    totalUnpaidFines: overviewQuery.data?.totalUnpaidFines || 0,
    totalRevenue: overviewQuery.data?.totalRevenue || 0,
  };
};

/**
 * Hook for dashboard charts data
 * Use this when you only need chart-specific data
 */
export const useDashboardCharts = () => {
  const dashboardQuery = useDashboardData();

  const chartData = dashboardQuery.data ? {
    violationsByLocation: dashboardQuery.data.violationsByLocation,
    monthlyTrends: dashboardQuery.data.monthlyTrends,
    paymentStatusBreakdown: dashboardQuery.data.paymentStatusBreakdown,
    topViolationTypes: dashboardQuery.data.topViolationTypes,
  } : null;

  return {
    data: chartData,
    isLoading: dashboardQuery.isLoading,
    isError: dashboardQuery.isError,
    error: dashboardQuery.error,
    refetch: dashboardQuery.refetch,
    
    // Individual chart data getters
    violationsByLocation: chartData?.violationsByLocation || {},
    monthlyTrends: chartData?.monthlyTrends || {},
    paymentStatusBreakdown: chartData?.paymentStatusBreakdown || {
      completed: 0,
      pending: 0,
      refunded: 0,
      overturned: 0,
      cancelled: 0,
    },
    topViolationTypes: chartData?.topViolationTypes || {},
  };
};

/**
 * Hook for recent activity data
 * Use this for activity feeds or recent items lists
 */
export const useRecentActivity = () => {
  const dashboardQuery = useDashboardData();

  const activityData = dashboardQuery.data ? {
    latestViolations: dashboardQuery.data.latestViolations,
    latestPayments: dashboardQuery.data.latestPayments,
    overturnedViolations: dashboardQuery.data.overturnedViolations,
    todaysPayments: dashboardQuery.data.todaysPayments,
  } : null;

  return {
    data: activityData,
    isLoading: dashboardQuery.isLoading,
    isError: dashboardQuery.isError,
    error: dashboardQuery.error,
    refetch: dashboardQuery.refetch,
    
    // Individual activity data getters
    latestViolations: activityData?.latestViolations || [],
    latestPayments: activityData?.latestPayments || [],
    overturnedViolations: activityData?.overturnedViolations || [],
    todaysPayments: activityData?.todaysPayments || [],
  };
};

/**
 * Hook for dashboard insights and analytics
 * Use this for analytical widgets and reports
 */
export const useDashboardInsights = () => {
  const dashboardQuery = useDashboardData();

  const insightsData = dashboardQuery.data ? {
    averageFineAmount: dashboardQuery.data.averageFineAmount,
    busiestLocations: dashboardQuery.data.busiestLocations,
    topViolationTypes: dashboardQuery.data.topViolationTypes,
    totalRevenue: dashboardQuery.data.totalRevenue,
  } : null;

  return {
    data: insightsData,
    isLoading: dashboardQuery.isLoading,
    isError: dashboardQuery.isError,
    error: dashboardQuery.error,
    refetch: dashboardQuery.refetch,
    
    // Individual insights getters
    averageFineAmount: insightsData?.averageFineAmount || 0,
    busiestLocations: insightsData?.busiestLocations || [],
    topViolationTypes: insightsData?.topViolationTypes || {},
    totalRevenue: insightsData?.totalRevenue || 0,
  };
};
