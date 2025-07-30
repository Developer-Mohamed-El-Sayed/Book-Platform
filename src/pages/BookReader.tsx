import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Settings,
  BookOpen,
  Maximize,
  Minimize,
  Download,
} from "lucide-react";
import { useBooks } from "../contexts/BookContext";
import { useAuth } from "../contexts/AuthContext";
import { Document, Page, pdfjs } from "react-pdf";
import { booksAPI, userAPI } from "../services/api";
import LoadingSpinner from "../components/UI/LoadingSpinner";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const BookReader: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getBook, updateBook } = useBooks();
  const { user } = useAuth();
  const navigate = useNavigate();

  const book = id ? getBook(id) : undefined;
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [numPages, setNumPages] = useState(0);

  useEffect(() => {
    if (book && book.lastReadPage) {
      setCurrentPage(book.lastReadPage);
    }
  }, [book]);

  useEffect(() => {
    // Save reading progress
    if (book && currentPage > 0) {
      updateBook(book.id, { lastReadPage: currentPage });
      // Also save to backend
      userAPI.updateReadingProgress(book.id, currentPage).catch(console.error);
    }
  }, [book, currentPage, updateBook]);

  useEffect(() => {
    let timeout: number;
    if (isFullscreen) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [isFullscreen, showControls]);

  useEffect(() => {
    const loadPdf = async () => {
      if (!book) return;

      try {
        setIsLoading(true);
        const response = await booksAPI.getPdfUrl(book.id);
        setPdfUrl(response.pdfUrl);
      } catch (error) {
        console.error("Failed to load PDF:", error);
        // Fallback to mock PDF for demo
        setPdfUrl("/sample.pdf");
      } finally {
        setIsLoading(false);
      }
    };

    loadPdf();
  }, [book]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("PDF load error:", error);
    setIsLoading(false);
  };

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Book not found
          </h1>
          <button
            onClick={() => navigate("/books")}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-500"
          >
            Back to Books
          </button>
        </div>
      </div>
    );
  }

  const canRead = !book.isVip || user?.isVip || user?.isAuthor;

  if (!user) {
    navigate("/login", { state: { from: location } });
    return null;
  }

  if (!canRead) {
    navigate("/vip");
    return null;
  }

  const totalPages = numPages || book.pages || 100;

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleZoomIn = () => {
    if (zoom < 200) {
      setZoom(zoom + 25);
    }
  };

  const handleZoomOut = () => {
    if (zoom > 50) {
      setZoom(zoom - 25);
    }
  };

  const resetZoom = () => {
    setZoom(100);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setShowControls(true);
  };

  const handleMouseMove = () => {
    if (isFullscreen) {
      setShowControls(true);
    }
  };

  return (
    <div
      className={`${
        isFullscreen ? "fixed inset-0 z-50" : "min-h-screen pt-20"
      } bg-gray-900 text-white`}
      onMouseMove={handleMouseMove}
    >
      {/* Header Controls */}
      <AnimatePresence>
        {(!isFullscreen || showControls) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`${
              isFullscreen ? "absolute top-0 left-0 right-0 z-10" : ""
            } bg-gray-800/90 backdrop-blur-sm border-b border-gray-700`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    <h1 className="text-lg font-semibold">{book.title}</h1>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Page Info */}
                  <div className="text-sm text-gray-300">
                    Page {currentPage} of {totalPages}
                  </div>

                  {/* Progress Bar */}
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentPage / totalPages) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Reader Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative max-w-4xl w-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <LoadingSpinner size="lg" className="text-white" />
            </div>
          ) : pdfUrl ? (
            <div
              className="bg-white rounded-lg shadow-2xl overflow-hidden"
              style={{ transform: `scale(${zoom / 100})` }}
            >
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div className="flex items-center justify-center h-96">
                    <LoadingSpinner size="lg" />
                  </div>
                }
                error={
                  <div className="flex items-center justify-center h-96 text-red-600">
                    <div className="text-center">
                      <p className="text-lg font-semibold mb-2">
                        Failed to load PDF
                      </p>
                      <p className="text-sm">Please try again later</p>
                    </div>
                  </div>
                }
              >
                <Page
                  pageNumber={currentPage}
                  width={800}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 text-white">
              <div className="text-center">
                <p className="text-lg font-semibold mb-2">No PDF available</p>
                <p className="text-sm">This book doesn't have a PDF file</p>
              </div>
            </div>
          )}

          {/* Navigation Arrows */}
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Bottom Controls */}
      <AnimatePresence>
        {(!isFullscreen || showControls) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`${
              isFullscreen ? "absolute bottom-0 left-0 right-0 z-10" : ""
            } bg-gray-800/90 backdrop-blur-sm border-t border-gray-700`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                {/* Page Navigation */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <div className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm">
                    {currentPage} / {totalPages}
                  </div>

                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleZoomOut}
                    disabled={zoom <= 50}
                    className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>

                  <div className="px-3 py-2 bg-gray-700 text-white rounded-lg text-sm min-w-[60px] text-center">
                    {zoom}%
                  </div>

                  <button
                    onClick={handleZoomIn}
                    disabled={zoom >= 200}
                    className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>

                  <button
                    onClick={resetZoom}
                    className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Additional Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    {isFullscreen ? (
                      <Minimize className="w-4 h-4" />
                    ) : (
                      <Maximize className="w-4 h-4" />
                    )}
                  </button>

                  <button className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Input Modal */}
      <div className="hidden">
        {/* This would be implemented for direct page navigation */}
      </div>
    </div>
  );
};

export default BookReader;
