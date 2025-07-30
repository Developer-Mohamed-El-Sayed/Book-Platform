import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Crown,
  Calendar,
  BookOpen,
  Settings,
  Award,
  TrendingUp,
  Clock,
  Heart,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useBooks } from "../contexts/BookContext";
import BookCard from "../components/UI/BookCard";
import { stripeService } from "../services/stripe";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { books } = useBooks();
  const [activeTab, setActiveTab] = useState<
    "overview" | "reading" | "settings"
  >("overview");

  if (!user) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please log in to view your profile
          </h1>
          <Link
            to="/login"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-500"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const readingHistory = books.filter(
    (book) => book.lastReadPage && book.lastReadPage > 0
  );
  const favoriteBooks = books.slice(0, 2); // Mock favorites
  const readingStats = {
    totalBooks: readingHistory.length,
    totalPages: readingHistory.reduce(
      (sum, book) => sum + (book.lastReadPage || 0),
      0
    ),
    avgRating: 4.7,
    readingStreak: 15,
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "reading", label: "My Reading", icon: BookOpen },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 dark:border-blue-900"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
              )}

              {user.isVip && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-1">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {user.name}
              </h1>
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-6 text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Member since 2024</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                {user.isVip && (
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm rounded-full">
                    VIP Member
                  </span>
                )}
                {user.isAuthor && (
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm rounded-full">
                    Author
                  </span>
                )}
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded-full">
                  Active Reader
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col space-y-2">
              {!user.isVip && (
                <Link
                  to="/vip"
                  className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 text-center"
                >
                  Upgrade to VIP
                </Link>
              )}
              <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-8"
        >
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-8 px-6">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === id
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Reading Stats */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Reading Statistics
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        label: "Books Read",
                        value: readingStats.totalBooks,
                        icon: BookOpen,
                        color: "blue",
                      },
                      {
                        label: "Pages Read",
                        value: readingStats.totalPages,
                        icon: TrendingUp,
                        color: "green",
                      },
                      {
                        label: "Avg Rating",
                        value: readingStats.avgRating,
                        icon: Award,
                        color: "yellow",
                      },
                      {
                        label: "Reading Streak",
                        value: `${readingStats.readingStreak} days`,
                        icon: Clock,
                        color: "purple",
                      },
                    ].map(({ label, value, icon: Icon, color }) => (
                      <div
                        key={label}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {label}
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {value}
                            </p>
                          </div>
                          <div
                            className={`p-2 bg-${color}-100 dark:bg-${color}-900/30 rounded-lg`}
                          >
                            <Icon
                              className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Favorite Books */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Favorite Books
                  </h3>
                  {favoriteBooks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favoriteBooks.map((book, index) => (
                        <BookCard key={book.id} book={book} index={index} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No favorite books yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "reading" && (
              <div className="space-y-8">
                {/* Currently Reading */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Currently Reading
                  </h3>
                  {readingHistory.length > 0 ? (
                    <div className="space-y-4">
                      {readingHistory.map((book) => (
                        <div
                          key={book.id}
                          className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="w-16 h-20 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {book.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {book.author}
                            </p>
                            <div className="mt-2">
                              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                                <span>Progress</span>
                                <span>
                                  {book.lastReadPage} / {book.pages} pages
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{
                                    width: `${
                                      ((book.lastReadPage || 0) /
                                        (book.pages || 1)) *
                                      100
                                    }%`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <Link
                            to={`/read/${book.id}`}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Continue
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No books in progress</p>
                      <Link
                        to="/books"
                        className="inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Browse Books
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Account Settings
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={user.name}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      readOnly
                    />
                  </div>

                  {user.isVip && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        VIP Subscription
                      </h4>
                      <button
                        onClick={() => stripeService.createPortalSession()}
                        className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200"
                      >
                        Manage Subscription
                      </button>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
