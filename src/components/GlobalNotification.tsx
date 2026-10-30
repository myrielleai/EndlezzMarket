'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { AnimatePresence, motion } from 'framer-motion';

const GlobalNotification: React.FC = () => {
  const { notification } = useStore();

  return (
    <div aria-live="polite" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-md pointer-events-none">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 340 }}
            className="bg-ink text-paper px-5 py-4 flex items-center gap-3 text-sm"
          >
            <span className="w-2 h-2 bg-signal shrink-0" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalNotification;
