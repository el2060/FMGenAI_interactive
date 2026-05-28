import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header.jsx';
import Intro from './components/Intro.jsx';
import LevelAiTypes from './components/LevelAiTypes.jsx';
import LevelTokenizer from './components/LevelTokenizer.jsx';
import LevelTemperature from './components/LevelTemperature.jsx';
import LevelPersona from './components/LevelPersona.jsx';
import LevelContextAnchor from './components/LevelContextAnchor.jsx';
import LevelGrounding from './components/LevelGrounding.jsx';
import LevelIterate from './components/LevelIterate.jsx';
import LevelStructuredOutput from './components/LevelStructuredOutput.jsx';
import LevelPdpaGuardrails from './components/LevelPdpaGuardrails.jsx';
import LevelHallucinationHunt from './components/LevelHallucinationHunt.jsx';
import LevelHumanInLoop from './components/LevelHumanInLoop.jsx';
import Victory from './components/Victory.jsx';
import { Background } from './components/Common.jsx';

const TOTAL_LEVELS = 11;

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

      {stage > 0 && stage <= TOTAL_LEVELS && (
        <Header level={stage} onHome={() => go(0)} onJump={(lvl) => go(lvl)} />
      )}

      <main className="relative z-10 flex-1 w-full max-w-3xl mx-auto px-5 sm:px-8 pt-6 sm:pt-10 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.985 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {stage === 0  && <Intro onStart={() => go(1)} />}
            {stage === 1  && <LevelAiTypes           onComplete={() => go(2)} />}
            {stage === 2  && <LevelTokenizer         onComplete={() => go(3)} />}
            {stage === 3  && <LevelTemperature       onComplete={() => go(4)} />}
            {stage === 4  && <LevelPersona           onComplete={() => go(5)} />}
            {stage === 5  && <LevelContextAnchor     onComplete={() => go(6)} />}
            {stage === 6  && <LevelGrounding         onComplete={() => go(7)} />}
            {stage === 7  && <LevelIterate           onComplete={() => go(8)} />}
            {stage === 8  && <LevelStructuredOutput  onComplete={() => go(9)} />}
            {stage === 9  && <LevelPdpaGuardrails    onComplete={() => go(10)} />}
            {stage === 10 && <LevelHallucinationHunt onComplete={() => go(11)} />}
            {stage === 11 && <LevelHumanInLoop       onComplete={() => go(12)} />}
            {stage === 12 && <Victory onRestart={() => go(0)} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
