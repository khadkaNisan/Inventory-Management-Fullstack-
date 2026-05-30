import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './utils/auth';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import InventoriesPage from './pages/InventoriesPage';
import InventoryDetailPage from './pages/InventoryDetailPage';
import CategoryItemsPage from './pages/CategoryItemsPage';
import AllItemsPage from './pages/AllItemsPage';

function PublicRoute({ children }: { children: React.ReactNode }) {
  if (isAuthenticated()) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventories"
          element={
            <ProtectedRoute>
              <Layout>
                <InventoriesPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventories/:invId"
          element={
            <ProtectedRoute>
              <Layout>
                <InventoryDetailPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventories/:invId/:catId"
          element={
            <ProtectedRoute>
              <Layout>
                <CategoryItemsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/items"
          element={
            <ProtectedRoute>
              <Layout>
                <AllItemsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
