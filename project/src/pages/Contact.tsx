import { Mail, Phone, MapPin, MessageSquare, Instagram } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SmartInput } from '../components/SmartInput';
import { validators } from '../utils/validators';

interface ContactProps {
  onNavigate: (page: string) => void;
}

export function Contact({ onNavigate }: ContactProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 3000);
  };

  const contactMethods = [
    {
      icon: Phone,
      title: 'Phone',
      value: '+91 98765 43210',
      link: 'tel:+919876543210',
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'hello@houseofmacros.com',
      link: 'mailto:hello@houseofmacros.com',
    },
    {
      icon: MessageSquare,
      title: 'WhatsApp',
      value: 'Chat with us',
      link: 'https://wa.me/919876543210',
    },
    {
      icon: Instagram,
      title: 'Instagram',
      value: '@houseofmacros',
      link: 'https://instagram.com/houseofmacros',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600">Touch</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Questions about your macros? Want to discuss custom meal plans? We're here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Reach out through any channel that works best for you. Our team responds within 24 hours.
              </p>

              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <a
                    key={index}
                    href={method.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-4 p-4 bg-white/5 border border-white/10 rounded-lg hover:border-amber-500/50 hover:bg-white/10 transition-all group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <method.icon className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">{method.title}</div>
                      <div className="font-semibold">{method.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="font-bold mb-2">Our Kitchen</h3>
                  <p className="text-gray-400">
                    House of Macros<br />
                    Koregaon Park<br />
                    Pune, Maharashtra 411001<br />
                    India
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
              <h3 className="font-bold mb-2 text-amber-300">Operating Hours</h3>
              <div className="text-gray-300 space-y-1">
                <p>Monday - Saturday: 6:00 AM - 10:00 PM</p>
                <p>Sunday: 7:00 AM - 8:00 PM</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-gray-400">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <SmartInput
                  id="name"
                  label="Name"
                  value={formData.name}
                  onChange={(value) => setFormData({ ...formData, name: value })}
                  type="text"
                  placeholder="Your name"
                  required
                  validate={validators.name}
                />

                <SmartInput
                  id="email"
                  label="Email"
                  value={formData.email}
                  onChange={(value) => setFormData({ ...formData, email: value })}
                  type="email"
                  placeholder="your@email.com"
                  required
                  validate={validators.email}
                  helperText="We'll respond within 24 hours"
                />

                <SmartInput
                  id="phone"
                  label="Phone"
                  value={formData.phone}
                  onChange={(value) => setFormData({ ...formData, phone: value })}
                  type="tel"
                  placeholder="+91 98765 43210"
                  validate={(value) => value ? validators.phone(value) : null}
                  helperText="Optional - for faster response"
                />

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                    placeholder="Tell us about your fitness goals and how we can help..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition-all"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="text-center bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Don't wait to transform your nutrition. Build your first meal now.
          </p>
          <button
            onClick={() => onNavigate('builder')}
            className="px-10 py-5 bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-lg font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition-all"
          >
            Build Your Meal
          </button>
        </div>
      </div>
    </div>
  );
}
