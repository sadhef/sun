import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/useAuthStore';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EnquiriesPage from './pages/Enquiries/EnquiriesPage';
import NewEnquiryPage from './pages/Enquiries/NewEnquiryPage';
import NominationPage from './pages/Nomination/NominationPage';
import PendingNominationsPage from './pages/Nomination/PendingNominationsPage';
import Layout from './components/Layout/Layout';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="enquiries" element={<EnquiriesPage />} />
          <Route path="enquiries/new" element={<NewEnquiryPage />} />
          <Route path="enquiries/pending" element={<EnquiriesPage filter="pending" />} />
          <Route path="nomination" element={<NominationPage />} />
          <Route path="nomination/pending" element={<PendingNominationsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default App;
