'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Info } from 'lucide-react';

const GlobalNotification: React.FC = () => {
  const { notification } = useStore();

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -20, x: '-50%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="fixed top-6 left-1/2 z-[9999] w-[90%] max-w-md"
        >
          <div className="glass-panel text-xs text-white uppercase tracking-widest px-5 py-4 flex items-center justify-between border-l-4 border-l-white gap-3 shadow-2xl">
            <div className="flex items-center gap-3">
              <Info className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>{notification}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalNotification;
