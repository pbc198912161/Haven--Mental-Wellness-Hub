import React, { useState, useEffect } from 'react';
import { Home, Wind, BookOpen, BarChart3, LifeBuoy } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('today');

  const navItems = [
    { id: 'today', label: 'Today', icon: Home },
    { id: 'breathe', label: 'Breathe', icon: Wind },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
    { id: 'support', label: 'Support', icon: LifeBuoy },
  ];

  const scrollTo = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            setActiveTab(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-3 inset-x-3 z-40 max-w-md mx-auto"
    >
      <div className="flex items-center justify-around py-2 px-2 bg-mist/90 dark:bg-deep-tide/95 backdrop-blur-lg border border-border/80 rounded-full shadow-xl shadow-tide/10">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`flex flex-col items-center justify-center min-w-[54px] min-h-[48px] px-2 rounded-full transition-all ${
                isActive
                  ? 'text-tide dark:text-white font-semibold'
                  : 'text-tide-muted dark:text-gray-400 hover:text-tide'
              }`}
            >
              <div
                className={`p-1 rounded-full transition-colors ${
                  isActive ? 'bg-seafoam/30 dark:bg-seafoam/20' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] leading-tight tracking-tight mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
