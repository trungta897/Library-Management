"use client";

import { useState } from "react";
import { CalendarDays, Search, SlidersHorizontal } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";

const T = UI_TEXT.ADMIN_BORROW_MANAGEMENT.FILTERS;

const STATUS_OPTIONS = [
    { value: "", label: T.STATUS_ALL },
    { value: "pending", label: T.STATUS_PENDING },
    { value: "ready", label: T.STATUS_READY },
    { value: "borrowed", label: T.STATUS_BORROWED },
    { value: "overdue", label: T.STATUS_OVERDUE },
    { value: "returned", label: T.STATUS_RETURNED },
];

export default function BorrowFilters() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    return (
        <div className="level-1-shadow flex flex-col items-center gap-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-md lg:flex-row">
            {/* Search Input */}
            <div className="relative w-full lg:w-96">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={T.SEARCH_PLACEHOLDER}
                    className="w-full rounded-lg border-none bg-surface py-2.5 pl-10 pr-4 text-body-md text-on-surface transition-all focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary"
                />
            </div>

            {/* Right side filters */}
            <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto">
                {/* Status dropdown */}
                <select
                    aria-label="Lọc trạng thái"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="cursor-pointer rounded-lg border-none bg-surface py-2 pl-3 pr-8 text-body-sm text-on-surface focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary"
                >
                    {STATUS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>

                {/* Date range */}
                <div className="flex items-center gap-2 rounded-lg bg-surface px-3 py-2">
                    <CalendarDays size={18} className="text-on-surface-variant" />
                    <input
                        type="date"
                        aria-label="Từ ngày"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-32 cursor-pointer border-none bg-transparent p-0 text-body-sm text-on-surface focus:outline-none focus:ring-0"
                    />
                    <span className="text-on-surface-variant">{T.DATE_SEPARATOR}</span>
                    <input
                        type="date"
                        aria-label="Đến ngày"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-32 cursor-pointer border-none bg-transparent p-0 text-body-sm text-on-surface focus:outline-none focus:ring-0"
                    />
                </div>

                {/* More filters */}
                <button className="ml-auto flex items-center gap-2 rounded-lg border border-outline-variant px-4 py-2 text-body-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low lg:ml-2">
                    <SlidersHorizontal size={18} />
                    {T.BTN_MORE_FILTER}
                </button>
            </div>
        </div>
    );
}
