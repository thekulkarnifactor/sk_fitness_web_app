import { ChefHat, Menu, X, Calculator, Utensils, Sparkles, CreditCard, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

interface NavLink {
  name: string;
  path: string;
  icon: any;
  badge?: string;
  group: 'primary' | 'secondary';
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setProfileMenuOpen(false);
    onNavigate('home');
  };

  const primaryLinks: NavLink[] = [
    { name: 'Home', path: 'home', icon: ChefHat, group: 'primary' },
    { name: 'Get Started', path: 'calculator', icon: Calculator, badge: '1', group: 'primary' },
    { name: 'Build Meal', path: 'builder', icon: Utensils, badge: '2', group: 'primary' },
    { name: 'Chef Meals', path: 'signature', icon: Sparkles, group: 'primary' },
    { name: 'Pricing', path: 'plans', icon: CreditCard, group: 'primary' },
  ];

  const handleNavigation = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  };

  return (
    <nav id="navigation" className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => handleNavigation('home')}
            className="flex items-center space-x-3 group"
          >
            <div className="bg-gradient-to-br from-amber-400 to-yellow-600 p-2 rounded-lg group-hover:scale-105 transition-transform">
              <ChefHat className="w-6 h-6 text-black" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xl font-bold text-white tracking-tight">
                House of Macros
              </div>
              <div className="text-xs text-amber-400 font-medium">
                AI-Powered Nutrition
              </div>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {primaryLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavigation(link.path)}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                  currentPage === link.path
                    ? 'bg-amber-500 text-black'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.name}</span>
                {link.badge && (
                  <span className={`ml-1 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
                    currentPage === link.path
                      ? 'bg-black text-amber-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* User Menu / Login Button */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
                >
                  <User className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium text-white">Account</span>
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-white/10 rounded-xl shadow-xl overflow-hidden">
                    <div className="p-4 border-b border-white/10">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-medium text-white truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        handleNavigation('dashboard');
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/10 transition-all flex items-center space-x-2"
                    >
                      <User className="w-4 h-4" />
                      <span>Dashboard</span>
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-all flex items-center space-x-2 border-t border-white/10"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNavigation('auth')}
                className="px-6 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition-all text-sm"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black border-t border-white/10 max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="px-4 py-4 space-y-1">
            {/* User Section */}
            {user ? (
              <div className="mb-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Signed in</p>
                      <p className="text-sm font-medium text-white truncate max-w-[150px]">{user.email}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleNavigation('dashboard')}
                  className="w-full px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg text-sm font-medium mb-2 hover:bg-amber-500/30 transition-all"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 bg-red-500/10 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavigation('auth')}
                className="w-full mb-4 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold rounded-lg text-sm hover:shadow-lg transition-all"
              >
                Sign In / Create Account
              </button>
            )}

            {/* Navigation Links */}
            <div className="space-y-1">
              <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Navigation
              </p>
              {primaryLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => handleNavigation(link.path)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center space-x-3 ${
                    currentPage === link.path
                      ? 'bg-amber-500 text-black'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <link.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1">{link.name}</span>
                  {link.badge && (
                    <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${
                      currentPage === link.path
                        ? 'bg-black text-amber-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Quick Actions
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => handleNavigation('calculator')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-amber-500/10 to-yellow-600/10 border border-amber-500/30 text-amber-400 rounded-lg text-sm font-medium hover:bg-amber-500/20 transition-all flex items-center space-x-2"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Calculate My Macros</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for profile menu */}
      {profileMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setProfileMenuOpen(false)}
        />
      )}
    </nav>
  );
}
