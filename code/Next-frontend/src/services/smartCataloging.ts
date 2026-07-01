import { BrowserMultiFormatReader } from "@zxing/browser";
import axios from "axios";

export interface ExtractedBookInfo {
    title?: string;
    authors?: string[];
    isbn?: string;
    publisher?: string;
    publishedDate?: string;
    pageCount?: number;
    description?: string;
    thumbnail?: string;
    category?: string;
}

export const smartCatalogingService = {
    /**
     * Decode barcode from an image file using ZXing
     */
    async readBarcode(file: File): Promise<string | null> {
        try {
            const reader = new BrowserMultiFormatReader();
            const imageUrl = URL.createObjectURL(file);
            const result = await reader.decodeFromImageUrl(imageUrl);
            URL.revokeObjectURL(imageUrl);
            return result ? result.getText() : null;
        } catch (error) {
            console.error("Barcode decoding failed:", error);
            return null;
        }
    },

    /**
     * Read text from an image using the internal Gemini API route
     */
    async readText(file: File): Promise<{ title: string; author: string; isbn: string; category: string; pageCount: number; description: string } | null> {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/catalog/extract", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                return data; // returns { title: string, author: string, isbn: string, category: string, pageCount: number, description: string }
            }
            return null;
        } catch (error) {
            console.error("Gemini API Error:", error);
            return null;
        }
    },

    /**
     * Search Google Books by ISBN, Title, or Title+Author, with OpenLibrary Fallback
     */
    async searchGoogleBooks(
        query: string | { title: string; author: string; isbn?: string; category?: string; pageCount?: number; description?: string },
        type: "isbn" | "title" | "text",
    ): Promise<ExtractedBookInfo | null> {
        let q = "";
        let olQuery = "";

        if (type === "isbn") {
            q = `isbn:${query}`;
            olQuery = `isbn:${query}`;
        } else if (typeof query === "object") {
            // "text" type with object
            q = `intitle:${query.title} inauthor:${query.author}`;
            olQuery = `title=${encodeURIComponent(query.title)}&author=${encodeURIComponent(query.author)}`;
        } else {
            // plain string
            q = type === "title" ? `intitle:${query}` : query;
            olQuery = `q=${encodeURIComponent(query as string)}`;
        }

        try {
            const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}`);

            if (response.data.items && response.data.items.length > 0) {
                const volumeInfo = response.data.items[0].volumeInfo;

                // Find ISBN-13 or ISBN-10
                let isbn = "";
                if (volumeInfo.industryIdentifiers) {
                    const isbn13 = volumeInfo.industryIdentifiers.find((id: any) => id.type === "ISBN_13");
                    const isbn10 = volumeInfo.industryIdentifiers.find((id: any) => id.type === "ISBN_10");
                    isbn = isbn13 ? isbn13.identifier : isbn10 ? isbn10.identifier : "";
                }

                return {
                    title: volumeInfo.title,
                    authors: volumeInfo.authors || [],
                    isbn: isbn,
                    publisher: volumeInfo.publisher,
                    publishedDate: volumeInfo.publishedDate,
                    pageCount: volumeInfo.pageCount,
                    description: volumeInfo.description,
                    thumbnail: volumeInfo.imageLinks?.thumbnail,
                };
            }
        } catch (error) {
            console.warn("Google Books API search failed or rate limited:", error);
        }

        // Fallback to Open Library
        try {
            console.log("Falling back to OpenLibrary API...");
            const olUrl =
                type === "isbn"
                    ? `https://openlibrary.org/search.json?q=${encodeURIComponent(olQuery)}&limit=1`
                    : typeof query === "object"
                      ? `https://openlibrary.org/search.json?${olQuery}&limit=1`
                      : `https://openlibrary.org/search.json?${olQuery}&limit=1`;

            const response = await axios.get(olUrl);

            if (response.data.docs && response.data.docs.length > 0) {
                const doc = response.data.docs[0];
                return {
                    title: doc.title,
                    authors: doc.author_name || [],
                    isbn: doc.isbn && doc.isbn.length > 0 ? doc.isbn[0] : "",
                    publisher: doc.publisher && doc.publisher.length > 0 ? doc.publisher[0] : "",
                    publishedDate: doc.first_publish_year ? doc.first_publish_year.toString() : "",
                    pageCount: doc.number_of_pages_median,
                    description: "",
                    thumbnail: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : undefined,
                };
            }
        } catch (error) {
            console.error("OpenLibrary API search failed:", error);
        }

        // Final fallback: if we have title/author from Gemini but APIs failed, return what we have!
        if (type === "text" && typeof query === "object" && (query.title || query.author || query.isbn)) {
            console.log("Both APIs failed, returning extracted AI data as fallback.");
            return {
                title: query.title || "",
                authors: query.author ? [query.author] : [],
                isbn: query.isbn || "",
                publisher: "",
                publishedDate: "",
                pageCount: query.pageCount || 0,
                description: query.description || "",
                thumbnail: undefined,
                category: query.category || "",
            };
        }

        return null;
    },
};
