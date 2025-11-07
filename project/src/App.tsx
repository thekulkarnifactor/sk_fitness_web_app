import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navigation } from './components/Navigation';
import { SkipLinks } from './components/SkipLink';
import { Home } from './pages/Home';
import { MealBuilder } from './pages/MealBuilder';
import SignatureMeals from './pages/SignatureMeals';
import { Plans } from './pages/Plans';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Auth } from './pages/Auth';
import { Calculator } from './pages/Calculator';
import { Dashboard } from './pages/Dashboard';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [calculatedCalories, setCalculatedCalories] = useState(600);
  const [calculatedProtein, setCalculatedProtein] = useState(50);
  const { user, loading } = useAuth();

  // Fix: Handle auth redirect in useEffect
  useEffect(() => {
    if (currentPage === 'dashboard' && !user && !loading) {
      setCurrentPage('auth');
    }
  }, [currentPage, user, loading]);

  const handleCalculationComplete = (calories: number, protein: number) => {
    setCalculatedCalories(calories);
    setCalculatedProtein(protein);
  };

  const handleAuthSuccess = () => {
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    if (loading) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" role="status" aria-label="Loading"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'calculator':
        return <Calculator onNavigate={setCurrentPage} onCalculationComplete={handleCalculationComplete} />;
      case 'builder':
        return (
          <MealBuilder
            onNavigate={setCurrentPage}
            targetCalories={calculatedCalories}
            targetProtein={calculatedProtein}
          />
        );
      case 'signature':
        return <SignatureMeals onNavigate={setCurrentPage} />;
      case 'plans':
        return <Plans onNavigate={setCurrentPage} />;
      case 'about':
        return <About onNavigate={setCurrentPage} />;
      case 'contact':
        return <Contact onNavigate={setCurrentPage} />;
      case 'auth':
        return <Auth onNavigate={setCurrentPage} onSuccess={handleAuthSuccess} />;
      case 'dashboard':
        return user ? <Dashboard onNavigate={setCurrentPage} /> : <Auth onNavigate={setCurrentPage} onSuccess={handleAuthSuccess} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <SkipLinks />
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      <main id="main-content">
        {renderPage()}
      </main>
        <footer className="bg-zinc-950 border-t border-white/10 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-gray-400 text-sm">
              <p className="mb-2">&copy; 2025 House of Macros. All rights reserved.</p>
              <p className="text-xs">Crafted for Your Goals. Macros Made Personal.</p>
            </div>
          </div>
        </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
