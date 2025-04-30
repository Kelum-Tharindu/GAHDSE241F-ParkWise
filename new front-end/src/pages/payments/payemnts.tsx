// src/pages/PaymentsPage.tsx
import React from "react";
import PaymentTables from "../../components/payments/payments"; // Adjust the path if needed

const PaymentsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-7xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-2">
            All Payments
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-300">
            Review completed payments for customers and landowners
          </p>
        </header>
        <PaymentTables />
      </div>
    </div>
  );
};

export default PaymentsPage;
