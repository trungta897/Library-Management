"use client";

import { useCallback, useState } from "react";
import { Loader2, PenLine, ScanLine, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { UI_TEXT } from "@/constants/ui-text";

const { SMART_CATALOGING } = UI_TEXT.ADMIN;

export default function SmartCataloging() {
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback(() => setIsDragging(false), []);
    const [statusMessage, setStatusMessage] = useState("Đang trích xuất AI...");

    const handleUploadMock = async (file: File) => {
        if (isProcessing) return;
        setIsProcessing(true);
        setStatusMessage("Đang quét mã vạch ISBN...");

        try {
            const { smartCatalogingService } = await import("@/services/smartCataloging");

            let bookData = null;

            // 1. Scan Barcode
            const isbn = await smartCatalogingService.readBarcode(file);
            if (isbn) {
                setStatusMessage(`Tìm thấy ISBN: ${isbn}, đang tải thông tin...`);
                bookData = await smartCatalogingService.searchGoogleBooks(isbn, "isbn");
            } else {
                // 2. OCR Fallback
                setStatusMessage("Không tìm thấy mã vạch, đang gửi ảnh cho AI phân tích...");
                const extractedInfo = await smartCatalogingService.readText(file);
                if (extractedInfo && (extractedInfo.title || extractedInfo.author || extractedInfo.isbn)) {
                    const cleanText = `${extractedInfo.title || ""} ${extractedInfo.author || ""}`.trim();
                    setStatusMessage(`AI nhận diện: "${cleanText.substring(0, 30)}..."`);
                    bookData = await smartCatalogingService.searchGoogleBooks(extractedInfo, "text");
                }
            }

            if (bookData) {
                setStatusMessage("Thành công! Đang chuyển hướng...");
                sessionStorage.setItem("smart_cataloging_data", JSON.stringify(bookData));
                setTimeout(() => {
                    setIsProcessing(false);
                    router.push("/admin/kho-sach?add=true&ai=success");
                }, 500);
            } else {
                setStatusMessage("Không thể nhận diện sách. Thử lại sau!");
                setTimeout(() => {
                    setIsProcessing(false);
                    setStatusMessage("Đang trích xuất AI...");
                }, 2000);
            }
        } catch (error) {
            console.error(error);
            setIsProcessing(false);
        }
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleUploadMock(files[0]);
        }
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleUploadMock(e.target.files[0]);
        }
    };

    return (
        <div className="shadow-card relative overflow-hidden rounded-xl border border-ink-950/[0.06] bg-white p-5">
            {isProcessing && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 px-4 text-center backdrop-blur-sm">
                    <Loader2 className="mb-2 h-8 w-8 animate-spin text-brass-600" />
                    <p className="text-[13px] font-medium text-ink-950/70">{statusMessage}</p>
                </div>
            )}
            <div className="flex items-center gap-2">
                <ScanLine size={17} className="text-brass-600" strokeWidth={2.25} />
                <h2 className="text-[16px] font-semibold text-ink-950">{SMART_CATALOGING.TITLE}</h2>
            </div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-950/50">{SMART_CATALOGING.SUBTITLE}</p>

            <label
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`focus-ring mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-8 text-center transition-colors ${
                    isDragging ? "border-brass-500 bg-brass-500/5" : "border-ink-950/15 bg-parchment-50/60 hover:border-ink-950/25 hover:bg-parchment-50"
                }`}
            >
                <input type="file" className="sr-only" accept="image/*" onChange={onFileChange} />
                <div className="shadow-card grid h-11 w-11 place-items-center rounded-full bg-white">
                    <UploadCloud size={19} className="text-ink-950/40" strokeWidth={1.75} />
                </div>
                <p className="text-[13px] font-medium text-ink-950/60">{SMART_CATALOGING.DRAG_DROP}</p>
                <p className="text-[12px] text-ink-950/35">{SMART_CATALOGING.OR_CLICK}</p>
            </label>

            <button
                onClick={() => router.push("/admin/kho-sach?add=true")}
                className="focus-ring mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-ink-950/10 py-2.5 text-[13px] font-medium text-ink-950/60 transition-colors hover:bg-ink-950/[0.03] hover:text-ink-950"
            >
                <PenLine size={14} strokeWidth={2} />
                {SMART_CATALOGING.MANUAL_ENTRY}
            </button>
        </div>
    );
}
