// src/pages/AdminReportPage.tsx
import React from "react";
import AdminReport from "../../components/Reports/reports"; // Adjust the path if needed

const AdminReportPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#181f2a] flex flex-col items-center py-10 px-2">
      <header className="w-full max-w-3xl mx-auto mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-2">
          Reports
        </h1>
        <p className="text-base text-gray-500 dark:text-gray-300">
          Generate and download transaction reports for your smart parking system.
        </p>
      </header>
      <main className="w-full flex justify-center">
        <AdminReport />
      </main>
    </div>
  );
};

export default AdminReportPage;
