import { useState, useEffect } from 'react';
import { Calculator as CalcIcon, Activity, Target, TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import { FormSection } from '../components/FormSection';

interface CalculatorProps {
  onNavigate: (page: string) => void;
  onCalculationComplete: (calories: number, protein: number) => void;
}

export function Calculator({ onNavigate, onCalculationComplete }: CalculatorProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [goal, setGoal] = useState('maintain');
  const [calculated, setCalculated] = useState(false);
  const [results, setResults] = useState({ calories: 0, protein: 0 });

  const activityLevels = [
    { id: 'sedentary', name: 'Sedentary', description: 'Little to no exercise', multiplier: 1.2 },
    { id: 'light', name: 'Light', description: 'Exercise 1-3 days/week', multiplier: 1.375 },
    { id: 'moderate', name: 'Moderate', description: 'Exercise 3-5 days/week', multiplier: 1.55 },
    { id: 'active', name: 'Active', description: 'Exercise 6-7 days/week', multiplier: 1.725 },
    { id: 'very_active', name: 'Very Active', description: 'Intense exercise daily', multiplier: 1.9 },
  ];

  const goals = [
    { id: 'lose', name: 'Lose Weight', icon: TrendingDown, adjustment: -500, description: 'Cut calories for fat loss' },
    { id: 'maintain', name: 'Maintain', icon: Minus, adjustment: 0, description: 'Stay at current weight' },
    { id: 'gain', name: 'Gain Muscle', icon: TrendingUp, adjustment: 300, description: 'Build muscle mass' },
  ];

  const calculateMacros = () => {
    const bmr = gender === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

    const activity = activityLevels.find(a => a.id === activityLevel);
    const tdee = bmr * (activity?.multiplier || 1.55);

    const goalData = goals.find(g => g.id === goal);
    const targetCalories = Math.round(tdee + (goalData?.adjustment || 0));

    const proteinGrams = Math.round(weight * 2.2);

    setResults({ calories: targetCalories, protein: proteinGrams });
    setCalculated(true);
  };

  const handleProceed = () => {
    onCalculationComplete(results.calories, results.protein);
    onNavigate('builder');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-2xl mb-4">
            <CalcIcon className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600">Perfect Macros</span>
          </h1>
          <p className="text-xl text-gray-400">
            Get personalized daily calories and protein targets in 2 minutes
          </p>
        </div>

        {!calculated ? (
          <div className="space-y-8">
            <FormSection title="Tell Us About Yourself" description="This helps us calculate your perfect daily calories and protein">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Gender</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setGender('male')}
                      aria-pressed={gender === 'male'}
                      className={`py-3 rounded-lg border-2 transition-all ${
                        gender === 'male'
                          ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      Male
                    </button>
                    <button
                      onClick={() => setGender('female')}
                      aria-pressed={gender === 'female'}
                      className={`py-3 rounded-lg border-2 transition-all ${
                        gender === 'female'
                          ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      Female
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="age-input" className="block text-sm font-medium mb-2">Age (years)</label>
                  <input
                    id="age-input"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-amber-500"
                    min="15"
                    max="100"
                  />
                </div>

                <div>
                  <label htmlFor="weight-input" className="block text-sm font-medium mb-2">Weight (kg)</label>
                  <input
                    id="weight-input"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-amber-500"
                    min="30"
                    max="200"
                  />
                </div>

                <div>
                  <label htmlFor="height-input" className="block text-sm font-medium mb-2">Height (cm)</label>
                  <input
                    id="height-input"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-amber-500"
                    min="120"
                    max="220"
                  />
                </div>
              </div>
            </FormSection>

            <FormSection title="How Active Are You?" description="More activity = more calories needed for recovery and performance">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activityLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setActivityLevel(level.id)}
                    aria-pressed={activityLevel === level.id}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      activityLevel === level.id
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <Activity className={`w-6 h-6 mb-2 ${activityLevel === level.id ? 'text-amber-400' : 'text-gray-400'}`} aria-hidden="true" />
                    <div className="font-semibold mb-1">{level.name}</div>
                    <div className="text-xs text-gray-400">{level.description}</div>
                  </button>
                ))}
              </div>
            </FormSection>

            <FormSection title="What's Your Goal?" description="We'll adjust your calories to help you get there safely">
              <div className="grid md:grid-cols-3 gap-4">
                {goals.map((goalOption) => (
                  <button
                    key={goalOption.id}
                    onClick={() => setGoal(goalOption.id)}
                    aria-pressed={goal === goalOption.id}
                    className={`p-6 rounded-xl border-2 text-center transition-all ${
                      goal === goalOption.id
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <goalOption.icon className={`w-8 h-8 mx-auto mb-3 ${goal === goalOption.id ? 'text-amber-400' : 'text-gray-400'}`} aria-hidden="true" />
                    <div className="font-semibold mb-1">{goalOption.name}</div>
                    <div className="text-xs text-gray-400">{goalOption.description}</div>
                  </button>
                ))}
              </div>
            </FormSection>

            <div className="text-center">
              <button
                onClick={calculateMacros}
                className="px-10 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-lg font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition-all inline-flex items-center space-x-2"
              >
                <CalcIcon className="w-5 h-5" aria-hidden="true" />
                <span>See My Results</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-amber-500/20 to-yellow-600/20 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Perfect! Here's Your Plan</h2>
              <p className="text-gray-400 mb-8">Based on your {goal} goal and {activityLevel} activity level</p>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-black/30 rounded-xl p-6">
                  <Target className="w-10 h-10 text-amber-400 mx-auto mb-3" aria-hidden="true" />
                  <div className="text-5xl font-bold text-amber-400 mb-2">{results.calories}</div>
                  <div className="text-gray-300 font-medium">Daily Calories</div>
                  <div className="text-sm text-gray-400 mt-2">
                    {goal === 'lose' && 'Perfect deficit for healthy fat loss'}
                    {goal === 'maintain' && 'Maintain your current weight easily'}
                    {goal === 'gain' && 'Optimal surplus for muscle growth'}
                  </div>
                </div>

                <div className="bg-black/30 rounded-xl p-6">
                  <Activity className="w-10 h-10 text-amber-400 mx-auto mb-3" aria-hidden="true" />
                  <div className="text-5xl font-bold text-amber-400 mb-2">{results.protein}g</div>
                  <div className="text-gray-300 font-medium">Daily Protein</div>
                  <div className="text-sm text-gray-400 mt-2">
                    Optimized for muscle maintenance and faster recovery
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleProceed}
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition-all inline-flex items-center justify-center space-x-2"
                >
                  <span>Build Your First Meal</span>
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </button>
                <button
                  onClick={() => setCalculated(false)}
                  className="px-8 py-4 bg-white/10 border border-white/20 font-semibold rounded-lg hover:bg-white/20 transition-all"
                >
                  Try Different Numbers
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
