import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Landowner from "../../components/tables/userManagement/landownerManagement";

export default function LandownerManagementTables() {
  return (
    <>
      <PageMeta
        title="React.js Landowner Management Table"
        description="This is the Landowner management feature for admin in the ParkWise application. It allows admins to manage user accounts, including viewing, editing, and deleting user information."
      />
      <PageBreadcrumb pageTitle="Landowner Management Table" />
      <div className="space-y-6">
        <ComponentCard title="Landowner Management">
          <Landowner />
        </ComponentCard>
      </div>
    </>
  );
}
