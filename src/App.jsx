import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header.jsx';
import Intro from './components/Intro.jsx';
import LevelTokenizer from './components/LevelTokenizer.jsx';
import LevelContextAnchor from './components/LevelContextAnchor.jsx';
import LevelHallucinationHunt from './components/LevelHallucinationHunt.jsx';
import Victory from './components/Victory.jsx';
import { Background } from './components/Common.jsx';
import { useTimer } from './hooks/useTimer';

export default function App() {
  const [stage, setStage] = useState(0);
  const [startedAt, setStartedAt] = useState(null);
  const [finishedAt, setFinishedAt] = useState(null);
  const elapsed = useTimer(startedAt, finishedAt);

  function start() {
    setStartedAt(Date.now());
    setStage(1);
  }

  function finish() {
    setFinishedAt(Date.now());
    setStage(4);
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-cream text-ink">
      <Background />

      {stage > 0 && stage < 4 && <Header level={stage} elapsed={elapsed} />}

      <main className="relative z-10 flex-1 w-full max-w-3xl mx-auto px-5 sm:px-8 pt-6 sm:pt-10 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.985 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {stage === 0 && <Intro onStart={start} />}
            {stage === 1 && <LevelTokenizer onComplete={() => setStage(2)} />}
            {stage === 2 && <LevelContextAnchor onComplete={() => setStage(3)} />}
            {stage === 3 && <LevelHallucinationHunt onComplete={finish} />}
            {stage === 4 && <Victory elapsedMs={finishedAt - startedAt} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
