export interface User {
  id: string;
  email: string;
  name: string;
  isVip: boolean;
  isAuthor: boolean;
  avatar?: string;
  subscriptionId?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  pdfUrl: string;
  isVip: boolean;
  publishedAt: string;
  pages?: number;
  lastReadPage?: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  upgradeToVip: () => Promise<boolean>;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export interface BookContextType {
  books: Book[];
  addBook: (book: Omit<Book, "id" | "publishedAt">) => Promise<Book>;
  updateBook: (id: string, updates: Partial<Book>) => Promise<Book>;
  deleteBook: (id: string) => Promise<void>;
  getBook: (id: string) => Book | undefined;
  getFreeBooks: () => Book[];
  getVipBooks: () => Book[];
}
