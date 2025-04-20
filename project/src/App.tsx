import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/home';
import { Dashboard } from './pages/dashboard';
import { AuthLayout } from './components/auth-layout';
import { ProtectedRoute } from './components/protected-route';

import { RouteBidProvider } from './context/RouteBidContext';

function App() {
  return (
    <RouteBidProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route element={<AuthLayout />}>
                <Route
                  path="/dashboard/*"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </RouteBidProvider>
  );
}

export default App;