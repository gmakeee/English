import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { EconomyProvider } from './context/EconomyContext';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Profile from './pages/Profile';

function App() {
  return (
    <EconomyProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </EconomyProvider>
  );
}

export default App;
