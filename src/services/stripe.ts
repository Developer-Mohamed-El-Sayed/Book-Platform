import { loadStripe } from "@stripe/stripe-js";
import { stripeAPI } from "./api";
import { config } from "../config/env";

// Initialize Stripe
const stripePromise = loadStripe(config.stripePublishableKey);

export const stripeService = {
  // Create checkout session and redirect to Stripe
  createCheckoutSession: async (plan: "monthly" | "yearly") => {
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      // Create checkout session on backend
      const { sessionId } = await stripeAPI.createCheckoutSession(plan);

      // Redirect to Stripe checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      throw error;
    }
  },

  // Create portal session for subscription management
  createPortalSession: async () => {
    try {
      const { url } = await stripeAPI.createPortalSession();
      window.location.href = url;
    } catch (error) {
      console.error("Portal session error:", error);
      throw error;
    }
  },

  // Get subscription status
  getSubscriptionStatus: async () => {
    try {
      return await stripeAPI.getSubscriptionStatus();
    } catch (error) {
      console.error("Subscription status error:", error);
      throw error;
    }
  },

  // Handle successful payment redirect
  handlePaymentSuccess: async (sessionId: string) => {
    try {
      // Verify payment on backend
      const response = await fetch("/api/stripe/verify-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        throw new Error("Payment verification failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Payment verification error:", error);
      throw error;
    }
  },
};

export default stripeService;
