// src/pages/PricingPage.tsx
import React from "react";
import PricingPlans from "../../components/pricingPlans/pricingPlans";// Adjust path as needed

const PricingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">

      {/* Main Content */}
      <main className="flex-1">
        <PricingPlans />
      </main>

      {/* Footer */}
      <footer className="w-full py-4 bg-gray-800 text-gray-200 text-center">
        &copy; {new Date().getFullYear()} Smart Parking Booking. All rights reserved.
      </footer>
    </div>
  );
};

export default PricingPage;
