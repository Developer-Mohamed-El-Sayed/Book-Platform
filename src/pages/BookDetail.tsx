import React from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Calendar, User, Crown, Clock, Star } from 'lucide-react';
import { useBooks } from '../contexts/BookContext';
import { useAuth } from '../contexts/AuthContext';

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getBook } = useBooks();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const book = id ? getBook(id) : undefined;

  if (!book) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Book not found
          </h1>
          <Link
            to="/books"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-500"
          >
            Back to Books
          </Link>
        </div>
      </div>
    );
  }

  const canRead = !book.isVip || (user?.isVip || user?.isAuthor);

  const handleReadClick = () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    if (book.isVip && !user.isVip && !user.isAuthor) {
      navigate('/vip');
      return;
    }

    navigate(`/read/${book.id}`);
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/books"
            className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Books</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Book Cover */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-full h-full object-cover"
              />
              
              {/* VIP Badge */}
              {book.isVip && (
                <div className="absolute top-6 right-6">
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    <Crown className="w-4 h-4" />
                    <span>VIP Only</span>
                  </div>
                </div>
              )}

              {/* Reading Progress */}
              {user && book.lastReadPage && book.pages && (
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center justify-between text-white text-sm mb-2">
                      <span>Reading Progress</span>
                      <span>{Math.round((book.lastReadPage / book.pages) * 100)}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(book.lastReadPage / book.pages) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Book Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                {book.title}
              </h1>
              
              <div className="flex items-center space-x-4 text-lg text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>{book.author}</span>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-500 mb-6">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(book.publishedAt).toLocaleDateString()}</span>
                </div>
                
                {book.pages && (
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{book.pages} pages</span>
                  </div>
                )}

                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>4.8 rating</span>
                </div>

                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>~{Math.round((book.pages || 200) / 250)} hours</span>
                </div>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {book.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-6">
              {canRead ? (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReadClick}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>
                    {book.lastReadPage && book.lastReadPage > 0 ? 'Continue Reading' : 'Start Reading'}
                  </span>
                </motion.button>
              ) : (
                <div className="space-y-3">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-300">
                      <Crown className="w-5 h-5" />
                      <span className="font-medium">VIP Access Required</span>
                    </div>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                      This book is available exclusively for VIP members
                    </p>
                  </div>
                  
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/vip')}
                    className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <Crown className="w-5 h-5" />
                    <span>Upgrade to VIP</span>
                  </motion.button>
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Book Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Published</span>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {new Date(book.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Pages</span>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {book.pages || 'N/A'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Access</span>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {book.isVip ? 'VIP Only' : 'Free'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Format</span>
                  <div className="font-medium text-gray-900 dark:text-white">
                    PDF
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;