import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Image,
  FileText,
  Crown,
  Calendar,
  User,
  BookOpen,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import { useBooks } from "../contexts/BookContext";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import Toast from "../components/UI/Toast";
import { booksAPI } from "../services/api";

interface BookFormData {
  title: string;
  author: string;
  description: string;
  isVip: boolean;
  pages: number;
  coverFile: File | null;
  pdfFile: File | null;
}

interface FormErrors {
  title?: string;
  author?: string;
  description?: string;
  pages?: string;
  coverFile?: string;
  pdfFile?: string;
}

const AddBook: React.FC = () => {
  const { addBook } = useBooks();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: user?.name || "",
    description: "",
    isVip: false,
    pages: 0,
    coverFile: null,
    pdfFile: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draggedOver, setDraggedOver] = useState<"cover" | "pdf" | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning";
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
    isVisible: false,
  });

  const showToast = (
    message: string,
    type: "success" | "error" | "warning"
  ) => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  if (!user?.isAuthor) {
    navigate("/");
    return null;
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.author.trim()) {
      newErrors.author = "Author name is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (formData.pages <= 0) {
      newErrors.pages = "Page count must be greater than 0";
    }
    if (!formData.coverFile) {
      newErrors.coverFile = "Cover image is required";
    }
    if (!formData.pdfFile) {
      newErrors.pdfFile = "PDF file is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "cover" | "pdf"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "cover") {
        if (file.type.startsWith("image/")) {
          setFormData((prev) => ({ ...prev, coverFile: file }));
          const reader = new FileReader();
          reader.onload = (e) => setPreviewUrl(e.target?.result as string);
          reader.readAsDataURL(file);
          setErrors((prev) => ({ ...prev, coverFile: undefined }));
        } else {
          showToast("Please select a valid image file", "error");
        }
      } else if (type === "pdf") {
        if (file.type === "application/pdf") {
          setFormData((prev) => ({ ...prev, pdfFile: file }));
          setErrors((prev) => ({ ...prev, pdfFile: undefined }));
        } else {
          showToast("Please select a valid PDF file", "error");
        }
      }
    }
  };

  const handleDrop = (e: React.DragEvent, type: "cover" | "pdf") => {
    e.preventDefault();
    setDraggedOver(null);

    const file = e.dataTransfer.files[0];
    if (file) {
      // Create a proper file input event
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const fakeEvent = {
        target: { files: dataTransfer.files },
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(fakeEvent, type);
    }
  };

  const handleDragOver = (e: React.DragEvent, type: "cover" | "pdf") => {
    e.preventDefault();
    setDraggedOver(type);
  };

  const handleDragLeave = () => {
    setDraggedOver(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("Please fix the errors below", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for multipart upload
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("author", formData.author);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("isVip", formData.isVip.toString());
      formDataToSend.append("pages", formData.pages.toString());

      if (formData.coverFile) {
        formDataToSend.append("cover", formData.coverFile);
      }
      if (formData.pdfFile) {
        formDataToSend.append("pdf", formData.pdfFile);
      }

      // Upload to backend
      await booksAPI.create(formDataToSend);

      showToast("Book published successfully!", "success");

      setTimeout(() => {
        navigate("/books");
      }, 2000);
    } catch (error) {
      console.error("Failed to publish book:", error);
      showToast("Failed to publish book. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Publish a New Book
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Share your story with the world
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-8"
        >
          {/* Basic Information */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Book Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                    errors.title
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Enter the book title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Author Name *
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                    errors.author
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Author name"
                />
                {errors.author && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.author}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                    errors.description
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Describe your book..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Number of Pages *
                </label>
                <input
                  type="number"
                  name="pages"
                  value={formData.pages}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                    errors.pages
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="e.g., 250"
                />
                {errors.pages && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.pages}
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isVip"
                    checked={formData.isVip}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <div className="flex items-center space-x-2">
                    <Crown className="w-5 h-5 text-yellow-500" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      VIP Only Book
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* File Uploads */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Files
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cover Image *
                </label>
                <div
                  onDrop={(e) => handleDrop(e, "cover")}
                  onDragOver={(e) => handleDragOver(e, "cover")}
                  onDragLeave={handleDragLeave}
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    draggedOver === "cover"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : errors.coverFile
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "cover")}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  {previewUrl ? (
                    <div className="space-y-4">
                      <img
                        src={previewUrl}
                        alt="Cover preview"
                        className="max-h-40 mx-auto rounded-lg shadow-md"
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click or drop to change image
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <Image className="w-8 h-8 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-300 font-medium">
                          Drop cover image here
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          or click to browse (PNG, JPG, WEBP)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                {errors.coverFile && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.coverFile}
                  </p>
                )}
              </div>

              {/* PDF Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  PDF File *
                </label>
                <div
                  onDrop={(e) => handleDrop(e, "pdf")}
                  onDragOver={(e) => handleDragOver(e, "pdf")}
                  onDragLeave={handleDragLeave}
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    draggedOver === "pdf"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : errors.pdfFile
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, "pdf")}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      {formData.pdfFile ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center text-green-600 dark:text-green-400">
                            <Check className="w-5 h-5 mr-2" />
                            <span className="font-medium">
                              {formData.pdfFile.name}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {(formData.pdfFile.size / 1024 / 1024).toFixed(2)}{" "}
                            MB
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Click or drop to change file
                          </p>
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-600 dark:text-gray-300 font-medium">
                            Drop PDF file here
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            or click to browse (PDF only)
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {errors.pdfFile && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.pdfFile}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate("/books")}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="text-white" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Publish Book</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default AddBook;
