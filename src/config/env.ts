// Environment configuration
export const config = {
  // API Configuration
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3001/api",

  // Stripe Configuration
  stripePublishableKey:
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_your_publishable_key",

  // Google OAuth Configuration
  googleClientId:
    import.meta.env.VITE_GOOGLE_CLIENT_ID || "your_google_client_id",

  // Environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,

  // Feature flags
  features: {
    enableGoogleOAuth: !!import.meta.env.VITE_GOOGLE_CLIENT_ID,
    enableStripe: !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  },
};

export default config;
