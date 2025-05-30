import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import MonthlyTargetManagement from "../../components/ecommerce/MonthlyTargetManagement";

export default function TargetManagementPage() {
  return (
    <>
      <PageMeta
        title="Monthly Target Management | ParkWise Admin"
        description="Manage monthly revenue targets for the ParkWise platform"
      />
      <PageBreadcrumb pageTitle="Monthly Target Management" />
      <div className="space-y-6">
        <ComponentCard title="Monthly Targets">
          <MonthlyTargetManagement />
        </ComponentCard>
      </div>
    </>
  );
}