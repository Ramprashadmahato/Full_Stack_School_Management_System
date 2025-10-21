import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import PublicRoutes from './routes/PublicRoutes';
import AdminRoutes from './routes/AdminRoutes';

function App() {
  return (
    <Router>
      {/* Public Pages */}
      <PublicRoutes />

      {/* Admin Pages */}
      <AdminRoutes />
    </Router>
  );
}

export default App;
