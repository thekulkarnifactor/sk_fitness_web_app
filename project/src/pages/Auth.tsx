import { useState, useEffect } from 'react';
import { LogIn, UserPlus, Dumbbell, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SmartInput } from '../components/SmartInput';
import { validators } from '../utils/validators';
import { getAuthErrorMessage, getLoadingMessage } from '../utils/errorMessages';

interface AuthProps {
  onNavigate: (page: string) => void;
  onSuccess: () => void;
}

export function Auth({ onNavigate, onSuccess }: AuthProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<{ message: string; action?: string }>({ message: '' });
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const validateForm = (): boolean => {
    if (!isLogin) {
      if (!firstName.trim()) {
        setError({ message: 'Please enter your first name' });
        return false;
      }
      if (!lastName.trim()) {
        setError({ message: 'Please enter your last name' });
        return false;
      }
    }

    if (!email.trim()) {
      setError({ message: 'Please enter your email' });
      return false;
    }

    const emailError = validators.email(email);
    if (emailError) {
      setError({ message: emailError });
      return false;
    }

    const passwordError = validators.password(password);
    if (passwordError) {
      setError({ message: passwordError });
      return false;
    }

    if (!isLogin) {
      if (!confirmPassword) {
        setError({ message: 'Please confirm your password' });
        return false;
      }
      if (password !== confirmPassword) {
        setError({ message: 'Passwords do not match' });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({ message: '' });

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    if (isLogin) {
      const { error: authError } = await signIn(email, password);
      if (authError) {
        const friendlyError = getAuthErrorMessage(authError.message);
        setError({ message: friendlyError.message, action: friendlyError.action });
      } else {
        onSuccess();
      }
    } else {
      // Combine first and last name for full name
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      const { error: authError } = await signUp(email, password, fullName);
      if (authError) {
        const friendlyError = getAuthErrorMessage(authError.message);
        setError({ message: friendlyError.message, action: friendlyError.action });
      } else {
        onSuccess();
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950 text-white pt-24 pb-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-2xl mb-4">
            <Dumbbell className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {isLogin ? 'Welcome Back' : 'Join Us'}
          </h1>
          <p className="text-gray-400">
            {isLogin
              ? 'Sign in to access your fitness dashboard'
              : 'Create your account to start your journey'}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <div className="flex gap-2 mb-8 bg-white/5 p-1 rounded-xl">
            <button
              onClick={() => {
                setIsLogin(true);
                setError({ message: '' });
              }}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                isLogin
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <LogIn className="w-5 h-5 inline mr-2" />
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError({ message: '' });
              }}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                !isLogin
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-5 h-5 inline mr-2" />
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                {/* First Name and Last Name Row */}
                <div className="grid grid-cols-2 gap-4">
                  <SmartInput
                    id="firstName"
                    label="First Name"
                    value={firstName}
                    onChange={setFirstName}
                    type="text"
                    placeholder="John"
                    required
                    validate={(value) => {
                      if (!value.trim()) return 'First name is required';
                      if (value.trim().length < 2) return 'At least 2 characters';
                      return '';
                    }}
                  />

                  <SmartInput
                    id="lastName"
                    label="Last Name"
                    value={lastName}
                    onChange={setLastName}
                    type="text"
                    placeholder="Doe"
                    required
                    validate={(value) => {
                      if (!value.trim()) return 'Last name is required';
                      if (value.trim().length < 2) return 'At least 2 characters';
                      return '';
                    }}
                  />
                </div>
              </>
            )}

            <SmartInput
              id="email"
              label="Email"
              value={email}
              onChange={setEmail}
              type="email"
              placeholder="you@example.com"
              required
              validate={validators.email}
            />

            <SmartInput
              id="password"
              label="Password"
              value={password}
              onChange={setPassword}
              type="password"
              placeholder="••••••••"
              required
              validate={validators.password}
              helperText={!isLogin ? 'At least 6 characters (8+ recommended for security)' : undefined}
            />

            {!isLogin && (
              <SmartInput
                id="confirmPassword"
                label="Confirm Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                type="password"
                placeholder="••••••••"
                required
                validate={(value) => {
                  if (!value) return 'Please confirm your password';
                  if (value !== password) return 'Passwords do not match';
                  return '';
                }}
                helperText="Re-enter your password to confirm"
              />
            )}

            {error.message && (
              <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg space-y-2">
                <div className="flex items-start space-x-2 text-red-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">{error.message}</p>
                    {error.action && (
                      <p className="text-sm text-red-300 mt-1">{error.action}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? getLoadingMessage(isLogin ? 'signing-in' : 'signing-up') : isLogin ? 'Log In' : 'Create My Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => onNavigate('home')}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
