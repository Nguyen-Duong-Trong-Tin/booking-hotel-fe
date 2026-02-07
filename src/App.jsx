import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/clients/Home";
import AdminLogin from "./pages/admins/auth/AdminLogin";
import AdminDashboard from "./pages/admins/dashboard/AdminDashboard";
import AdminCategoryPage from "./pages/admins/categories";
import AdminRoute from "./pages/admins/AdminRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/categories" element={<AdminCategoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
