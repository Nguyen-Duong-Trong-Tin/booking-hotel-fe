import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/clients/Home";
import AdminLogin from "./pages/admins/AdminLogin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}
