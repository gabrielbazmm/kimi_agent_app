import { useState } from 'react';
import { LandingPage, LoadingPage, DesignerPage } from '@/components/pages';
import type { AppState } from '@/types';

function App() {
  const [appState, setAppState] = useState<AppState>('landing');

  const handleStart = () => setAppState('loading');
  const handleLoadingComplete = () => setAppState('designer');

  return (
    <>
      {appState === 'landing' && <LandingPage onStart={handleStart} />}
      {appState === 'loading' && <LoadingPage onComplete={handleLoadingComplete} />}
      {appState === 'designer' && <DesignerPage />}
    </>
  );
}

export default App;
