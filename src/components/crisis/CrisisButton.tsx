import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Phone, MessageSquare, Heart } from 'lucide-react';
import { logger } from '../../utils/logger';

interface CrisisButtonProps {
  onCrisisDetected?: () => void;
  className?: string;
}

export function CrisisButton({ onCrisisDetected, className = '' }: CrisisButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleCrisisClick = () => {
    logger.crisis('Crisis button activated by user', 'high', 'CrisisButton');
    setIsPressed(true);
    setIsExpanded(true);
    onCrisisDetected?.();
    
    // Reset pressed state after animation
    setTimeout(() => setIsPressed(false), 200);
  };

  const crisisOptions = [
    {
      id: 'hotline',
      label: 'Call 988',
      sublabel: 'Crisis Hotline',
      icon: <Phone className="h-5 w-5" />,
      action: () => window.location.href = 'tel:988',
      color: 'bg-red-500 hover:bg-red-600',
      urgent: true,
    },
    {
      id: 'text',
      label: 'Text HOME',
      sublabel: 'to 741741',
      icon: <MessageSquare className="h-5 w-5" />,
      action: () => window.location.href = 'sms:741741?body=HOME',
      color: 'bg-orange-500 hover:bg-orange-600',
      urgent: true,
    },
    {
      id: 'breathing',
      label: 'Breathing',
      sublabel: 'Calm down',
      icon: <Heart className="h-5 w-5" />,
      action: () => logger.info('Breathing exercise started', 'CrisisButton'),
      color: 'bg-blue-500 hover:bg-blue-600',
    },
  ];

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {/* Expanded Options */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-16 right-0 bg-white rounded-xl shadow-2xl p-4 mb-2 w-64"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">Crisis Support</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close crisis support menu"
            >
              ×
            </button>
          </div>

          <div className="space-y-2">
            {crisisOptions.map((option) => (
              <button
                key={option.id}
                onClick={option.action}
                className={`w-full p-3 rounded-lg text-white transition-all transform hover:scale-105 ${option.color} ${
                  option.urgent ? 'animate-pulse' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  {option.icon}
                  <div className="text-left">
                    <div className="font-semibold">{option.label}</div>
                    {option.sublabel && (
                      <div className="text-xs opacity-90">{option.sublabel}</div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600 text-center">
              You&apos;re not alone. Help is available 24/7.
            </p>
          </div>
        </motion.div>
      )}

      {/* Main Crisis Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleCrisisClick}
        className={`relative w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all ${
          isPressed ? 'bg-red-700' : 'bg-red-600 hover:bg-red-700'
        }`}
        aria-label="Emergency crisis support"
      >
        <AlertTriangle className="h-8 w-8 text-white" />
        
        {/* Pulse indicator */}
        <motion.span
          className="absolute -top-1 -right-1 flex h-3 w-3"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </motion.span>
      </motion.button>
    </div>
  );
}