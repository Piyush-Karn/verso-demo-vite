import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Static grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      {/* Subtle radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)]" />

      {/* Gradient orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none"
        style={{ 
          background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)',
          opacity: 0.12,
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none"
        style={{ 
          background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)',
          opacity: 0.12,
        }}
      />

      {/* Header */}
      <motion.div 
        className="relative z-10 p-4 md:p-6 border-b border-white/10 backdrop-blur-sm bg-black/50"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
          <motion.button 
            onClick={() => navigate(-1)} 
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft size={24} />
          </motion.button>
          
          <div className="flex-1">
            <motion.h1 
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Authentication
            </motion.h1>
            <motion.p 
              className="text-sm md:text-base text-gray-400 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Sign in to access your account
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8">
        <motion.div 
          className="max-w-2xl mx-auto text-center py-20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.div 
            className="inline-flex p-6 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Lock className="w-16 h-16 text-indigo-400" />
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Coming Soon
          </h2>
          <p className="text-gray-400 text-lg">
            We're setting up secure authentication for you. Stay tuned!
          </p>
        </motion.div>
      </div>
    </div>
  );
};
