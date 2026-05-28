import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header.jsx';
import Intro from './components/Intro.jsx';
import LevelTokenizer from './components/LevelTokenizer.jsx';
import LevelTemperature from './components/LevelTemperature.jsx';
import LevelContextAnchor from './components/LevelContextAnchor.jsx';
import LevelGrounding from './components/LevelGrounding.jsx';
import LevelPdpaGuardrails from './components/LevelPdpaGuardrails.jsx';
import LevelHallucinationHunt from './components/LevelHallucinationHunt.jsx';
import Victory from './components/Victory.jsx';
import { Background } from './components/Common.jsx';

export default function App() {
  const [stage, setStage] = useState(0);

  function go(next) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStage(next);
  }

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [stage]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-cream text-ink">
      <Background />

      {stage > 0 && stage < 7 && <Header level={stage} />}

      <main className="relative z-10 flex-1 w-full max-w-3xl mx-auto px-5 sm:px-8 pt-6 sm:pt-10 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.985 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {stage === 0 && <Intro onStart={() => go(1)} />}
            {stage === 1 && <LevelTokenizer        onComplete={() => go(2)} />}
            {stage === 2 && <LevelTemperature      onComplete={() => go(3)} />}
            {stage === 3 && <LevelContextAnchor    onComplete={() => go(4)} />}
            {stage === 4 && <LevelGrounding        onComplete={() => go(5)} />}
            {stage === 5 && <LevelPdpaGuardrails   onComplete={() => go(6)} />}
            {stage === 6 && <LevelHallucinationHunt onComplete={() => go(7)} />}
            {stage === 7 && <Victory onRestart={() => go(0)} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
