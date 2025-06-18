// In your App.js or routing file
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AboutPage from './About';
import FixThisBugApp from './FixThisBugApp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FixThisBugApp />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;