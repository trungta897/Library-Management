"use client";

import { Bell, LayoutDashboard } from "lucide-react";
import { UI_TEXT } from "@/constants/ui-text";

export default function Topbar() {
    return (
        <header className="flex items-center justify-between gap-6 border-y border-surface-container-high bg-white px-8 py-6">
            <div>
                <h1 className="flex items-center gap-2 text-[28px] font-semibold leading-tight text-ink-950">
                    <LayoutDashboard size={24} className="text-primary-600" />
                    {UI_TEXT.ADMIN_LAYOUT.TOPBAR.HEADING}
                </h1>
                <p className="mt-1 text-[14.5px] text-ink-950/55">{UI_TEXT.ADMIN_LAYOUT.TOPBAR.SUBHEADING}</p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
                <button className="focus-ring shadow-card relative grid h-10 w-10 place-items-center rounded-full border border-ink-950/10 bg-white text-ink-950/60 transition-colors hover:text-ink-950">
                    <Bell size={17} />
                    <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rust-500" />
                </button>
            </div>
        </header>
    );
}
