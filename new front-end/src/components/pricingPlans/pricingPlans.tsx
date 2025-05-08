import { useState } from "react";
import { FaCar, FaParking, FaChartLine, FaShieldAlt, FaClock, FaUsers, FaTag, FaMoneyCheckAlt, FaCheckCircle } from "react-icons/fa";

interface Plan {
  id: number;
  title: string;
  price: string;
  features: string[];
  recommended?: boolean;
}

export default function PricingPlans() {
  const [isLandowner, setIsLandowner] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const userPlans: Plan[] = [
    {
      id: 1,
      title: "Free",
      price: "0",
      features: [
        "2 hourly bookings/month",
        "Basic parking spots",
        "Email notifications",
        "Community support"
      ]
    },
    {
      id: 2,
      title: "Premium",
      price: "9.99",
      features: [
        "10 hourly bookings/month",
        "Priority parking spots",
        "SMS notifications",
        "24/7 support",
        "Reservation reminders"
      ],
      recommended: true
    },
    {
      id: 3,
      title: "Business",
      price: "29.99",
      features: [
        "Unlimited bookings",
        "Premium parking spots",
        "Dedicated assistant",
        "Valet service",
        "Monthly reports"
      ]
    }
  ];

  const landownerPlans: Plan[] = [
    {
      id: 1,
      title: "Basic",
      price: "5%",
      features: [
        "List up to 5 spaces",
        "Basic analytics",
        "Standard payout",
        "Email support"
      ]
    },
    {
      id: 2,
      title: "Pro",
      price: "3%",
      features: [
        "List up to 20 spaces",
        "Advanced analytics",
        "Faster payout",
        "Priority support",
        "Custom pricing"
      ],
      recommended: true
    },
    {
      id: 3,
      title: "Enterprise",
      price: "Custom",
      features: [
        "Unlimited spaces",
        "API access",
        "Dedicated account manager",
        "White-label solutions",
        "24/7 premium support"
      ]
    }
  ];

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowConfirmation(true);
  };

  const handleConfirmation = () => {
    setShowConfirmation(false);
    // Add actual subscription logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            {isLandowner ? "Landowner Plans" : "User Plans"}
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-gray-600 dark:text-gray-400">User</span>
            <button
              onClick={() => setIsLandowner(!isLandowner)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${isLandowner ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${isLandowner ? "translate-x-6" : "translate-x-1"}`} />
            </button>
            <span className="text-gray-600 dark:text-gray-400">Landowner</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {(isLandowner ? landownerPlans : userPlans).map((plan) => (
            <div
              key={plan.id}
              className={`relative border rounded-xl p-8 transition-all
                ${plan.recommended 
                  ? "border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"}
                hover:shadow-lg dark:hover:shadow-gray-700/30`}
            >
              {plan.recommended && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-xs rounded-bl-xl rounded-tr-xl">
                  Recommended
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {plan.title}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {isLandowner ? "" : "$"}{plan.price}
                  </span>
                  {!isLandowner && (
                    <span className="text-gray-500 dark:text-gray-400">/month</span>
                  )}
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanSelect(plan)}
                className={`w-full py-3 px-6 rounded-lg font-medium transition
                  ${plan.recommended
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"}`}
              >
                Choose Plan
              </button>
            </div>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="mt-16 border rounded-xl overflow-hidden dark:border-gray-700">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left">Key Features</th>
                {[isLandowner ? "Basic" : "Free", "Pro", "Enterprise"].map((plan) => (
                  <th key={plan} className="px-6 py-4 text-center">{plan}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Parking Spaces", "5", "20", "Unlimited"],
                ["Revenue Share", "5%", "3%", "Custom"],
                ["Support", "Email", "Priority", "24/7 Dedicated"],
                ["Analytics", "Basic", "Advanced", "Enterprise"],
                ["Payout Frequency", "Weekly", "3 Days", "Instant"]
              ].map(([feature, ...values]) => (
                <tr key={feature} className="border-t dark:border-gray-700">
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{feature}</td>
                  {values.map((value, i) => (
                    <td key={i} className="px-6 py-4 text-center text-gray-900 dark:text-white">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && selectedPlan && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4 dark:text-white">
                Confirm {selectedPlan.title} Plan
              </h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 border rounded-lg p-4 dark:border-gray-700">
                  <h4 className="font-semibold dark:text-white">{selectedPlan.title}</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {isLandowner ? "Commission rate" : "Monthly price"}:{" "}
                    <span className="font-bold">
                      {isLandowner ? selectedPlan.price : `$${selectedPlan.price}`}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-6 py-2 flex-1 border rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmation}
                  className="px-6 py-2 flex-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
