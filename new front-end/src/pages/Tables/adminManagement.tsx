import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Support from "../../components/supportPage/support";

export default function SupportPage() {
  return (
    <>
      <PageMeta
        title="Support Center"
        description="This is the support center for ParkWise. You can view your tickets, create new support requests, and browse FAQs."
      />
      <PageBreadcrumb pageTitle="Support Center" />
      <div className="space-y-6">
        <ComponentCard title="Support">
          <Support />
        </ComponentCard>
      </div>
    </>
  );
}
