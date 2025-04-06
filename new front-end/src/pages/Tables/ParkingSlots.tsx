import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/ParkingSlots/ParkingSlots";

export default function ParkingTable() {
  return (
    <>
      <PageMeta
        title="React.js Parking Slots Details | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Parking Slots Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Parkings and Parkings' slots details" />
      <div className="space-y-6">
        <ComponentCard title="Parkings">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
