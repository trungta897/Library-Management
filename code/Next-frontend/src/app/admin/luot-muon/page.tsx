"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AdminBreadcrumb from "@/components/features/admin/AdminBreadcrumb";
import BorrowFilters from "@/components/features/luot-muon/BorrowFilters";
import BorrowTable, { type BorrowRecord } from "@/components/features/luot-muon/BorrowTable";
import { UI_TEXT } from "@/constants/ui-text";

const T = UI_TEXT.ADMIN_BORROW_MANAGEMENT.HEADER;

const MOCK_RECORDS: BorrowRecord[] = [
    {
        id: "BW-001",
        member: {
            name: "Nguyễn Văn Hải",
            code: "#MB-0921",
            avatarInitials: "NH",
            avatarColor: "secondary",
        },
        book: {
            title: "The Design of Everyday Things",
            author: "Don Norman",
        },
        borrowDate: "12/10/2024",
        dueDate: "26/10/2024",
        status: "borrowed",
    },
    {
        id: "BW-002",
        member: {
            name: "Trần Thị Minh",
            code: "#MB-1102",
        },
        book: {
            title: "Neuromancer",
            author: "William Gibson",
        },
        borrowDate: "01/10/2024",
        dueDate: "15/10/2024",
        status: "overdue",
        overdayCount: 2,
    },
    {
        id: "BW-003",
        member: {
            name: "Lê Tuấn Khang",
            code: "#MB-0844",
            avatarInitials: "LK",
            avatarColor: "tertiary",
        },
        book: {
            title: "Clean Code: A Handbook",
            author: "Robert C. Martin",
        },
        borrowDate: null,
        dueDate: null,
        status: "ready",
    },
];

export default function LuotMuonPage() {
    const [_open, setOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col gap-lg p-md md:p-xl">
            <AdminBreadcrumb pageName={UI_TEXT.ADMIN.SIDEBAR.NAV_BORROWS} />
            {/* Header */}
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-on-background">{T.TITLE}</h2>
                    <p className="mt-1 text-body-md text-on-surface-variant">{T.DESCRIPTION}</p>
                </div>
                <button
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-medium text-on-primary shadow-md transition-colors hover:bg-primary/90"
                >
                    <Plus size={20} />
                    {T.CREATE_BTN}
                </button>
            </div>

            {/* Filters */}
            <BorrowFilters />

            {/* Table */}
            <BorrowTable records={MOCK_RECORDS} />
        </div>
    );
}
