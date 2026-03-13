import { useState, useCallback } from 'react';
import type { AppState } from '@/types';

export function useAppNavigation(initialState: AppState = 'landing') {
  const [appState, setAppState] = useState<AppState>(initialState);

  const goToLoading = useCallback(() => setAppState('loading'), []);
  const goToDesigner = useCallback(() => setAppState('designer'), []);

  return {
    appState,
    goToLoading,
    goToDesigner,
  };
}
