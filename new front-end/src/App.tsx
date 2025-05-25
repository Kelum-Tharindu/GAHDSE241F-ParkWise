import { BrowserRouter as Router, Routes, Route } from "react-router";
// import SignIn from "./pages/auth/Login";
// import SignUp from "./pages/auth/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import ParkingTable from "./pages/Tables/ParkingSlots";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Twofa from "./pages/auth/2faprocess";
import Login from "./pages/auth/login";
import Register from "./pages/auth/signup";
import FAQ from "./pages/supportFAQ/FAQpage"
import AdminManagemet from "./pages/Tables/adminManagement";
import LandownerManagement from "./pages/Tables/landownerManagement";
import UserManagement from "./pages/Tables/userManagement";
import BulkmanagerTables from "./pages/Tables/bulkManagerManagement"
import AccountSettings from "./pages/accountSettings/AccountSettingsUI";
import Pricing from "./pages/pricing&plans/pricing";
import Payments from "./pages/payments/payemnts";
import Reports from "./pages/Reports/Reports";
import LandownerParkingRentalsTable from "./pages/Landowner/ViewLand/ViewLand";
import ParkingAreaAddForm from "./pages/Landowner/AddLand/AddNewLandForm";
import LandownerCurrentBookingsTable  from "./pages/Landowner/Booking/CurrentBooking";
import LandownerBookingHistoryTable from "./pages/Landowner/Booking/BookingHistory";
import LandownerTransactionHistory from "./pages/Landowner/Earnings/TransactionHistory";
import LandownerPayoutsTable from "./pages/Landowner/Earnings/PayoutRequests";
import ParkingCoordinatorChunksTable from "./pages/EventCoordinator/PurchasedChunks/ViewChunks";
import PurchaseParkingChunk from "./pages/EventCoordinator/PurchasedChunks/PurchaseNewChunk";
import ParkingChunkPayment from "./pages/EventCoordinator/Payments/spotsChunkPayment";
import LandownerHome from "./pages/Landowner/Home/Home";
import ParkingCoordinatorHome from "./pages/EventCoordinator/Home/Home";

import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/AdminHome";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Dashboard Layout */}
        <Route element={<AppLayout />}>
          <Route  path="/Admin Dashboard" element={<ProtectedRoute requiredRole="admin"><Home /></ProtectedRoute>} />

          <Route path="/Land Owner Dashboard" element={<ProtectedRoute requiredRole="landowner"><LandownerHome /></ProtectedRoute>} />

          <Route path="/Parking Coordinator Dashboard" element={<ProtectedRoute requiredRole="parking coordinator"><ParkingCoordinatorHome /></ProtectedRoute>} />

          {/* Dashboard */}

          {/* Others Page */}
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/blank" element={<Blank />} />

          {/* Forms */}
          <Route path="/form-elements" element={<FormElements />} />

          {/* Tables */}
          <Route path="/basic-tables" element={<BasicTables />} />
          <Route path="/parking-tables" element={<ProtectedRoute requiredRole="admin"><ParkingTable /></ProtectedRoute>} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/admin-management" element={<AdminManagemet />} />
          <Route path="/landowner-management" element={<LandownerManagement />} />
          <Route path="/bulkmanager-management" element={<BulkmanagerTables />} />

          {/* Ui Elements */}
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/images" element={<Images />} />
          <Route path="/videos" element={<Videos />} />

          {/* Charts */}
          <Route path="/line-chart" element={<LineChart />} />
          <Route path="/bar-chart" element={<BarChart />} />

          {/* Support Page */}
          <Route path="/support" element={<FAQ />} />

          <Route path="/account-settings" element={<AccountSettings/>} />

          <Route path="/pricing" element={<Pricing />} />

          <Route path="/payments" element={<Payments />} />

          <Route path="/reports" element={<Reports />} />

          <Route path="/view-lands" element={<LandownerParkingRentalsTable />} />

          <Route path="/add-parking-area" element={<ParkingAreaAddForm />} />

          <Route path="/landowner-bookings" element={<LandownerCurrentBookingsTable  />} />

          <Route path="/landowner-booking-history" element={<LandownerBookingHistoryTable />} />

          <Route path="/landowner-transaction-history" element={<LandownerTransactionHistory />} />

          <Route path="/landowner-payouts" element={<LandownerPayoutsTable />} />

          <Route path="/coordinator-purchased-chunks" element={<ParkingCoordinatorChunksTable />} />

          <Route path="/purchase-parking-chunk" element={<PurchaseParkingChunk />} />

          <Route path="/parking-chunk-payment" element={<ParkingChunkPayment />} />

          {/* 2FA */}
        </Route>

        {/* Auth Layout */}
        <Route index path="/" element={<Login />} />
        <Route path="/2fa" element={<Twofa />} />
        <Route path="/signup" element={<Register />} />

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}