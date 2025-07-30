import React, { createContext, useContext, useState, useEffect } from "react";
import { BookContextType, Book } from "../types";
import { booksAPI } from "../services/api";

const BookContext = createContext<BookContextType | undefined>(undefined);

export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useBooks must be used within a BookProvider");
  }
  return context;
};

const mockBooks: Book[] = [
  {
    id: "1",
    title: "The Digital Revolution",
    author: "Sarah Johnson",
    description:
      "An exploration of how technology has transformed society and what the future holds for humanity in the digital age.",
    coverUrl:
      "https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
    pdfUrl: "/sample.pdf",
    isVip: false,
    publishedAt: "2024-01-15",
    pages: 280,
    lastReadPage: 0,
  },
  {
    id: "2",
    title: "Mysteries of the Cosmos",
    author: "Dr. Michael Chen",
    description:
      "Journey through space and time to discover the most profound mysteries of our universe, from black holes to quantum mechanics.",
    coverUrl:
      "https://images.pexels.com/photos/1290141/pexels-photo-1290141.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
    pdfUrl: "/sample.pdf",
    isVip: true,
    publishedAt: "2024-02-20",
    pages: 340,
    lastReadPage: 0,
  },
  {
    id: "3",
    title: "The Art of Mindfulness",
    author: "Emma Williams",
    description:
      "Discover ancient wisdom and modern techniques for achieving inner peace and mental clarity in our chaotic world.",
    coverUrl:
      "https://images.pexels.com/photos/1556691/pexels-photo-1556691.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
    pdfUrl: "/sample.pdf",
    isVip: false,
    publishedAt: "2024-03-10",
    pages: 220,
    lastReadPage: 0,
  },
  {
    id: "4",
    title: "Advanced Machine Learning",
    author: "Prof. David Kumar",
    description:
      "Deep dive into cutting-edge ML algorithms, neural networks, and AI applications that are reshaping industries.",
    coverUrl:
      "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
    pdfUrl: "/sample.pdf",
    isVip: true,
    publishedAt: "2024-03-25",
    pages: 450,
    lastReadPage: 0,
  },
];

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksData = await booksAPI.getAll();
        setBooks(booksData);
      } catch (error) {
        console.error("Failed to fetch books:", error);
        // Fallback to mock data if API fails
        setBooks(mockBooks);
      }
    };

    fetchBooks();
  }, []);

  const addBook = async (book: Omit<Book, "id" | "publishedAt">) => {
    try {
      const newBook = await booksAPI.create(book as any);
      setBooks((prev) => [...prev, newBook]);
      return newBook;
    } catch (error) {
      console.error("Failed to add book:", error);
      throw error;
    }
  };

  const updateBook = async (id: string, updates: Partial<Book>) => {
    try {
      const updatedBook = await booksAPI.update(id, updates as any);
      setBooks((prev) =>
        prev.map((book) => (book.id === id ? updatedBook : book))
      );
      return updatedBook;
    } catch (error) {
      console.error("Failed to update book:", error);
      throw error;
    }
  };

  const deleteBook = async (id: string) => {
    try {
      await booksAPI.delete(id);
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (error) {
      console.error("Failed to delete book:", error);
      throw error;
    }
  };

  const getBook = (id: string) => {
    return books.find((book) => book.id === id);
  };

  const getFreeBooks = () => {
    return books.filter((book) => !book.isVip);
  };

  const getVipBooks = () => {
    return books.filter((book) => book.isVip);
  };

  return (
    <BookContext.Provider
      value={{
        books,
        addBook,
        updateBook,
        deleteBook,
        getBook,
        getFreeBooks,
        getVipBooks,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};
