import React from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Support from "../../components/supportPage/support";

const SupportPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Support />
    </div>
  );
};

export default SupportPage;
