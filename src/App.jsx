import { useState, useEffect } from 'react';
import Desktop from './components/layout/Desktop';
import BootSplash from './components/ui/BootSplash';
import { preloadSounds } from './utils/soundManager';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    preloadSounds();
  }, []);

  return (
    <div className="app-container">
      {showSplash && <BootSplash onComplete={() => setShowSplash(false)} />}
      <div className="mobile-warning">
        <p>Please view this website on a desktop computer.</p>
      </div>
      <Desktop />
    </div>
  );
};

export default App;
