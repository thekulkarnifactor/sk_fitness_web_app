import { useState, useEffect } from 'react';
import { Plus, TrendingUp, Flame, Beef, Wheat, Droplet, ArrowRight } from 'lucide-react';
import { supabase, Cuisine, Ingredient } from '../lib/supabase';
import { AccessibleStepper } from '../components/AccessibleStepper';
import { LiveRegion } from '../components/LiveRegion';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { AccessibleQuantityControl } from '../components/AccessibleQuantityControl';
import { SmartRange } from '../components/SmartRange';
import { FormSection } from '../components/FormSection';

interface MealBuilderProps {
  onNavigate: (page: string) => void;
  targetCalories?: number;
  targetProtein?: number;
}

interface SelectedIngredient {
  ingredient: Ingredient;
  quantity: number;
}

interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  cost: number;
}

const FITNESS_GOALS = [
  { id: 'gym', name: 'Gym', icon: TrendingUp },
  { id: 'running', name: 'Running', icon: TrendingUp },
  { id: 'ultra', name: 'Ultra Marathon', icon: TrendingUp },
  { id: 'swimming', name: 'Swimming', icon: TrendingUp },
  { id: 'mma', name: 'MMA', icon: TrendingUp },
  { id: 'sports', name: 'Sports', icon: TrendingUp },
];

const MEAL_TIERS = [
  { id: 'basic', name: 'Basic', markup: 60, description: 'Essential ingredients with clean preparation' },
  { id: 'good', name: 'Good', markup: 90, description: 'Quality ingredients with enhanced flavors' },
  { id: 'gourmet', name: 'Gourmet', markup: 140, description: 'Premium ingredients with chef-crafted excellence' },
];

