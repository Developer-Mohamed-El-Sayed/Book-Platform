import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Crown,
  Check,
  X,
  CreditCard,
  Shield,
  BookOpen,
  Star,
  Zap,
  Users,
  Download,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import Toast from "../components/UI/Toast";
import { stripeService } from "../services/stripe";

const VipSubscription: React.FC = () => {
  const { user, upgradeToVip } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
    isVisible: false,
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  if (user.isVip) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-yellow-50 via-white to-orange-50 dark:from-yellow-900/20 dark:via-gray-900 dark:to-orange-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-8">
              <Crown className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              You're Already VIP!
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Enjoy unlimited access to all premium books and exclusive content.
            </p>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Your VIP Benefits
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: BookOpen,
                    title: "Unlimited Access",
                    desc: "Read all premium books",
                  },
                  {
                    icon: Download,
                    title: "Offline Reading",
                    desc: "Download books for offline use",
                  },
                  {
                    icon: Star,
                    title: "Early Access",
                    desc: "Get new releases first",
                  },
                  {
                    icon: Users,
                    title: "Exclusive Community",
                    desc: "Join VIP reader discussions",
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/books")}
                className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-200"
              >
                Browse VIP Books
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Manage Subscription
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const plans = {
    monthly: {
      price: 9.99,
      period: "month",
      savings: null,
      popular: false,
    },
    yearly: {
      price: 99.99,
      period: "year",
      savings: "17%",
      popular: true,
    },
  };

  const features = [
    { name: "Unlimited access to all premium books", included: true },
    { name: "Download books for offline reading", included: true },
    { name: "Early access to new releases", included: true },
    { name: "Exclusive author Q&A sessions", included: true },
    { name: "VIP-only community forums", included: true },
    { name: "Ad-free reading experience", included: true },
    { name: "Priority customer support", included: true },
    { name: "Cancel anytime", included: true },
  ];

  const handleSubscribe = async () => {
    setIsProcessing(true);

    try {
      await stripeService.createCheckoutSession(selectedPlan);
      // User will be redirected to Stripe checkout
      // The success/failure will be handled by the backend webhook
    } catch (error) {
      console.error("Stripe checkout error:", error);
      showToast("Payment setup failed. Please try again.", "error");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-yellow-50 via-white to-orange-50 dark:from-yellow-900/20 dark:via-gray-900 dark:to-orange-900/20">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6">
            <Crown className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Upgrade to VIP Access
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Unlock unlimited access to premium books and exclusive content
          </p>
        </motion.div>

        {/* Pricing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setSelectedPlan("monthly")}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                selectedPlan === "monthly"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedPlan("yearly")}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 relative ${
                selectedPlan === "yearly"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              Yearly
              {plans.yearly.savings && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Save {plans.yearly.savings}
                </span>
              )}
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pricing Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 relative overflow-hidden"
          >
            {plans[selectedPlan].popular && (
              <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 text-sm font-medium">
                Most Popular
              </div>
            )}

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                VIP Access
              </h3>

              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                ${plans[selectedPlan].price}
                <span className="text-lg font-normal text-gray-600 dark:text-gray-400">
                  /{plans[selectedPlan].period}
                </span>
              </div>

              {selectedPlan === "yearly" && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  That's just $8.33/month!
                </p>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mb-6"
            >
              {isProcessing ? (
                <>
                  <LoadingSpinner size="sm" className="text-white" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Subscribe Now</span>
                </>
              )}
            </motion.button>

            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Shield className="w-4 h-4" />
              <span>Secure payment powered by Stripe</span>
            </div>
          </motion.div>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              What's Included
            </h3>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {feature.included ? (
                      <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <X className="w-3 h-3 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      feature.included
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-gray-400 line-through"
                    }`}
                  >
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-300 mb-2">
                <Star className="w-5 h-5" />
                <span className="font-medium">30-Day Money-Back Guarantee</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Not satisfied? Get a full refund within 30 days, no questions
                asked.
              </p>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Frequently Asked Questions
          </h3>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="space-y-6">
              {[
                {
                  q: "Can I cancel my subscription anytime?",
                  a: "Yes, you can cancel your VIP subscription at any time. You'll continue to have access until the end of your billing period.",
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major credit cards, PayPal, and other payment methods through Stripe's secure payment processing.",
                },
                {
                  q: "Is there a free trial?",
                  a: "While we don't offer a traditional free trial, we do have a 30-day money-back guarantee on all subscriptions.",
                },
                {
                  q: "Can I switch between monthly and yearly plans?",
                  a: "Yes, you can upgrade or downgrade your plan at any time from your profile settings.",
                },
              ].map(({ q, a }, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-4 last:pb-0"
                >
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {q}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VipSubscription;
