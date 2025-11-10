import { useEffect, useState } from 'react';
import { Activity, Flame, TrendingUp, Target, Sparkles, Beef, Calendar, ChefHat } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

interface UserStats {
  calories_consumed: number;
  calories_burned: number;
  current_weight: number;
  strength_index: number;
}

interface UserMeal {
  id: string;
  name: string;
  meal_type: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fats: number;
  created_at: string;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [meals, setMeals] = useState<UserMeal[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    const [statsRes, mealsRes, profileRes] = await Promise.all([
      supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle(),
      supabase
        .from('user_meals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle(),
    ]);

    if (statsRes.data) setStats(statsRes.data);
    if (mealsRes.data) setMeals(mealsRes.data);
    if (profileRes.data) setProfile(profileRes.data);

    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    onNavigate('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your meals and stats...</p>
        </div>
      </div>
    );
  }

  const caloriesConsumed = stats?.calories_consumed || 0;
  const caloriesBurned = stats?.calories_burned || 0;
  const netCalories = caloriesConsumed - caloriesBurned;
  const dailyTarget = profile?.daily_calories || 2000;
  const proteinTarget = profile?.daily_protein || 150;

  const calorieProgress = Math.min((caloriesConsumed / dailyTarget) * 100, 100);

  const aiSuggestions = [
    {
      icon: Sparkles,
      title: 'Great Progress!',
      description: `You've logged ${meals.length} meals this week. Keep the momentum going!`,
    },
    {
      icon: Target,
      title: 'Hit Your Protein Goal',
      description: `Aim for ${proteinTarget}g of protein today for optimal recovery.`,
    },
    {
      icon: Activity,
      title: 'Stay Active',
      description: 'Add a workout session to burn extra calories and boost strength.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600">{profile?.full_name || 'Athlete'}</span>
            </h1>
            <p className="text-gray-400">Track your progress and crush your goals</p>
          </div>
          <button
            onClick={handleSignOut}
            className="mt-4 md:mt-0 px-6 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
          >
            Sign Out
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-amber-500/20 to-yellow-600/20 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center">
                  <Flame className="w-6 h-6 text-black" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Today's Calories</div>
                  <div className="text-2xl font-bold">{caloriesConsumed}</div>
                </div>
              </div>
            </div>
            <div className="w-full bg-black/30 rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-amber-500 to-yellow-600 h-3 rounded-full transition-all"
                style={{ width: `${calorieProgress}%` }}
              />
            </div>
            <div className="text-xs text-gray-400">Target: {dailyTarget} kcal</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Beef className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Net Calories</div>
                <div className="text-2xl font-bold">{netCalories}</div>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              Consumed: {caloriesConsumed} • Burned: {caloriesBurned}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Strength Index</div>
                <div className="text-2xl font-bold">{stats?.strength_index || 50}</div>
              </div>
            </div>
            <div className="text-xs text-gray-400">Keep training to improve</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <Calendar className="w-6 h-6 mr-2 text-amber-400" />
                  Your Saved Meals
                </h2>
                <button
                  onClick={() => onNavigate('builder')}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition-all"
                >
                  Create New
                </button>
              </div>

              {meals.length === 0 ? (
                <div className="text-center py-12">
                  <ChefHat className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Ready to build your first perfect meal?</h3>
                  <p className="text-gray-400 mb-6">It takes just 5 minutes to create a meal that hits your macros perfectly.</p>
                  <button
                    onClick={() => onNavigate('builder')}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition-all mb-3"
                  >
                    Build Your First Meal →
                  </button>
                  <button
                    onClick={() => onNavigate('signature')}
                    className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all block w-full"
                  >
                    Or Browse Signature Meals
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {meals.map((meal) => (
                    <div
                      key={meal.id}
                      className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{meal.name}</h3>
                          <p className="text-sm text-gray-400 capitalize">{meal.meal_type}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-amber-400 font-bold">{meal.total_calories} kcal</div>
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-400">
                        <span>Protein: {meal.total_protein}g</span>
                        <span>Carbs: {meal.total_carbs}g</span>
                        <span>Fats: {meal.total_fats}g</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm border border-white/10 rounded-2xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Sparkles className="w-6 h-6 mr-2 text-amber-400" />
                AI Insights
              </h2>

              <div className="space-y-4">
                {aiSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-amber-500/50 transition-all"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <suggestion.icon className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{suggestion.title}</h3>
                        <p className="text-sm text-gray-400">{suggestion.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                <h3 className="font-semibold mb-2 text-amber-400">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => onNavigate('builder')}
                    className="w-full text-left px-3 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all text-sm"
                  >
                    Build a Custom Meal
                  </button>
                  <button
                    onClick={() => onNavigate('signature')}
                    className="w-full text-left px-3 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all text-sm"
                  >
                    Browse Signature Meals
                  </button>
                  <button
                    onClick={() => onNavigate('calculator')}
                    className="w-full text-left px-3 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all text-sm"
                  >
                    Recalculate Targets
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