export function MealBuilder({ onNavigate, targetCalories: initialCalories = 600, targetProtein: initialProtein = 50 }: MealBuilderProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [targetCalories, setTargetCalories] = useState(initialCalories);
  const [targetProtein, setTargetProtein] = useState(initialProtein);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedTier, setSelectedTier] = useState('good');
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);
  const [macros, setMacros] = useState<Macros>({ calories: 0, protein: 0, carbs: 0, fats: 0, cost: 0 });
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    loadCuisines();
  }, []);

  useEffect(() => {
    if (selectedCuisine) {
      loadIngredients(selectedCuisine);
    }
  }, [selectedCuisine]);

  useEffect(() => {
    calculateMacros();
  }, [selectedIngredients]);

  useEffect(() => {
    if (selectedIngredients.length > 0) {
      const proteinPercent = Math.round((macros.protein / targetProtein) * 100);
      const caloriesPercent = Math.round((macros.calories / targetCalories) * 100);
      setAnnouncement(
        `Macros updated. Protein: ${macros.protein.toFixed(0)}g, ${proteinPercent}% of target. ` +
        `Calories: ${macros.calories.toFixed(0)}, ${caloriesPercent}% of target.`
      );
    }
  }, [macros, targetProtein, targetCalories]);

  const loadCuisines = async () => {
    const { data } = await supabase.from('cuisines').select('*');
    if (data) setCuisines(data);
  };

  const loadIngredients = async (cuisineId: string) => {
    const { data } = await supabase
      .from('ingredients')
      .select('*')
      .eq('cuisine_id', cuisineId);
    if (data) setIngredients(data);
  };

  const calculateMacros = () => {
    const totals = selectedIngredients.reduce(
      (acc, item) => {
        const multiplier = item.quantity / 100;
        return {
          calories: acc.calories + item.ingredient.calories_per_100g * multiplier,
          protein: acc.protein + item.ingredient.protein_per_100g * multiplier,
          carbs: acc.carbs + item.ingredient.carbs_per_100g * multiplier,
          fats: acc.fats + item.ingredient.fats_per_100g * multiplier,
          cost: acc.cost + item.ingredient.cost_per_100g * multiplier,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0, cost: 0 }
    );
    setMacros(totals);
  };

  const addIngredient = (ingredient: Ingredient) => {
    const existing = selectedIngredients.find((item) => item.ingredient.id === ingredient.id);
    if (existing) {
      setSelectedIngredients(
        selectedIngredients.map((item) =>
          item.ingredient.id === ingredient.id
            ? { ...item, quantity: item.quantity + 50 }
            : item
        )
      );
    } else {
      setSelectedIngredients([...selectedIngredients, { ingredient, quantity: 100 }]);
    }
  };

  const updateQuantity = (ingredientId: string, delta: number) => {
    setSelectedIngredients(
      selectedIngredients.map((item) =>
        item.ingredient.id === ingredientId
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      ).filter((item) => item.quantity > 0)
    );
  };

  const getAISuggestions = () => {
    const proteinNeeded = targetProtein - macros.protein;
    const caloriesNeeded = targetCalories - macros.calories;

    const suggestions = [];

    if (proteinNeeded > 10) {
      const proteinIngredients = ingredients
        .filter((i) => i.category === 'protein' && !selectedIngredients.some((s) => s.ingredient.id === i.id))
        .sort((a, b) => b.protein_per_100g - a.protein_per_100g);

      if (proteinIngredients.length > 0) {
        const amount = Math.ceil((proteinNeeded / proteinIngredients[0].protein_per_100g) * 100);
        suggestions.push({
          text: `Add ${amount}g ${proteinIngredients[0].name} for ${proteinNeeded.toFixed(0)}g more protein`,
          ingredient: proteinIngredients[0],
        });
      }
    }

    if (caloriesNeeded > 50 && macros.protein >= targetProtein * 0.8) {
      const carbIngredients = ingredients
        .filter((i) => i.category === 'carb' && !selectedIngredients.some((s) => s.ingredient.id === i.id))
        .sort((a, b) => b.carbs_per_100g - a.carbs_per_100g);

      if (carbIngredients.length > 0) {
        suggestions.push({
          text: `Add ${carbIngredients[0].name} for balanced energy`,
          ingredient: carbIngredients[0],
        });
      }
    }

    return suggestions;
  };

  const tierMarkup = MEAL_TIERS.find((t) => t.id === selectedTier)?.markup || 90;
  const totalPrice = macros.cost + tierMarkup;

  const progressProtein = Math.min((macros.protein / targetProtein) * 100, 100);
  const progressCalories = Math.min((macros.calories / targetCalories) * 100, 100);

  const stepInfo = [
    { id: 1, title: 'Choose Goal', description: 'Select your fitness objective' },
    { id: 2, title: 'Set Targets', description: 'Define your macro goals' },
    { id: 3, title: 'Build Meal', description: 'Select ingredients and cuisine' },
    { id: 4, title: 'Choose Plan', description: 'Select tier and view summary' }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12">
      <LiveRegion message={announcement} priority="polite" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600">Perfect Meal</span>
          </h1>
          {/* <p className="text-xl text-gray-400">AI-powered personalization for peak performance</p> */}
        </div>

        <div className="mb-12">
          <AccessibleStepper
            steps={stepInfo}
            currentStep={step}
            onStepClick={(newStep) => setStep(newStep)}
            allowStepNavigation={true}
          />
        </div>

        {step === 1 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Choose Your Fitness Goal</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {FITNESS_GOALS.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal.id)}
                  aria-pressed={selectedGoal === goal.id}
                  aria-label={`Select ${goal.name} as your fitness goal`}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    selectedGoal === goal.id
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <goal.icon className="w-8 h-8 mb-3 mx-auto text-amber-400" aria-hidden="true" />
                  <div className="font-semibold">{goal.name}</div>
                </button>
              ))}
            </div>
            <div className="text-center mt-8">
              <button
                onClick={() => setStep(2)}
                disabled={!selectedGoal}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-amber-500/50 transition-all inline-flex items-center space-x-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Set Your Targets</h2>
            <FormSection title="Macro Targets" description="Customize based on your calculator results or preferences">
              <div className="space-y-6">
                <SmartRange
                  id="target-calories"
                  label="Target Calories per Meal"
                  value={targetCalories}
                  onChange={setTargetCalories}
                  min={300}
                  max={1200}
                  step={50}
                  unit="kcal"
                  suggestions={[
                    { label: 'Light', value: 400 },
                    { label: 'Standard', value: 600 },
                    { label: 'Heavy', value: 800 },
                  ]}
                  helperText="Typical meals range from 400-800 calories"
                />
                <SmartRange
                  id="target-protein"
                  label="Target Protein per Meal"
                  value={targetProtein}
                  onChange={setTargetProtein}
                  min={20}
                  max={100}
                  step={5}
                  unit="g"
                  suggestions={[
                    { label: 'Low', value: 30 },
                    { label: 'Moderate', value: 50 },
                    { label: 'High', value: 70 },
                  ]}
                  helperText="Higher protein supports muscle recovery"
                />
              </div>
            </FormSection>
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition-all inline-flex items-center justify-center space-x-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Pick Your Cuisine & Build</h2>

            <div className="grid md:grid-cols-4 gap-4 mb-8">
              {cuisines.map((cuisine) => (
                <button
                  key={cuisine.id}
                  onClick={() => setSelectedCuisine(cuisine.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedCuisine === cuisine.id
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="font-semibold">{cuisine.name}</div>
                </button>
              ))}
            </div>

            {selectedCuisine && (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">AI Suggestions</h3>
                    <div className="space-y-3">
                      {getAISuggestions().map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => addIngredient(suggestion.ingredient)}
                          className="w-full p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-left hover:bg-amber-500/20 transition-all flex items-center justify-between"
                        >
                          <span className="text-amber-300">{suggestion.text}</span>
                          <Plus className="w-5 h-5 text-amber-400" />
                        </button>
                      ))}
                      {getAISuggestions().length === 0 && (
                        <div className="text-center py-4 text-gray-400">
                          You're on track! Add more ingredients below or proceed to checkout.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Available Ingredients</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {ingredients.map((ingredient) => {
                        // Check if ingredient is already selected
                        const selected = selectedIngredients.find(
                          (item) => item.ingredient.id === ingredient.id
                        );

                        return (
                          <div
                            key={ingredient.id}
                            className={`p-4 rounded-lg border transition-all ${
                              selected
                                ? 'bg-amber-500/10 border-amber-500/30'
                                : 'bg-white/5 border-white/10'
                            }`}
                          >
                            {selected ? (
                              // Show quantity control if already selected
                              <AccessibleQuantityControl
                                label={ingredient.name}
                                value={selected.quantity}
                                onChange={(newQty) => {
                                  setSelectedIngredients(
                                    selectedIngredients
                                      .map((i) =>
                                        i.ingredient.id === ingredient.id
                                          ? { ...i, quantity: newQty }
                                          : i
                                      )
                                      .filter((i) => i.quantity > 0)
                                  );
                                }}
                                min={0}
                                max={500}
                                step={25}
                                unit="g"
                                id={`qty-avail-${ingredient.id}`}
                              />
                            ) : (
                              // Show add button if not selected
                              <button
                                onClick={() => addIngredient(ingredient)}
                                className="w-full text-left hover:bg-white/5 transition-all rounded-lg p-2"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="font-medium mb-1">{ingredient.name}</div>
                                    <div className="text-xs text-gray-400">
                                      {ingredient.protein_per_100g}g protein • {ingredient.calories_per_100g} kcal
                                    </div>
                                  </div>
                                  <Plus className="w-5 h-5 text-amber-400 flex-shrink-0 ml-2" />
                                </div>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* {selectedIngredients.length > 0 && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                      <h3 className="text-xl font-bold mb-4">Your Ingredients</h3>
                      <div className="space-y-3">
                        {selectedIngredients.map((item) => (
                          <div
                            key={item.ingredient.id}
                            className="p-3 bg-white/5 rounded-lg"
                          >
                            <AccessibleQuantityControl
                              label={item.ingredient.name}
                              value={item.quantity}
                              onChange={(newQty) => {
                                setSelectedIngredients(
                                  selectedIngredients.map((i) =>
                                    i.ingredient.id === item.ingredient.id
                                      ? { ...i, quantity: newQty }
                                      : i
                                  ).filter((i) => i.quantity > 0)
                                );
                              }}
                              min={0}
                              max={500}
                              step={25}
                              unit="g"
                              id={`qty-${item.ingredient.id}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )} */}
                </div>

                <div className="lg:col-span-1">
                  <div className="sticky top-24 bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-xl p-6 space-y-6">
                    <h3 className="text-xl font-bold">Current Macros</h3>

                    <ProgressIndicator
                      label="Calories"
                      current={macros.calories}
                      target={targetCalories}
                      icon={Flame}
                      color="text-orange-400"
                      unit="kcal"
                      announceChanges={true}
                    />

                    <ProgressIndicator
                      label="Protein"
                      current={macros.protein}
                      target={targetProtein}
                      icon={Beef}
                      color="text-red-400"
                      unit="g"
                      announceChanges={true}
                    />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Wheat className="w-5 h-5 text-amber-400" />
                        <span className="font-medium">Carbs</span>
                      </div>
                      <span className="text-lg font-bold">{macros.carbs.toFixed(1)}g</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Droplet className="w-5 h-5 text-blue-400" />
                        <span className="font-medium">Fats</span>
                      </div>
                      <span className="text-lg font-bold">{macros.fats.toFixed(1)}g</span>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between text-lg">
                        <span className="font-medium">Ingredient Cost</span>
                        <span className="font-bold">₹{macros.cost.toFixed(0)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setStep(4)}
                      disabled={selectedIngredients.length === 0}
                      className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-amber-500/50 transition-all inline-flex items-center justify-center space-x-2"
                    >
                      <span>Choose Plan</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep(2)}
                className="px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Choose Your Tier & Plan</h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {MEAL_TIERS.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    selectedTier === tier.id
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="text-2xl font-bold mb-2">{tier.name}</div>
                  <div className="text-amber-400 text-xl font-bold mb-3">+₹{tier.markup}</div>
                  <div className="text-sm text-gray-400">{tier.description}</div>
                </button>
              ))}
            </div>

            <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6">Order Summary</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Ingredients Cost</span>
                  <span className="font-bold">₹{macros.cost.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tier Markup ({MEAL_TIERS.find(t => t.id === selectedTier)?.name})</span>
                  <span className="font-bold">₹{tierMarkup}</span>
                </div>
                <div className="pt-3 border-t border-white/10 flex justify-between text-xl">
                  <span className="font-bold">Total per Meal</span>
                  <span className="font-bold text-amber-400">₹{totalPrice.toFixed(0)}</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-amber-400">{macros.calories.toFixed(0)}</div>
                    <div className="text-xs text-gray-400">Calories</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-amber-400">{macros.protein.toFixed(0)}g</div>
                    <div className="text-xs text-gray-400">Protein</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-amber-400">{macros.carbs.toFixed(0)}g</div>
                    <div className="text-xs text-gray-400">Carbs</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-amber-400">{macros.fats.toFixed(0)}g</div>
                    <div className="text-xs text-gray-400">Fats</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('plans')}
                className="w-full px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-lg font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition-all inline-flex items-center justify-center space-x-2"
              >
                <span>View Subscription Plans</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep(3)}
                className="flex-1 px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
              >
                Back to Builder
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
