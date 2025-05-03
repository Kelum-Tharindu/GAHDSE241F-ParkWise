import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ParkingManager from "../../components/tables/userManagement/parkingCoordinatorManagemen";

export default function LandownerManagementTables() {
  return (
    <>
      <PageMeta
        title="React.js Parking Coordinator Management Table"
        description="This is the Parking Coordinator management feature for admin in the ParkWise application. It allows admins to manage user accounts, including viewing, editing, and deleting user information."
      />
      <PageBreadcrumb pageTitle="Parking Coordinator Management Table" />
      <div className="space-y-6">
        <ComponentCard title="Parking Coordinator Management">
          <ParkingManager />
        </ComponentCard>
      </div>
    </>
  );
}
