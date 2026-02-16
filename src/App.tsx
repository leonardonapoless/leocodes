import { useState, useEffect } from 'react';
import Desktop from './components/layout/Desktop';
import BootSplash from './components/ui/BootSplash';
import { preloadSounds } from './utils/soundManager';

import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    preloadSounds();
  }, []);

  return (
    <div className="app-container">
      {showSplash && <BootSplash onComplete={() => setShowSplash(false)} />}
      <ErrorBoundary>
        <Desktop isBooted={!showSplash} />
      </ErrorBoundary>
    </div>
  );
};

export default App;
