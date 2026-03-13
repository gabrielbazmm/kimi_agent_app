import { LandingPage, LoadingPage, DesignerPage } from '@/components/pages';
import { useAppNavigation } from '@/hooks/useAppNavigation';

function App() {
  const { appState, goToLoading, goToDesigner } = useAppNavigation();

  return (
    <>
      {appState === 'landing' && <LandingPage onStart={goToLoading} />}
      {appState === 'loading' && <LoadingPage onComplete={goToDesigner} />}
      {appState === 'designer' && <DesignerPage />}
    </>
  );
}

export default App;
