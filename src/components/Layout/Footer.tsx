import React from "react";
import { motion } from "framer-motion";
import { Book, Heart, Github, Twitter, Mail } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Book className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Bookistry
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Discover amazing books and connect with authors in our vibrant
              reading community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <div className="space-y-2">
              {["Home", "Books", "Authors", "About"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Support
            </h3>
            <div className="space-y-2">
              {[
                "Help Center",
                "Contact Us",
                "Privacy Policy",
                "Terms of Service",
              ].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Connect
            </h3>
            <div className="flex space-x-3">
              {[
                { icon: Twitter, href: "#" },
                { icon: Github, href: "#" },
                { icon: Mail, href: "#" },
              ].map(({ icon: Icon, href }, index) => (
                <motion.a
                  key={index}
                  href={href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © 2024 BookPlatform. All rights reserved.
          </p>
          <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 mt-4 sm:mt-0">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>for readers everywhere</span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
