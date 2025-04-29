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
import AccountSettings from "./pages/accountSettings/AccountSettingsUI"
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/AdminHome";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Dashboard Layout */}
        <Route element={<AppLayout />}>
          <Route index path="/" element={<Home />} />

          {/* Others Page */}
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/blank" element={<Blank />} />

          {/* Forms */}
          <Route path="/form-elements" element={<FormElements />} />

          {/* Tables */}
          <Route path="/basic-tables" element={<BasicTables />} />
          <Route path="/parking-tables" element={<ParkingTable />} />
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
        </Route>

        {/* Auth Layout */}
        <Route path="/signin" element={<Login />} />
        <Route path="/2fa" element={<Twofa />} />
        <Route path="/signup" element={<Register />} />

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}