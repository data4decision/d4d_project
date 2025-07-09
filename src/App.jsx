// File: App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AdminLogin from './admin/AdminLogin';
import AdminSignup from './admin/AdminSignup';
import AdminDashboard from './admin/AdminDashboard';
import ClientLogin from './client/ClientLogin';
import ClientSignup from './client/ClientSignup';
import ClientDashboard from './client/ClientDasboard';
import { auth } from './firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase/firebase';
import Layout from './components/Layout';
import CompareView from './pages/CompareView'; 
import GlobalIndicatorView from "./pages/GlobalIndicatorView";
import AdvancedComparison from "./pages/AdvancedComparison";
import KPITrends from './pages/KPITrends';


export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({ ...currentUser, isAdmin: userData.role === "admin" });
          } else {
            console.warn("User document not found in Firestore.");
            // Option: Treat as client by default
            setUser({ ...currentUser, isAdmin: false });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  // Placeholder Admin Pages
  const Reports = () => <Layout><h2>Reports Page</h2></Layout>;
  const Users = () => <Layout><h2>Users Page</h2></Layout>;
  const Settings = () => <Layout><h2>Settings Page</h2></Layout>;

  return (
    <Routes>
      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/signup" element={<AdminSignup />} />
      <Route
        path="/admin/dashboard"
        element={user?.isAdmin ? <AdminDashboard /> : <Navigate to="/admin/login" />}
      />
      <Route
        path="/admin/reports"
        element={user?.isAdmin ? <Reports /> : <Navigate to="/admin/login" />}
      />
      <Route
  path="/admin/global-indicator"
  element={user?.isAdmin ? <GlobalIndicatorView /> : <Navigate to="/admin/login" />}
/>
<Route
  path="/admin/kpi-trends"
  element={user?.isAdmin ? <KPITrends /> : <Navigate to="/admin/login" />}
/>
<Route
  path="/admin/advanced-comparison"
  element={user?.isAdmin ? <AdvancedComparison /> : <Navigate to="/admin/login" />}
/>

      <Route
        path="/admin/users"
        element={user?.isAdmin ? <Users /> : <Navigate to="/admin/login" />}
      />
      <Route
        path="/admin/settings"
        element={user?.isAdmin ? <Settings /> : <Navigate to="/admin/login" />}
      />

     <Route
  path="/admin/compare"
  element={user?.isAdmin ? (
    <Layout>
      <CompareView />
    </Layout>
  ) : (
    <Navigate to="/admin/login" />
  )}
/>


      {/* Client Routes */}
      <Route path="/client/login" element={<ClientLogin />} />
      <Route path="/client/signup" element={<ClientSignup />} />
      <Route
        path="/client/dashboard"
        element={user && !user.isAdmin ? <ClientDashboard /> : <Navigate to="/client/login" />}
      />

      {/* Default route */}
      <Route path="*" element={<Navigate to="/admin/login" />} />
    </Routes>
  );
}
