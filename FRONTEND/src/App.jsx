import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom'
import Login from "./pages/Auth/Login"
import SignUp from './pages/Auth/SignUp'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import Dashboard from './pages/Dashboard/Home'
import Income from './pages/Dashboard/Income'
import Expense from './pages/Dashboard/Expense'
import Transactions from './pages/Dashboard/Transactions'
import AdminDashboard from './pages/Admin/Dashboard'
import AdminUsers from './pages/Admin/Users'
import AdminTransactions from './pages/Admin/Transactions'
import UserProvider from './context/UserContext'
import { ThemeProvider } from './context/ThemeContext'
import { CurrencyProvider } from './context/CurrencyContext'
import { AdminProvider } from './context/AdminContext'
import LandingPage from './pages/Home/Home'

// For debugging - log all imports
console.log('Import check - AdminDashboard:', !!AdminDashboard);
console.log('Import check - AdminUsers:', !!AdminUsers);
console.log('Import check - AdminTransactions:', !!AdminTransactions);

const App = () => {
  console.log('App component rendering');
  return (
    <CurrencyProvider>
      <UserProvider>
        <Router>
          <AppRoutes />
        </Router>
      </UserProvider>
    </CurrencyProvider>
  )
}

// Separate component for routes
const AppRoutes = () => {
  const location = useLocation();
  console.log('Current location path:', location.pathname);
  
  // Determine if current path is an admin route for debugging
  const isAdminRoute = location.pathname.startsWith('/admin');
  console.log('Is admin route:', isAdminRoute);
  
  return (
    <Routes>
      {/* Landing page */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      
      {/* Main app routes with ThemeProvider */}
      <Route path="/dashboard" element={
        <ThemeProvider>
          <Dashboard />
        </ThemeProvider>
      } />
      <Route path="/income" element={
        <ThemeProvider>
          <Income />
        </ThemeProvider>
      } />
      <Route path="/expense" element={
        <ThemeProvider>
          <Expense />
        </ThemeProvider>
      } />
      <Route path="/transactions" element={
        <ThemeProvider>
          <Transactions />
        </ThemeProvider>
      } />
      
      {/* Admin routes all wrapped in AdminProvider */}
      <Route path="/admin/*" element={
        <AdminProvider>
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="transactions" element={<AdminTransactions />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </AdminProvider>
      } />
      
      {/* Default redirect */}
      <Route path="*" element={<Root />} />
    </Routes>
  );
};

export default App

const Root = () => {
  const isAuthenticated = !!localStorage.getItem('token')
  return isAuthenticated ? (
    <Navigate to={'/dashboard'} />
  ) : (
    <Navigate to={'/'} />
  )
};