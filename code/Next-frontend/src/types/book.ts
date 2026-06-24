export interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  publishYear: number;
  pages: number;
  isbn: string;
  description: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  availableQuantity: number;
  quantity: number;
  shelfLocation?: string;
  depositPrice?: number;
  categories: string[];
}

export interface BookListItem {
  id: number;
  title: string;
  author: string;
  category: string;
  imageUrl: string;
  rating: number;
  availableQuantity: number;
}

export interface RelatedBook {
  id: number;
  title: string;
  author: string;
  coverImage: string;
}

