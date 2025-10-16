import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, Users, MapPin, Plane, Clock, ArrowRight } from 'lucide-react';

export const QuestionnairePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedCountry = searchParams.get('country');

  const [formData, setFormData] = useState({
    destination: preSelectedCountry || '',
    startDate: '',
    endDate: '',
    travelers: '2',
    homeLocation: '',
    tripDuration: '7'
  });

  const countries = ['Japan', 'Bali', 'Goa', 'Thailand', 'Italy', 'France'];
  const travelerOptions = ['1', '2', '3', '4', '5+'];
  const durationOptions = ['3', '5', '7', '10', '14', '21'];

  const steps = useMemo(() => {
    const base: Array<{ id: string; title: string; subtitle: string; icon: React.ReactNode }> = [
      { id: 'destination', title: 'Where would you like to go?', subtitle: 'Select your dream destination', icon: <Plane className="w-6 h-6 text-indigo-400" /> },
      { id: 'dates',       title: 'When are you traveling?',       subtitle: 'Choose your travel dates',       icon: <Calendar className="w-6 h-6 text-purple-400" /> },
      { id: 'duration',    title: 'How long is your trip?',         subtitle: 'Select the duration of your stay', icon: <Clock className="w-6 h-6 text-cyan-400" /> },
      { id: 'travelers',   title: "Who's coming along?",            subtitle: 'Number of travelers',            icon: <Users className="w-6 h-6 text-pink-400" /> },
      { id: 'home',        title: 'Where are you traveling from?',  subtitle: 'Your departure city (optional)', icon: <MapPin className="w-6 h-6 text-emerald-400" /> },
    ];
    return preSelectedCountry ? base.filter(s => s.id !== 'destination') : base;
  }, [preSelectedCountry]);

  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => setStepIndex(0), [steps.length]);

  const go = useCallback((delta: number) => {
    setDirection(delta);
    setStepIndex(i => Math.min(Math.max(i + delta, 0), steps.length - 1));
  }, [steps.length]);

  const canProceed = useMemo(() => {
    const id = steps[stepIndex]?.id;
    if (!id) return false;
    if (id === 'destination') return !!formData.destination;
    if (id === 'dates') {
      if (!formData.startDate || !formData.endDate) return false;
      try {
        const s = new Date(formData.startDate).getTime();
        const e = new Date(formData.endDate).getTime();
        return !Number.isNaN(s) && !Number.isNaN(e) && e >= s;
      } catch { return false; }
    }
    if (id === 'duration') return !!formData.tripDuration;
    if (id === 'travelers') return !!formData.travelers;
    if (id === 'home') return true; // Optional field
    return false;
  }, [formData, stepIndex, steps]);

  const isLast = stepIndex === steps.length - 1;

  const handleNext = () => {
    if (!canProceed) return;
    if (isLast) handleSubmit();
    else go(1);
  };

  const handlePrev = () => {
    if (stepIndex === 0) navigate(-1);
    else go(-1);
  };

  const handleSubmit = () => {
    if ((formData.destination || preSelectedCountry) && formData.startDate && formData.endDate) {
      const params = new URLSearchParams({
        country: formData.destination || preSelectedCountry || '',
        startDate: formData.startDate,
        endDate: formData.endDate,
        travelers: formData.travelers,
        homeLocation: formData.homeLocation || 'Not specified',
        duration: formData.tripDuration
      });
      navigate(`/trip/itinerary?${params.toString()}`);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNext();
    }
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.9 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.9 }),
  };

  const currentStep = steps[stepIndex];

  // --- STYLING TOKENS ---
  const card =
    "relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md " +
    "rounded-3xl border border-white/10 p-6 md:p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)]";

  const listChoice =
    "w-full p-5 rounded-2xl border-2 transition-all text-left bg-white/5 border-white/10 " +
    "hover:border-white/20 hover:bg-white/10";
    
  const gridChoice =
    "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all bg-white/5 border-white/10 " +
    "hover:border-white/20 hover:bg-white/10";

  const choiceActive = "border-white bg-white/10 shadow-lg";

  const shellRow =
    "flex items-center gap-3 bg-white/5 border-2 border-white/10 rounded-2xl px-5 py-4 " +
    "text-white focus-within:border-white/30 transition-colors";

  const fieldLabel = "block text-[11px] uppercase tracking-wide text-gray-400 mb-1";

  const StepContent = () => {
    const id = currentStep?.id;

    if (id === 'destination') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {countries.map((country) => (
            <motion.button
              key={country}
              onClick={() => setFormData({ ...formData, destination: country })}
              className={`${listChoice} ${formData.destination === country ? choiceActive : ''}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-lg font-medium">{country}</span>
            </motion.button>
          ))}
        </div>
      );
    }

    if (id === 'dates') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={shellRow}>
            <Calendar className="w-5 h-5 text-purple-300" />
            <div className="flex-1">
              <label className={fieldLabel}>Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                onKeyDown={onKeyDown}
                className="w-full bg-transparent text-lg focus:outline-none"
                required
              />
            </div>
          </div>
          <div className={shellRow}>
            <Calendar className="w-5 h-5 text-purple-300" />
            <div className="flex-1">
              <label className={fieldLabel}>End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                onKeyDown={onKeyDown}
                className="w-full bg-transparent text-lg focus:outline-none"
                required
              />
            </div>
          </div>
        </div>
      );
    }

    if (id === 'duration') {
      return (
        <div className="grid grid-cols-3 gap-3">
          {durationOptions.map((duration) => (
            <motion.button
              key={duration}
              onClick={() => setFormData({ ...formData, tripDuration: duration })}
              className={`${gridChoice} ${formData.tripDuration === duration ? choiceActive : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl font-bold">{duration}</span>
              <span className="text-sm text-gray-400 mt-1">{duration === '1' ? 'day' : 'days'}</span>
            </motion.button>
          ))}
        </div>
      );
    }

    if (id === 'travelers') {
      return (
        <div className="grid grid-cols-3 gap-3">
          {travelerOptions.map((count) => (
            <motion.button
              key={count}
              onClick={() => setFormData({ ...formData, travelers: count })}
              className={`${gridChoice} ${formData.travelers === count ? choiceActive : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl font-bold">{count}</span>
              <span className="text-sm text-gray-400 mt-1">{count === '1' ? 'person' : 'people'}</span>
            </motion.button>
          ))}
        </div>
      );
    }

    if (id === 'home') {
      return (
        <div className={shellRow + " items-start md:items-center"}>
          <MapPin className="w-5 h-5 text-emerald-300 mt-1 md:mt-0" />
          <div className="flex-1">
            <label className={fieldLabel}>Departure City</label>
            <input
              autoFocus
              type="text"
              value={formData.homeLocation}
              onChange={(e) => setFormData({ ...formData, homeLocation: e.target.value })}
              onKeyDown={onKeyDown}
              placeholder="e.g., New York, London, Tokyo..."
              className="w-full bg-transparent text-lg focus:outline-none placeholder-gray-500"
            />
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    // CHANGED: Replaced min-h-screen with h-screen to fix page-level scrolling.
    <div className="relative h-screen bg-black text-white overflow-hidden grid grid-rows-[auto_1fr_auto]">
      {/* Hide scrollbars utility (keeps scrolling) */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Background (site theme) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)]" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none" style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', opacity: 0.12 }} />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none" style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)', opacity: 0.12 }} />

      {/* Header (Top Row) */}
      <motion.div
        className="relative z-10 p-4 md:p-6 flex items-center justify-between"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.button
          onClick={handlePrev}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
        >
          <ArrowLeft size={24} />
        </motion.button>
        <div className="w-10" />
      </motion.div>

      {/* Main content (Middle, Scrollable Row) */}
      <div className="relative z-10 overflow-y-auto no-scrollbar flex items-center justify-center px-4 md:px-6 py-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentStep?.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Question header */}
              <div className="text-center mb-8 md:mb-12">
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 mb-6"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                >
                  {currentStep?.icon}
                </motion.div>

                <motion.h1
                  // CHANGED: Added pb-2 to prevent text descenders (like 'y' and 'g') from being cut off.
                  className="text-3xl md:text-5xl font-bold mb-3 pb-2 bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                >
                  {currentStep?.title}
                </motion.h1>

                <motion.p
                  className="text-gray-400 text-lg md:text-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {currentStep?.subtitle}
                </motion.p>
              </div>

              {/* Answer options */}
              <motion.div
                className={card}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                <StepContent />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom navigation (Bottom Row) */}
      <div className="relative z-10 p-4 md:p-6 pb-safe">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-4 w-full">
            <div className="flex items-center gap-2">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300
                    ${i === stepIndex ? 'w-8 bg-white' : i < stepIndex ? 'w-2 bg-white/50' : 'w-2 bg-white/20'}`}
                />
              ))}
            </div>

          <div className="flex items-center gap-3 w-full">
            <motion.button
              onClick={handlePrev}
              className="px-6 py-3 bg-white/10 text-white/90 border border-white/15 rounded-full font-medium backdrop-blur-md hover:bg-white/15 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Back
            </motion.button>

            <motion.button
              onClick={handleNext}
              disabled={!canProceed}
              className={`flex-1 rounded-full py-3 px-6 font-bold transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden
                ${canProceed
                  ? 'bg-white text-black hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]'
                  : 'bg-white/10 text-gray-500 border border-white/10 cursor-not-allowed'}`}
              whileHover={canProceed ? { scale: 1.02 } : {}}
              whileTap={canProceed ? { scale: 0.98 } : {}}
            >
              <span className="relative z-10">{isLast ? 'Generate Itinerary' : 'Continue'}</span>
              <ArrowRight className="relative z-10 w-5 h-5" />
              {canProceed && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  initial={{ x: '-120%' }}
                  whileHover={{ x: '180%' }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
