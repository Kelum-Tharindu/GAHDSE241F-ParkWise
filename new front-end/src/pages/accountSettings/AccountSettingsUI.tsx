import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import AccountSettings from "../../components/AccountSettings/AccountSettings";

export default function AccountSettingsPage() {
  return (
    <>
      <PageMeta
        title="Account Settings"
        description="Manage your profile, security, notifications, and billing information for your ParkWise account."
      />
      <PageBreadcrumb pageTitle="Account Settings" />
      <div className="space-y-6">
        <ComponentCard title="Account Settings">
          <AccountSettings />
        </ComponentCard>
      </div>
    </>
  );
}
