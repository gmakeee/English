import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import { EconomyProvider } from './context/EconomyContext';
import { BossProvider } from './context/BossContext';
import { UserProvider } from './context/UserContext';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Profile from './pages/Profile';

function App() {
  return (
    <UserProvider>
      <EconomyProvider>
        <BossProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Layout>
          </BrowserRouter>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: 'var(--tg-theme-bg-color, #fff)',
                color: 'var(--tg-theme-text-color, #000)',
              },
            }}
          />
        </BossProvider>
      </EconomyProvider>
    </UserProvider>
  );
}

export default App;
