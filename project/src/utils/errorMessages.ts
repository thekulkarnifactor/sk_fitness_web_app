export interface ErrorMessage {
  message: string;
  action?: string;
  actionLink?: string;
}

export const getAuthErrorMessage = (error: string): ErrorMessage => {
  const errorLower = error.toLowerCase();

  if (errorLower.includes('already registered') || errorLower.includes('duplicate')) {
    return {
      message: "This email is already registered.",
      action: "Try logging in instead?",
      actionLink: "switch-to-login"
    };
  }

  if (errorLower.includes('invalid') && errorLower.includes('credentials')) {
    return {
      message: "Email or password doesn't match.",
      action: "Double-check your info or reset your password.",
      actionLink: "forgot-password"
    };
  }

  if (errorLower.includes('email') && errorLower.includes('not') && errorLower.includes('confirmed')) {
    return {
      message: "Please confirm your email first.",
      action: "Check your inbox for a confirmation link.",
      actionLink: "resend-confirmation"
    };
  }

  if (errorLower.includes('weak') || errorLower.includes('password')) {
    return {
      message: "Password is too weak.",
      action: "Use at least 6 characters (8+ recommended).",
    };
  }

  if (errorLower.includes('network') || errorLower.includes('fetch')) {
    return {
      message: "Connection problem.",
      action: "Check your internet and try again.",
    };
  }

  if (errorLower.includes('rate limit') || errorLower.includes('too many')) {
    return {
      message: "Too many attempts.",
      action: "Please wait a few minutes and try again.",
    };
  }

  return {
    message: "Something went wrong on our end.",
    action: "Please try again. If this persists, contact support.",
    actionLink: "contact-support"
  };
};

export const getFormErrorMessage = (field: string, value: string, error: string): string => {
  switch (field) {
    case 'email':
      if (!value) return "We need your email to send meal confirmations";
      return "Please enter a valid email address (e.g., you@example.com)";

    case 'password':
      if (!value) return "Create a password to secure your account";
      return "Password must be at least 6 characters (8+ recommended)";

    case 'fullName':
    case 'name':
      if (!value) return "We'd love to know your name";
      return "Please enter your first and last name";

    case 'phone':
      if (!value) return null;
      return "Use format: +1 234-567-8900 or +91 98765 43210";

    case 'message':
      if (!value) return "Let us know how we can help you";
      return "Please enter a message (at least 10 characters)";

    default:
      if (!value) return "This field is required";
      return error || "Please check this field";
  }
};

export const getSuccessMessage = (action: string, context?: any): string => {
  switch (action) {
    case 'signup':
      return `Welcome to House of Macros${context?.name ? `, ${context.name}` : ''}! Let's build your first meal.`;

    case 'login':
      return `Welcome back${context?.name ? `, ${context.name}` : ''}!`;

    case 'contact':
      return "Got it! We'll reply within 24 hours (usually much faster).";

    case 'calculation':
      return "Perfect! Here's your personalized nutrition plan.";

    case 'meal-saved':
      return "Meal saved to your dashboard! Ready to order?";

    case 'profile-updated':
      return "Your profile has been updated successfully.";

    default:
      return "Success! Your changes have been saved.";
  }
};

export const getLoadingMessage = (action: string): string => {
  switch (action) {
    case 'auth-check':
      return "Checking your account...";

    case 'signing-in':
      return "Logging you in...";

    case 'signing-up':
      return "Creating your account...";

    case 'calculating':
      return "Calculating your perfect macros...";

    case 'loading-dashboard':
      return "Loading your meals...";

    case 'loading-ingredients':
      return "Loading ingredients...";

    case 'submitting-form':
      return "Sending your message...";

    case 'saving':
      return "Saving your changes...";

    default:
      return "Loading...";
  }
};
