import axiosInstance from "@/lib/axios";

export interface DashboardStatsResponse {
    booksBorrowedToday: number;
    pendingApprovals: number;
    overdueBooks: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    timestamp: string;
}

export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
    const response = await axiosInstance.get<DashboardStatsResponse>("/api/admin/dashboard/stats");
    return response.data;
};
