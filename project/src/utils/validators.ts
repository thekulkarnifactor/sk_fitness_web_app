export const validators = {
  email: (value: string): string | null => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },

  password: (value: string): string | null => {
    if (!value) return null;
    if (value.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return null;
  },

  phone: (value: string): string | null => {
    if (!value) return null;
    const phoneRegex = /^[+]?[\d\s()-]{10,}$/;
    if (!phoneRegex.test(value)) {
      return 'Please enter a valid phone number';
    }
    return null;
  },

  required: (value: string): string | null => {
    if (!value || value.trim().length === 0) {
      return 'This field is required';
    }
    return null;
  },

  name: (value: string): string | null => {
    if (!value) return null;
    if (value.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }
    return null;
  },
};
