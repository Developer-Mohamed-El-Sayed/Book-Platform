import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Crown, Calendar, User } from 'lucide-react';
import { Book } from '../../types';

interface BookCardProps {
  book: Book;
  index?: number;
}

const BookCard: React.FC<BookCardProps> = ({ book, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      <Link to={`/book/${book.id}`}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
          {/* Cover Image */}
          <div className="relative h-64 sm:h-72 overflow-hidden">
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* VIP Badge */}
            {book.isVip && (
              <div className="absolute top-3 right-3">
                <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  <Crown className="w-3 h-3" />
                  <span>VIP</span>
                </div>
              </div>
            )}

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Quick Actions */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <motion.div
                initial={{ scale: 0.8 }}
                whileHover={{ scale: 1 }}
                className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg px-4 py-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                View Details
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {book.title}
            </h3>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <User className="w-4 h-4" />
              <span>{book.author}</span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {book.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{new Date(book.publishedAt).toLocaleDateString()}</span>
              </div>
              
              {book.pages && (
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  {book.pages} pages
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BookCard;