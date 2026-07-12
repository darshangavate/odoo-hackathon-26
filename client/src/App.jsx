import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Maintenance from "./pages/Maintenance";
import Dashboard from "./pages/Dashboard";
import OrganizationSetup from "./pages/OrganizationSetup";
import Assets from "./pages/Assets";
import AllocationTransfer from "./pages/AllocationTransfer";
import ResourceBooking from "./pages/ResourceBooking";
import Audit from "./pages/Audit";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";

import AdminLayout from "./layouts/AdminLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
      
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Admin Pages */}
        <Route element={<AdminLayout />}>
         <Route
    path="/maintenance"
    element={<Maintenance />}
/>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/organization-setup"
            element={<OrganizationSetup />}
          />

          <Route
            path="/assets"
            element={<Assets />}
          />

          <Route
            path="/allocation-transfer"
            element={<AllocationTransfer />}
          />

          <Route
            path="/resource-booking"
            element={<ResourceBooking />}
          />

          

          <Route
            path="/audit"
            element={<Audit />}
          />

          <Route
            path="/reports"
            element={<Reports />}
          />

          <Route
            path="/notifications"
            element={<Notifications />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;