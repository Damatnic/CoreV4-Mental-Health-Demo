import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { MentalHealthDashboard } from './components/dashboard/MentalHealthDashboard';
import { CrisisButton } from './components/crisis/CrisisButton';
import { logger } from './utils/logger';

function App() {
  React.useEffect(() => {
    logger.info('CoreV4 Mental Health Platform initialized', 'App');
  }, []);

  const handleCrisisDetected = () => {
    logger.crisis('Crisis detected - user activated crisis button', 'critical', 'App');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />

        {/* Main content */}
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<MentalHealthDashboard />} />
            <Route
              path="/crisis"
              element={
                <div className="text-center py-16">
                  <h1 className="text-3xl font-bold text-red-600 mb-4">Crisis Support</h1>
                  <p className="text-gray-600 mb-8">You&apos;re not alone. Help is available 24/7.</p>
                  <div className="space-y-4 max-w-md mx-auto">
                    <a
                      href="tel:988"
                      className="block w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                      Call Crisis Lifeline: 988
                    </a>
                    <a
                      href="sms:741741?body=HOME"
                      className="block w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                    >
                      Text HOME to 741741
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>

        {/* Floating Crisis Button */}
        <CrisisButton onCrisisDetected={handleCrisisDetected} />
      </div>
    </Router>
  );
}

export default App;