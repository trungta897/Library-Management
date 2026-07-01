import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "Missing file" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "Missing GEMINI_API_KEY environment variable" }, { status: 500 });
        }

        const ai = new GoogleGenAI({ apiKey });

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Convert the buffer to base64
        const base64Data = buffer.toString("base64");

        const prompt = `You are a strict JSON data extractor. Look at the book cover/back image provided and extract the book's details.
        Extract the following fields if available:
        - "title": Book title (tiêu đề)
        - "author": Author name(s) (tác giả)
        - "isbn": ISBN number (mã số tiêu chuẩn quốc tế)
        - "category": Book category/genre (thể loại)
        - "pageCount": Number of pages (if mentioned, as number) (số trang)
        - "description": Book description or blurb (mô tả ngắn)
        
        Rules:
        - If you cannot find a field, return an empty string for text fields, or 0 for number fields.
        - Return ONLY a valid JSON object with the exact keys: "title", "author", "isbn", "category", "pageCount", "description".
        - Do not wrap the JSON in markdown code blocks, return raw JSON string.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                prompt,
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: file.type,
                    },
                },
            ],
            config: {
                responseMimeType: "application/json",
            },
        });

        if (response.text) {
            try {
                const data = JSON.parse(response.text.trim());
                return NextResponse.json(data);
            } catch (e) {
                console.error("Failed to parse Gemini response as JSON:", response.text);
                return NextResponse.json({ error: "Invalid AI response format" }, { status: 500 });
            }
        } else {
            return NextResponse.json({ error: "Empty AI response" }, { status: 500 });
        }
    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ error: "Failed to process image with AI" }, { status: 500 });
    }
}
