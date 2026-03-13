import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/clients/home";
import Destinations from "./pages/clients/destinations";
import ClientLogin from "./pages/clients/auth/ClientLogin";
import ClientRegister from "./pages/clients/auth/ClientRegister";
import Rooms from "./pages/clients/room";
import RoomDetail from "./pages/clients/room/RoomDetail";
import RoomBooking from "./pages/clients/booking/RoomBooking";
import AdminLogin from "./pages/admins/auth/AdminLogin";
import AdminDashboard from "./pages/admins/dashboard/AdminDashboard";
import AdminCategoryPage from "./pages/admins/categories";
import AdminRolePage from "./pages/admins/roles";
import AdminRoute from "./pages/admins/AdminRoute";
import AdminUserPage from "./pages/admins/users";
import AdminAmenityPage from "./pages/admins/amenities";
import AdminRoomPage from "./pages/admins/rooms";
import AdminRoomAmenityPage from "./pages/admins/room-amenities";
import AdminBookingPage from "./pages/admins/bookings";
import AdminPaymentPage from "./pages/admins/payments";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/login" element={<ClientLogin />} />
        <Route path="/register" element={<ClientRegister />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/:id" element={<RoomDetail />} />
        <Route path="/rooms/:id/booking" element={<RoomBooking />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/categories" element={<AdminCategoryPage />} />
          <Route path="/admin/roles" element={<AdminRolePage />} />
          <Route path="/admin/users" element={<AdminUserPage />} />
          <Route path="/admin/amenities" element={<AdminAmenityPage />} />
          <Route path="/admin/rooms" element={<AdminRoomPage />} />
          <Route path="/admin/room-amenities" element={<AdminRoomAmenityPage />} />
          <Route path="/admin/bookings" element={<AdminBookingPage />} />
          <Route path="/admin/payments" element={<AdminPaymentPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
