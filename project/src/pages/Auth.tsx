import { useState } from 'react';
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
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<{ message: string; action?: string }>({ message: '' });
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const validateForm = (): boolean => {
    if (!isLogin && !fullName.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!email.trim()) {
      setError('Please enter your email');
      return false;
    }
    const emailError = validators.email(email);
    if (emailError) {
      setError(emailError);
      return false;
    }
    const passwordError = validators.password(password);
    if (passwordError) {
      setError(passwordError);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

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
              onClick={() => setIsLogin(true)}
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
              onClick={() => setIsLogin(false)}
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
              <SmartInput
                id="fullName"
                label="Full Name"
                value={fullName}
                onChange={setFullName}
                type="text"
                placeholder="John Doe"
                required
                validate={validators.name}
                helperText="How you'd like us to address you"
              />
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
