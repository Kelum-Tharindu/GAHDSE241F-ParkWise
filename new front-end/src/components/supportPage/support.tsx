import { useState } from "react";

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: "open" | "in-progress" | "resolved";
  createdAt: Date;
}

interface FAQItem {
  question: string;
  answer: string;
}

export default function Support() {
  const [activeTab, setActiveTab] = useState<"tickets" | "newTicket" | "faq">("tickets");
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: "TKT-001",
      subject: "Login Issues",
      description: "Unable to login to my account after password reset",
      status: "in-progress",
      createdAt: new Date(2025, 3, 25) // April 25, 2025
    },
    {
      id: "TKT-002",
      subject: "Payment Failed",
      description: "My credit card payment was declined but I was still charged",
      status: "open",
      createdAt: new Date(2025, 3, 27) // April 27, 2025
    }
  ]);
  
  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: ""
  });

  const faqs: FAQItem[] = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page. You will receive an email with instructions to reset your password."
    },
    {
      question: "How can I update my profile information?",
      answer: "Go to Account Settings, then click on Edit Profile. You can update your information there and save the changes."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers. For enterprise customers, we also offer invoice-based payments."
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can cancel your subscription from the Account Settings page. Click on Subscription and then select Cancel Subscription. Please note that you'll still have access until the end of your billing period."
    }
  ];

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSupportTicket: SupportTicket = {
      id: `TKT-00${tickets.length + 1}`,
      subject: newTicket.subject,
      description: newTicket.description,
      status: "open",
      createdAt: new Date()
    };
    
    setTickets([...tickets, newSupportTicket]);
    setNewTicket({ subject: "", description: "" });
    setActiveTab("tickets");
  };

  const getStatusColor = (status: SupportTicket["status"]) => {
    switch (status) {
      case "open":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Support Center</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "tickets" 
                ? "border-b-2 border-blue-500 text-blue-600" 
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("tickets")}
          >
            My Tickets
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "newTicket" 
                ? "border-b-2 border-blue-500 text-blue-600" 
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("newTicket")}
          >
            Create Ticket
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "faq" 
                ? "border-b-2 border-blue-500 text-blue-600" 
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("faq")}
          >
            FAQ
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {activeTab === "tickets" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-800">Support Tickets</h2>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 text-sm"
                  onClick={() => setActiveTab("newTicket")}
                >
                  New Ticket
                </button>
              </div>
              
              {tickets.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">You haven't created any support tickets yet.</p>
                </div>
              ) : (
                <div className="overflow-hidden border border-gray-200 rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tickets.map((ticket) => (
                        <tr key={ticket.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.subject}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                              {ticket.status.replace('-', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {ticket.createdAt.toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          
          {activeTab === "newTicket" && (
            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-4">Create New Support Ticket</h2>
              <form onSubmit={handleSubmitTicket}>
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={5}
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab("tickets")}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                  >
                    Submit Ticket
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {activeTab === "faq" && (
            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-md overflow-hidden">
                    <details className="group">
                      <summary className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <span className="font-medium text-gray-800">{faq.question}</span>
                        <svg 
                          className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="p-4 border-t border-gray-200 text-gray-600">
                        {faq.answer}
                      </div>
                    </details>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 bg-gray-50 p-4 rounded-md border border-gray-200">
                <h3 className="text-md font-medium text-gray-800 mb-2">Still need help?</h3>
                <p className="text-gray-600 mb-3">If you couldn't find an answer to your question, please create a support ticket and our team will assist you.</p>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 text-sm"
                  onClick={() => setActiveTab("newTicket")}
                >
                  Create Support Ticket
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
