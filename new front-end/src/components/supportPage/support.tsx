import { useState, useEffect } from "react";
import { PlusCircle, Mail, Check, HelpCircle, RefreshCw, Calendar, Search } from "lucide-react";

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
  category: "account" | "billing" | "features" | "technical";
}

export default function Support() {
  const [activeTab, setActiveTab] = useState("tickets");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [faqCategory, setFaqCategory] = useState("all");
  
  // Sample tickets
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
    },
    {
      id: "TKT-003",
      subject: "Feature Request: Calendar Integration",
      description: "Would love to see integration with Google Calendar for scheduling",
      status: "resolved",
      createdAt: new Date(2025, 4, 1) // May 1, 2025
    }
  ]);
  
  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: ""
  });

  // Enhanced FAQ with categories
  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page. You will receive an email with instructions to reset your password. For security reasons, password reset links expire after 24 hours.",
      category: "account"
    },
    {
      question: "How can I update my profile information?",
      answer: "Go to Account Settings, then click on Edit Profile. You can update your information there and save the changes. Profile changes are applied immediately across all your connected devices.",
      category: "account"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers. For enterprise customers, we also offer invoice-based payments with flexible payment terms.",
      category: "billing"
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can cancel your subscription from the Account Settings page. Click on Subscription and then select Cancel Subscription. Please note that you'll still have access until the end of your billing period. We don't offer prorated refunds for partial months.",
      category: "billing"
    },
    {
      question: "Can I export my data?",
      answer: "Yes, we offer comprehensive data export options. Go to Account Settings > Privacy & Data, then click on 'Export My Data'. You can choose between CSV, JSON, or PDF formats depending on the type of data you need.",
      category: "features"
    },
    {
      question: "Is there a mobile app available?",
      answer: "Yes, we have native apps for both iOS and Android platforms. You can download them from the App Store or Google Play Store. Our mobile apps support all core features of the web application with offline capabilities.",
      category: "features"
    },
    {
      question: "Why is the application running slowly?",
      answer: "Performance issues can be caused by various factors including browser cache, network connection, or device resources. Try clearing your browser cache, using a wired connection, or closing unused applications to improve performance.",
      category: "technical"
    },
    {
      question: "How do I enable two-factor authentication?",
      answer: "Go to Account Settings > Security, then toggle on 'Two-Factor Authentication'. You can choose between SMS verification or using an authenticator app like Google Authenticator or Authy. We recommend using an authenticator app for enhanced security.",
      category: "technical"
    }
  ];

  const handleSubmitTicket = (e: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
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

  const getStatusColor = (status: "open" | "in-progress" | "resolved") => {
    switch (status) {
      case "open":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "resolved":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status: "open" | "in-progress" | "resolved") => {
    switch (status) {
      case "open":
        return <Mail className="w-4 h-4 mr-1" />;
      case "in-progress":
        return <RefreshCw className="w-4 h-4 mr-1" />;
      case "resolved":
        return <Check className="w-4 h-4 mr-1" />;
      default:
        return null;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    // Apply status filter
    if (filterStatus !== "all" && ticket.status !== filterStatus) return false;
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        ticket.subject.toLowerCase().includes(query) ||
        ticket.description.toLowerCase().includes(query) ||
        ticket.id.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const filteredFaqs = faqs.filter(faq => {
    // Apply category filter
    if (faqCategory !== "all" && faq.category !== faqCategory) return false;
    
    // Apply search query 
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Support Center
          </h1>
        </div>
        
        <div className="rounded-xl shadow-lg overflow-hidden bg-white border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              className={`px-6 py-4 font-medium ${
                activeTab === "tickets" 
                  ? "border-b-2 border-violet-600 text-violet-700 dark:border-violet-500 dark:text-violet-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
              onClick={() => setActiveTab("tickets")}
            >
              My Tickets
            </button>
            <button
              className={`px-6 py-4 font-medium ${
                activeTab === "newTicket" 
                  ? "border-b-2 border-violet-600 text-violet-700 dark:border-violet-500 dark:text-violet-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
              onClick={() => setActiveTab("newTicket")}
            >
              Create Ticket
            </button>
            <button
              className={`px-6 py-4 font-medium ${
                activeTab === "faq" 
                  ? "border-b-2 border-violet-600 text-violet-700 dark:border-violet-500 dark:text-violet-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Support Tickets</h2>
                  
                  <div className="flex space-x-3">
                    <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search tickets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 outline-none bg-gray-100 text-gray-800 placeholder-gray-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      />
                    </div>
                    
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="p-2 rounded-lg border bg-white border-gray-200 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="all">All Status</option>
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    
                    <button
                      className="flex items-center px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white"
                      onClick={() => setActiveTab("newTicket")}
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      New Ticket
                    </button>
                  </div>
                </div>
                
                {filteredTickets.length === 0 ? (
                  <div className="text-center py-16 rounded-lg bg-gray-50 border border-gray-100 dark:bg-gray-700 dark:border-gray-700">
                    <HelpCircle className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                    {searchQuery || filterStatus !== "all" ? (
                      <p className="text-gray-500 dark:text-gray-400">No tickets match your current filters.</p>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">You haven't created any support tickets yet.</p>
                    )}
                    <button 
                      className="mt-4 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white"
                      onClick={() => setActiveTab("newTicket")}
                    >
                      Create Your First Ticket
                    </button>
                  </div>
                ) : (
                  <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Subject</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredTickets.map((ticket) => (
                          <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-violet-600 dark:text-violet-400">{ticket.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{ticket.subject}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                                {getStatusIcon(ticket.status)}
                                {ticket.status.replace('-', ' ')}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center text-gray-500 dark:text-gray-400">
                              <Calendar className="w-4 h-4 mr-2" />
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
                <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Create New Support Ticket</h2>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Briefly describe your issue"
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <textarea
                      id="description"
                      rows={6}
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="Please provide all relevant details about your issue"
                    ></textarea>
                  </div>
                  <div className="pt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab("tickets")}
                      className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitTicket}
                      className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                    >
                      Submit Ticket
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "faq" && (
              <div>
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Frequently Asked Questions</h2>
                  
                  <div className="flex space-x-3">
                    <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search FAQs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 outline-none bg-gray-100 text-gray-800 placeholder-gray-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      />
                    </div>
                    
                    <select
                      value={faqCategory}
                      onChange={(e) => setFaqCategory(e.target.value)}
                      className="p-2 rounded-lg border bg-white border-gray-200 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="all">All Categories</option>
                      <option value="account">Account</option>
                      <option value="billing">Billing</option>
                      <option value="features">Features</option>
                      <option value="technical">Technical</option>
                    </select>
                  </div>
                </div>
                
                {filteredFaqs.length === 0 ? (
                  <div className="text-center py-16 rounded-lg bg-gray-50 border border-gray-100 dark:bg-gray-700 dark:border-gray-700">
                    <Search className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                    <p className="text-gray-500 dark:text-gray-400">No FAQs match your search criteria.</p>
                    <button 
                      className="mt-4 px-4 py-2 text-violet-600 hover:underline"
                      onClick={() => {
                        setSearchQuery("");
                        setFaqCategory("all");
                      }}
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredFaqs.map((faq, index) => (
                      <div 
                        key={index}
                        className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                      >
                        <details className="group">
                          <summary className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600">
                            <div className="flex items-center">
                              <span className="font-medium text-gray-800 dark:text-white">{faq.question}</span>
                              <span className="ml-3 px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300">
                                {faq.category}
                              </span>
                            </div>
                            <svg 
                              className="w-5 h-5 group-open:rotate-180 transition-transform text-gray-500 dark:text-gray-400" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </summary>
                          <div className="p-4 border-t border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300">
                            {faq.answer}
                          </div>
                        </details>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-8 p-5 rounded-lg bg-gray-50 border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                  <div className="flex items-start">
                    <div className="rounded-full p-3 bg-violet-100 text-violet-600 dark:bg-violet-900 dark:text-violet-300">
                      <HelpCircle className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-md font-medium text-gray-800 dark:text-white">Still need help?</h3>
                      <p className="mt-1 text-gray-600 dark:text-gray-400">
                        If you couldn't find an answer to your question, please create a support ticket and our team will assist you within 24 hours.
                      </p>
                      <button 
                        className="mt-3 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 text-sm"
                        onClick={() => setActiveTab("newTicket")}
                      >
                        Create Support Ticket
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
