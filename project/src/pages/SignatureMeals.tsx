import { useEffect, useState } from 'react';
import { Flame, Beef, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Define TypeScript interface
interface SignatureMeal {
  id: string;
  name: string;
  description: string | null;
  total_calories: number | null;
  total_protein: number | null;
  total_carbs: number | null;
  total_fats: number | null;
  base_cost: number | null;
  tier: string | null;
  is_featured: boolean | null;
  image_url: string | null;
  chef_notes: string | null;
  cuisine_id: string | null;
}

interface Cuisine {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
}

interface SignatureMealsProps {
  onNavigate?: (page: string) => void;
}

export function SignatureMeals({ onNavigate }: SignatureMealsProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [meals, setMeals] = useState<(SignatureMeal & { cuisine: Cuisine | null })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to safely format numbers
  const formatNumber = (value: number | null | undefined, decimals: number = 1): string => {
    return (value ?? 0).toFixed(decimals);
  };

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    try {
      const { data: mealsData, error: mealsError } = await supabase
        .from('signature_meals')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false });

      if (mealsError) {
        console.error('Error fetching meals:', mealsError);
        setError(mealsError.message);
        setLoading(false);
        return;
      }

      if (mealsData) {
        // Validate and fetch cuisines
        const mealsWithCuisine = await Promise.all(
          mealsData.map(async (meal) => {
            // Ensure numeric fields have defaults
            const validatedMeal = {
              ...meal,
              total_calories: meal.total_calories ?? 0,
              total_protein: meal.total_protein ?? 0,
              total_carbs: meal.total_carbs ?? 0,
              total_fats: meal.total_fats ?? 0,
              base_cost: meal.base_cost ?? 0
            };

            const { data: cuisine } = await supabase
              .from('cuisines')
              .select('*')
              .eq('id', meal.cuisine_id)
              .maybeSingle();

            return { ...validatedMeal, cuisine };
          })
        );

        setMeals(mealsWithCuisine);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Failed to load meals');
    } finally {
      setLoading(false);
    }
  };

  const getTierBadgeColor = (tier: string | null) => {
    switch (tier) {
      case 'best':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'better':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  const getTierName = (tier: string | null) => {
    switch (tier) {
      case 'best':
        return 'Gourmet';
      case 'better':
        return 'Premium';
      default:
        return 'Good';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-400">Loading signature meals...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <p className="text-xl text-red-400 mb-4">Error loading meals</p>
            <p className="text-gray-400">{error}</p>
            <button
              onClick={loadMeals}
              className="mt-6 px-6 py-3 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Signature <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600">Chef Meals</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Premium, chef-curated high-protein dishes crafted for peak performance
          </p>
        </div>

        {meals.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400 mb-8">
              Our chefs are crafting amazing meals. Check back soon!
            </p>
            {onNavigate && (
              <button
                onClick={() => onNavigate('builder')}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition-all inline-flex items-center space-x-2"
              >
                <span>Build Custom Meal Instead</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {meals.map((meal) => (
                <div
                  key={meal.id}
                  className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-xl overflow-hidden hover:border-amber-500/50 transition-all group"
                >
                  <div className="aspect-video bg-gradient-to-br from-amber-900/20 to-zinc-900 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Beef className="w-16 h-16 text-amber-500/30" />
                    
                    {/* Cuisine Badge */}
                    {meal.cuisine && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-sm rounded-full text-xs font-medium border border-white/10">
                        {meal.cuisine.name}
                      </div>
                    )}
                    
                    {/* Tier Badge */}
                    <div
                      className={`absolute top-4 right-4 px-3 py-1 backdrop-blur-sm rounded-full text-xs font-medium border ${getTierBadgeColor(
                        meal.tier
                      )}`}
                    >
                      {getTierName(meal.tier)}
                    </div>

                    {/* Featured Badge */}
                    {meal.is_featured && (
                      <div className="absolute bottom-4 left-4 px-3 py-1 bg-yellow-500/20 backdrop-blur-sm rounded-full text-xs font-medium border border-yellow-500/30 text-yellow-300">
                        ⭐ Featured
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-amber-400 transition-colors">
                      {meal.name}
                    </h3>
                    {meal.description && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{meal.description}</p>
                    )}

                    {/* Macros Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <Flame className="w-4 h-4 text-orange-400" />
                          <span className="text-xs text-gray-400">Calories</span>
                        </div>
                        <div className="text-lg font-bold">{formatNumber(meal.total_calories, 0)}</div>
                      </div>

                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <Beef className="w-4 h-4 text-red-400" />
                          <span className="text-xs text-gray-400">Protein</span>
                        </div>
                        <div className="text-lg font-bold">{formatNumber(meal.total_protein, 0)}g</div>
                      </div>

                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Carbs</div>
                        <div className="text-lg font-bold">{formatNumber(meal.total_carbs, 0)}g</div>
                      </div>

                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Fats</div>
                        <div className="text-lg font-bold">{formatNumber(meal.total_fats, 0)}g</div>
                      </div>
                    </div>

                    {/* Chef Notes */}
                    {meal.chef_notes && (
                      <div className="bg-amber-500/10 border-l-4 border-amber-500/50 p-3 mb-4 rounded">
                        <p className="text-xs text-gray-300">
                          <span className="font-semibold text-amber-400">Chef's Note:</span> {meal.chef_notes}
                        </p>
                      </div>
                    )}

                    {/* Price and Action */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div>
                        <div className="text-xs text-gray-400">Starting at</div>
                        <div className="text-2xl font-bold text-amber-400">₹{formatNumber(meal.base_cost, 0)}</div>
                      </div>
                      <button
                        onClick={() => onNavigate && onNavigate('plans')}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition-all text-sm"
                      >
                        Add to Plan
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Meal CTA */}
            {onNavigate && (
              <div className="text-center">
                <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-xl p-8 max-w-2xl mx-auto">
                  <h3 className="text-2xl font-bold mb-4">Want Something Custom?</h3>
                  <p className="text-gray-400 mb-6">
                    Use our AI-powered meal builder to create your perfect meal with real-time macro tracking
                  </p>
                  <button
                    onClick={() => onNavigate('builder')}
                    className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition-all inline-flex items-center space-x-2"
                  >
                    <span>Build Custom Meal</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SignatureMeals;
