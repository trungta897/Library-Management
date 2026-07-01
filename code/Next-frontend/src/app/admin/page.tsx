"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, BookOpen, ClipboardList, Loader2 } from "lucide-react";
import Topbar from "@/components/features/admin/Topbar";
import PendingRequests from "@/components/features/admin/dashboard/PendingRequests";
import SmartCataloging from "@/components/features/admin/dashboard/SmartCataloging";
import StatCard from "@/components/features/admin/dashboard/StatCard";
import SystemAlerts from "@/components/features/admin/dashboard/SystemAlerts";
import { UI_TEXT } from "@/constants/ui-text";
import { DashboardStatsResponse, getDashboardStats } from "@/services/adminDashboard";

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="flex min-h-screen w-full flex-col bg-surface">
            <Topbar />
            <div className="flex flex-1 flex-col space-y-5 p-8">
                <div className="flex flex-col gap-5 sm:flex-row">
                    {loading ? (
                        <div className="flex w-full items-center justify-center p-12">
                            <Loader2 className="h-8 w-8 animate-spin text-ink-400" />
                        </div>
                    ) : (
                        <>
                            <StatCard
                                eyebrow={UI_TEXT.ADMIN_PAGES.DASHBOARD.BOOKS_TODAY}
                                value={stats?.booksBorrowedToday?.toString() || "0"}
                                icon={BookOpen}
                                tone="brass"
                                meta={{ type: "trend", text: UI_TEXT.ADMIN_PAGES.DASHBOARD.BOOKS_TODAY_TREND }}
                            />
                            <StatCard
                                eyebrow={UI_TEXT.ADMIN_PAGES.DASHBOARD.PENDING_APPROVAL}
                                value={stats?.pendingApprovals?.toString() || "0"}
                                icon={ClipboardList}
                                tone="moss"
                                meta={{ type: "info", text: UI_TEXT.ADMIN_PAGES.DASHBOARD.PENDING_APPROVAL_DESC }}
                            />
                            <StatCard
                                eyebrow={UI_TEXT.ADMIN_PAGES.DASHBOARD.OVERDUE_BOOKS}
                                value={stats?.overdueBooks?.toString() || "0"}
                                icon={AlertTriangle}
                                tone="rust"
                                meta={{ type: "alert", text: UI_TEXT.ADMIN_PAGES.DASHBOARD.OVERDUE_BOOKS_DESC }}
                            />
                        </>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
                    <PendingRequests />
                    <div className="space-y-5">
                        <SmartCataloging />
                        <SystemAlerts />
                    </div>
                </div>
            </div>
        </div>
    );
}
