import { Target, Heart, Sparkles, ChefHat } from 'lucide-react';
import { useEffect } from 'react';

interface AboutProps {
  onNavigate: (page: string) => void;
}

export function About({ onNavigate }: AboutProps) {
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  const values = [
    {
      icon: Target,
      title: 'Performance First',
      description: 'Every meal is designed to fuel your training and recovery, not just fill your stomach.',
    },
    {
      icon: Heart,
      title: 'Fresh Always',
      description: 'We source ingredients daily at market rates. Never frozen, never compromised.',
    },
    {
      icon: Sparkles,
      title: 'AI-Powered',
      description: 'Smart technology meets culinary expertise to personalize every bite.',
    },
    {
      icon: ChefHat,
      title: 'Chef Crafted',
      description: 'Professional chefs who understand both nutrition and taste.',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600">House of Macros</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Making healthy eating personal, simple, and performance-driven
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Our Story</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              House of Macros was born out of the frustration of bland, cookie-cutter meal prep services that treated all athletes the same. As dedicated fitness enthusiasts ourselves, we knew there had to be a better way.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Whether you're crushing it in the gym, logging marathon miles, or training for MMA, your nutrition should be as unique as your goals. That's why we created a platform that puts you in control, combining AI-powered personalization with chef-level quality.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              We believe food should perform as hard as you do. No compromises on taste. No mysterious ingredients. Just fresh, macro-balanced meals built for your body and your goals.
            </p>
          </div>

          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-amber-900/30 to-zinc-900 rounded-2xl border border-white/10 flex items-center justify-center">
              <ChefHat className="w-32 h-32 text-amber-500/30" />
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent rounded-2xl" />
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-xl p-6 hover:border-amber-500/50 transition-all text-center"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-black" />
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-xl p-8 lg:p-12 mb-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">The Team Behind Your Meals</h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              House of Macros brings together professional chefs with decades of culinary experience, certified nutritionists who understand sports performance, and developers who've built AI systems to make personalization seamless.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              But more importantly, we're athletes just like you. We understand the grind, the discipline, and the frustration of trying to balance nutrition with a busy training schedule. That's why we built this - not just as a business, but as the solution we wished existed.
            </p>
          </div>
        </div>

        <div className="text-center bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-xl p-12">
          <h2 className="text-4xl font-bold mb-6">
            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600">Performance</span> Revolution
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Stop settling for one-size-fits-all meal prep. Start building meals that work as hard as you do.
          </p>
          <button
            onClick={() => onNavigate('builder')}
            className="px-10 py-5 bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-lg font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition-all"
          >
            Start Building Your Meal
          </button>
        </div>
      </div>
    </div>
  );
}
