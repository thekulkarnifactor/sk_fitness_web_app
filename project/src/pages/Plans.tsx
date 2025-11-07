import { useEffect } from 'react';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

interface PlansProps {
  onNavigate: (page: string) => void;
}

const PLANS = [
  {
    id: '3-day',
    name: '3-Day Lock-In',
    duration: '3 Days',
    price: 'Pay per meal',
    discount: 0,
    features: [
      'Test your ideal macros',
      'Perfect for trying us out',
      'Flexible delivery slots',
      'Cancel anytime',
      'Full macro tracking',
    ],
    recommended: false,
  },
  {
    id: 'weekly',
    name: 'Weekly Plan',
    duration: '7 Days',
    price: 'Save 5%',
    discount: 5,
    features: [
      'Stay consistent with weekly prep',
      'Locked-in pricing for the week',
      'Priority delivery slots',
      'Free consultation with nutritionist',
      'Meal plan adjustments',
      'Recipe variations',
    ],
    recommended: true,
  },
  {
    id: 'monthly',
    name: 'Monthly Plan',
    duration: '30 Days',
    price: 'Save 15%',
    discount: 15,
    features: [
      'Maximum savings on recurring meals',
      'Dedicated chef relationship',
      'Priority support',
      'Free monthly nutrition review',
      'Unlimited meal adjustments',
      'Exclusive seasonal dishes',
      'Free delivery',
    ],
    recommended: false,
  },
];

export function Plans({ onNavigate }: PlansProps) {
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600">Plan</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Flexible subscription options to match your fitness journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-gradient-to-b from-white/5 to-transparent rounded-xl overflow-hidden ${
                plan.recommended
                  ? 'border-2 border-amber-500 shadow-lg shadow-amber-500/20'
                  : 'border border-white/10'
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-center py-2 text-sm font-bold flex items-center justify-center space-x-1">
                  <Sparkles className="w-4 h-4" />
                  <span>MOST POPULAR</span>
                </div>
              )}

              <div className={`p-8 ${plan.recommended ? 'pt-16' : ''}`}>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-gray-400 mb-4">{plan.duration}</div>
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600">
                    {plan.price}
                  </div>
                  {plan.discount > 0 && (
                    <div className="mt-2 inline-block px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-300 text-sm font-medium">
                      {plan.discount}% off every meal
                    </div>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onNavigate('Auth')}
                  className={`w-full px-6 py-4 font-semibold rounded-lg transition-all ${
                    plan.recommended
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black hover:shadow-lg hover:shadow-amber-500/50'
                      : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  Select Plan
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-xl p-8 mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">How Pricing Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Ingredient Cost</h3>
              <p className="text-gray-400">
                Fresh ingredients charged at market rate. Typically ₹150-250 per meal based on your selections.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Tier Markup</h3>
              <p className="text-gray-400">
                <strong>Basic:</strong> +₹60<br />
                <strong>Good:</strong> +₹90<br />
                <strong>Gourmet:</strong> +₹140
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Plan Discount</h3>
              <p className="text-gray-400">
                Weekly plans save 5% per meal. Monthly plans save 15% per meal. Lock in your savings!
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <p className="text-center text-amber-300">
              <strong>Example:</strong> A Good tier meal with ₹200 in ingredients = ₹290 base price. With monthly plan = ₹246.50 per meal
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-xl p-8 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Start?</h3>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Build your first meal and choose your plan at checkout
          </p>
          <button
            onClick={() => onNavigate('builder')}
            className="px-10 py-5 bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-lg font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition-all inline-flex items-center space-x-2"
          >
            <span>Build Your Meal Now</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
