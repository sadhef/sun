import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/useAuthStore';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EnquiriesPage from './pages/Enquiries/EnquiriesPage';
import NewEnquiryPage from './pages/Enquiries/NewEnquiryPage';
import NominationPage from './pages/Nomination/NominationPage';
import PendingNominationsPage from './pages/Nomination/PendingNominationsPage';
import SchedulePage from './pages/Schedule/SchedulePage';
import TrainersPage from './pages/Trainers/TrainersPage';
import RoomsPage from './pages/Rooms/RoomsPage';
import LeavesPage from './pages/Leaves/LeavesPage';
import InvoicesPage from './pages/Invoices/InvoicesPage';
import CertificatesPage from './pages/Certificates/CertificatesPage';
import RateCardsPage from './pages/RateCards/RateCardsPage';
import ReportsPage from './pages/Reports/ReportsPage';
import AllRecordsPage from './pages/AllRecords/AllRecordsPage';
import RosterPage from './pages/Roster/RosterPage';
import ResultsPage from './pages/Results/ResultsPage';
import FeedbackPage from './pages/Feedback/FeedbackPage';
import RevenuePage from './pages/Revenue/RevenuePage';
import Layout from './components/Layout/Layout';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="enquiries/new" element={<NewEnquiryPage />} />
          <Route path="enquiries/pending" element={<EnquiriesPage filter="pending" />} />
          <Route path="nomination" element={<NominationPage />} />
          <Route path="nomination/pending" element={<PendingNominationsPage />} />
          <Route path="records" element={<AllRecordsPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="roster" element={<RosterPage />} />
          <Route path="trainers" element={<TrainersPage />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="leaves" element={<LeavesPage />} />
          <Route path="rate-cards" element={<RateCardsPage />} />
          <Route path="results" element={<ResultsPage />} />
          <Route path="feedback" element={<FeedbackPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="certificates" element={<CertificatesPage />} />
          <Route path="revenue" element={<RevenuePage />} />
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
