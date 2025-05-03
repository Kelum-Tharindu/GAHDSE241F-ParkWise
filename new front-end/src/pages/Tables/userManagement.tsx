import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import User from "../../components/tables/userManagement/userManagement";

export default function UserManagementTables() {
  return (
    <>
      <PageMeta
        title="React.js User Management Table"
        description="This is the user management feature for admin in the ParkWise application. It allows admins to manage user accounts, including viewing, editing, and deleting user information."
      />
      <PageBreadcrumb pageTitle="User Management Table" />
      <div className="space-y-6">
        <ComponentCard title="User Management">
          <User />
        </ComponentCard>
      </div>
    </>
  );
}
