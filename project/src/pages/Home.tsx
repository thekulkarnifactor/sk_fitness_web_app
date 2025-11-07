import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Sparkles, Leaf, Target, TrendingUp } from 'lucide-react';
import Swiper from 'swiper';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

interface HomeProps {
  onNavigate: (page: string) => void;
}

// TimelineStep Component for alternating scroll animation
function TimelineStep({ 
  step, 
  index, 
  isEven 
}: { 
  step: { number: string; title: string; description: string }; 
  index: number; 
  isEven: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" }); // Changed once to false

  return (
    <div ref={ref} className="relative">
      {/* Mobile/Tablet View (centered) */}
      <div className="lg:hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-xl p-8 hover:border-amber-500/50 transition-all"
        >
          <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-yellow-600 mb-4">
            {step.number}
          </div>
          <h3 className="text-xl font-bold mb-3">{step.title}</h3>
          <p className="text-gray-400 leading-relaxed">{step.description}</p>
        </motion.div>
      </div>

      {/* Desktop View (alternating) */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16 items-center">
        {/* Left Side */}
        <motion.div
          initial={{ 
            opacity: 0, 
            x: isEven ? -100 : 0,
          }}
          animate={isInView ? { 
            opacity: isEven ? 1 : 0, 
            x: 0 
          } : { 
            opacity: 0, 
            x: isEven ? -100 : 0 
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={isEven ? "" : "invisible"}
        >
          <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-xl p-8 hover:border-amber-500/50 transition-all">
            <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-yellow-600 mb-4">
              {step.number}
            </div>
            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
            <p className="text-gray-400 leading-relaxed">{step.description}</p>
          </div>
        </motion.div>

        {/* Center Dot - Aligned with vertical line */}
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="absolute left-[49.5%] top-8 -translate-x-1/2 w-4 h-4 bg-amber-500 rounded-full ring-8 ring-amber-500/20 z-10"
        />

        {/* Right Side */}
        <motion.div
          initial={{ 
            opacity: 0, 
            x: !isEven ? 100 : 0,
          }}
          animate={isInView ? { 
            opacity: !isEven ? 1 : 0, 
            x: 0 
          } : { 
            opacity: 0, 
            x: !isEven ? 100 : 0 
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={!isEven ? "" : "invisible"}
        >
          <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-xl p-8 hover:border-amber-500/50 transition-all">
            <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-yellow-600 mb-4">
              {step.number}
            </div>
            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
            <p className="text-gray-400 leading-relaxed">{step.description}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


export function Home({ onNavigate }: HomeProps) {
  const swiperRef = useRef<Swiper | null>(null);
  const features = [
  {
    icon: Sparkles,
    title: 'AI-Driven Personalization',
    description: 'Smart ingredient suggestions tailored to your fitness goals and macro targets',
  },
  {
    icon: Leaf,
    title: 'Fresh Ingredients',
    description: 'Market-rate pricing for premium, fresh ingredients. Never frozen, always fresh',
  },
  {
    icon: Target,
    title: 'Built for Your Training',
    description: 'Customized for gym, running, swimming, MMA, or any athletic pursuit',
  },
  {
    icon: TrendingUp,
    title: 'Performance Focused',
    description: 'High-protein meals designed to fuel your performance and recovery',
  },
  ];



  useEffect(() => {
  swiperRef.current = new Swiper('.features-swiper', {
    modules: [EffectCoverflow, Pagination],
    effect: 'coverflow',
    loop: false, // Disable loop
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 1,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      320: { slidesPerView: 1.5 },
      580: { slidesPerView: 2 },
      767: { slidesPerView: 2.5 },
      992: { slidesPerView: 3 },
      1200: { slidesPerView: 3 },
    },
  });

  return () => {
    if (swiperRef.current) {
      swiperRef.current.destroy();
    }
  };
}, []);



  const steps = [
    {
      number: '01',
      title: 'Choose Your Goal',
      description: 'Select your training style: Gym, Running, Ultra Marathon, Swimming, MMA, or Sports',
    },
    {
      number: '02',
      title: 'Pick Your Cuisine',
      description: 'Indian, Chinese, Mexican, or American - your taste, your choice',
    },
    {
      number: '03',
      title: 'Build Your Meal',
      description: 'AI suggests ingredients and calculates macros in real-time',
    },
    {
      number: '04',
      title: 'Choose Your Plan',
      description: '3-day trial, weekly consistency, or monthly savings',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* The best place to get your proteins in */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(90deg, #000000 0%, #000000 45%, transparent 75%), url(https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&cs=tinysrgb&w=1920) right center / cover no-repeat',
          }}
        />

        <div className="absolute inset-0 bg-black/10 z-0" />

        <div
          className="relative z-20 w-full pl-[10vw] pr-8 py-32 animate-fadeIn"
          style={{
            animation: 'fadeIn 1.2s ease-out forwards',
          }}
        >
          <div className="max-w-2xl">
            <h1 className="text-7xl sm:text-8xl lg:text-9xl font-black mb-8 leading-[0.9] tracking-tighter">
              <span className="text-white block opacity-0 animate-slideUp" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                The best
              </span>
              <span className="text-white block opacity-0 animate-slideUp" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                place to
              </span>
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 block opacity-0 animate-slideUp"
                style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
              >
                get your proteins in
              </span>
            </h1>

            <p
              className="text-xl sm:text-2xl text-gray-300 mb-12 leading-relaxed font-light opacity-0 animate-slideUp"
              style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}
            >
              Experience plant-based cuisine elevated to an art form. Fresh, organic ingredients crafted into unforgettable dishes.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-6 opacity-0 animate-slideUp"
              style={{ animationDelay: '1s', animationFillMode: 'forwards' }}
            >
              <button
                onClick={() => onNavigate('auth')}
                className="group px-12 py-6 bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-lg font-bold rounded-lg hover:shadow-2xl hover:shadow-amber-500/50 transition-all flex items-center justify-center space-x-2 hover:scale-105 hover:from-amber-400 hover:to-yellow-500"
              >
                <span>Build your Meal</span>
              </button>

              <button
                onClick={() => onNavigate('signature')}
                className="px-12 py-6 bg-transparent border-2 border-white text-white text-lg font-bold rounded-lg hover:bg-white hover:text-black transition-all hover:scale-105 backdrop-blur-sm"
              >
                Order Online
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Infinite Logo Carousel Section */}
      <section className="py-12 bg-black border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-sm uppercase tracking-widest text-gray-400">
              Trusted by Athletes & Fitness Enthusiasts
            </p>
          </div>

          {/* Infinite Scroll Container */}
          <div className="relative overflow-hidden">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />

            {/* Scrolling Logos */}
            <div className="flex animate-scroll hover:pause">
              {/* Fitness of logos */}
              <div className="flex items-center justify-around min-w-full shrink-0 gap-16">
                {/* MyProtein */}
                <div className="mx-8 flex items-center justify-center h-16 px-8 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-2xl font-bold text-white">MyProtein</span>
                </div>
                
                {/* Optimum Nutrition */}
                <div className="mx-8 flex items-center justify-center h-16 px-8 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-2xl font-bold text-white">Optimum Nutrition</span>
                </div>
                
                {/* MuscleBlaze */}
                <div className="mx-8 flex items-center justify-center h-16 px-8 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-2xl font-bold text-amber-400">MuscleBlaze</span>
                </div>
                
                {/* HealthKart */}
                <div className="mx-8 flex items-center justify-center h-16 px-8 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-2xl font-bold text-green-400">HealthKart</span>
                </div>
                
                {/* GNC */}
                <div className="mx-8 flex items-center justify-center h-16 px-8 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-2xl font-bold text-red-400">GNC</span>
                </div>
                
                {/* Nutrabay */}
                <div className="mx-8 flex items-center justify-center h-16 px-8 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-2xl font-bold text-blue-400">Nutrabay</span>
                </div>
              </div>
              {/* Companies set of logos */}
              <div className="flex items-center justify-around min-w-full shrink-0">
                <div className="mx-8 flex items-center justify-center">
                  <img 
                    src="https://tailwindui.com/plus/img/logos/158x48/transistor-logo-white.svg" 
                    alt="Transistor" 
                    className="h-12 opacity-60 hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="mx-8 flex items-center justify-center">
                  <img 
                    src="https://tailwindui.com/plus/img/logos/158x48/reform-logo-white.svg" 
                    alt="Reform" 
                    className="h-12 opacity-60 hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="mx-8 flex items-center justify-center">
                  <img 
                    src="https://tailwindui.com/plus/img/logos/158x48/tuple-logo-white.svg" 
                    alt="Tuple" 
                    className="h-12 opacity-60 hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="mx-8 flex items-center justify-center">
                  <img 
                    src="https://tailwindui.com/plus/img/logos/158x48/savvycal-logo-white.svg" 
                    alt="SavvyCal" 
                    className="h-12 opacity-60 hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="mx-8 flex items-center justify-center">
                  <img 
                    src="https://tailwindui.com/plus/img/logos/158x48/statamic-logo-white.svg" 
                    alt="Statamic" 
                    className="h-12 opacity-60 hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="mx-8 flex items-center justify-center">
                  <img 
                    src="https://tailwindui.com/plus/img/logos/158x48/laravel-logo-white.svg" 
                    alt="Laravel" 
                    className="h-12 opacity-60 hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>

              {/* Duplicate set for seamless loop */}
              <div className="flex items-center justify-around min-w-full shrink-0" aria-hidden="true">
                <div className="mx-8 flex items-center justify-center">
                  <img 
                    src="https://tailwindui.com/plus/img/logos/158x48/transistor-logo-white.svg" 
                    alt="Transistor" 
                    className="h-12 opacity-60 hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="mx-8 flex items-center justify-center">
                  <img 
                    src="https://tailwindui.com/plus/img/logos/158x48/reform-logo-white.svg" 
                    alt="Reform" 
                    className="h-12 opacity-60 hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="mx-8 flex items-center justify-center">
                  <img 
                    src="https://tailwindui.com/plus/img/logos/158x48/tuple-logo-white.svg" 
                    alt="Tuple" 
                    className="h-12 opacity-60 hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="mx-8 flex items-center justify-center">
                  <img 
                    src="https://tailwindui.com/plus/img/logos/158x48/savvycal-logo-white.svg" 
                    alt="SavvyCal" 
                    className="h-12 opacity-60 hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="mx-8 flex items-center justify-center">
                  <img 
                    src="https://tailwindui.com/plus/img/logos/158x48/statamic-logo-white.svg" 
                    alt="Statamic" 
                    className="h-12 opacity-60 hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="mx-8 flex items-center justify-center">
                  <img 
                    src="https://tailwindui.com/plus/img/logos/158x48/laravel-logo-white.svg" 
                    alt="Laravel" 
                    className="h-12 opacity-60 hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why House of Macros? - 3D Swiper Carousel */}
      <section className="py-24 bg-gradient-to-b from-black to-zinc-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Why House of Macros?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Not just meals. Performance food crafted for athletes.
            </p>
          </div>

          {/* Swiper Container */}
          <div className="features-swiper pt-12 pb-16">
            <div className="swiper-wrapper">
              {features.map((feature, index) => (
                <div key={index} className="swiper-slide">
                  <div className="w-full h-[500px] bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-xl p-8 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-6">
                      <feature.icon className="w-8 h-8 text-black" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed text-lg max-w-md">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="swiper-pagination mt-8"></div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section - Alternating Scroll Animation */}
      <section className="py-24 bg-zinc-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">
              Four simple steps to personalized performance nutrition
            </p>
          </div>

          {/* Timeline Container */}
          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500/50 via-amber-500/30 to-transparent hidden lg:block" />

            {/* Steps */}
            <div className="space-y-24">
              {steps.map((step, index) => {
                const isEven = index % 2 === 0;
                return (
                  <TimelineStep
                    key={index}
                    step={step}
                    index={index}
                    isEven={isEven}
                  />
                );
              })}
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-20">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onClick={() => onNavigate('calculator')}
              className="group px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition-all inline-flex items-center space-x-2"
            >
              <span>Calculate My Macros</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </div>
      </section>
      
      {/* Ready to Transform Your Nutrition? */}
      <section className="py-24 bg-gradient-to-b from-zinc-950 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to Transform Your Nutrition?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join athletes who fuel their performance with personalized, macro-balanced meals
          </p>
          <button
            onClick={() => onNavigate('calculator')}
            className="group px-10 py-5 bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-lg font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition-all inline-flex items-center space-x-2"
          >
            <span>Start Your Meal Plan</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
}
