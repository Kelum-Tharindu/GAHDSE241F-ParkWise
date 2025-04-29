import React, { useState, useMemo, useEffect } from "react";
import {
  FaSearch,
  FaEye,
  FaTrash,
  FaPlus,
  FaFilter,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaMoon,
  FaSun,
  FaImage,
  FaIdCard,
  FaClipboardList,
  FaArrowLeft,
} from "react-icons/fa";

interface Landowner {
  id: number;
  avatar: string;
  name: string;
  mail: string;
  role: string;
  phone: string;
  company: string;
  notes: string;
  status: "Active" | "Inactive";
  updated_at: string;
}

const initialLandowners: Landowner[] = [
  {
    id: 1,
    avatar: "/images/user/user-1.jpg",
    name: "John Doe",
    mail: "john.doe@example.com",
    role: "Primary Owner",
    phone: "+1 555-123-4567",
    company: "Acme Estates",
    notes: "VIP client. Owns multiple properties.",
    status: "Active",
    updated_at: "2025-04-27",
  },
  {
    id: 2,
    avatar: "/images/user/user-17.jpg",
    name: "Jane Smith",
    mail: "jane.smith@example.com",
    role: "Co-Owner",
    phone: "+1 555-987-6543",
    company: "Smith Holdings",
    notes: "",
    status: "Active",
    updated_at: "2025-04-27",
  },
  {
    id: 3,
    avatar: "/images/user/user-17.jpg",
    name: "Carlos Martinez",
    mail: "carlos.martinez@example.com",
    role: "Heir",
    phone: "+1 555-222-3333",
    company: "Martinez Group",
    notes: "Recently inherited.",
    status: "Inactive",
    updated_at: "2025-04-25",
  },
];

export default function LandownerManagementTable() {
  const [landowners, setLandowners] = useState<Landowner[]>(initialLandowners);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewLandowner, setViewLandowner] = useState<Landowner | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  const [form, setForm] = useState<Omit<Landowner, "id" | "status" | "updated_at">>({
    avatar: "",
    name: "",
    mail: "",
    role: "",
    phone: "",
    company: "",
    notes: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const isDark =
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.theme = newDark ? "dark" : "light";
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.mail.trim()) errs.mail = "Mail is required";
    else if (!/\S+@\S+\.\S+/.test(form.mail)) errs.mail = "Invalid email address";
    if (!form.role.trim()) errs.role = "Role is required";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    if (!form.company.trim()) errs.company = "Company is required";
    return errs;
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLandowners((prev) => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map((a) => a.id)) + 1 : 1,
        ...form,
        avatar: form.avatar || "/images/user/default.jpg",
        status: "Active",
        updated_at: new Date().toISOString().slice(0, 10),
      },
    ]);
    setShowAddForm(false);
    setForm({
      avatar: "",
      name: "",
      mail: "",
      role: "",
      phone: "",
      company: "",
      notes: "",
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this landowner?")) {
      setLandowners((prev) => prev.filter((a) => a.id !== id));
    }
  };

  // Only search by email
  const filteredLandowners = useMemo(() => {
    const lower = search.trim().toLowerCase();
    if (!lower) return landowners;
    return landowners.filter((a) => a.mail.toLowerCase().includes(lower));
  }, [landowners, search]);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen font-outfit">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-theme-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Theme toggle button */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Landowner Management</h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <FaSun className="text-yellow-400" />
            ) : (
              <FaMoon className="text-gray-700" />
            )}
          </button>
        </div>
        
        {viewLandowner ? (
          <div className="p-8">
            <button
              className="mb-6 flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 text-xs font-medium"
              onClick={() => setViewLandowner(null)}
            >
              <FaArrowLeft /> Back to Table
            </button>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center">
                <img
                  src={viewLandowner.avatar}
                  alt={viewLandowner.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 mb-4"
                />
                <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{viewLandowner.name}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold mb-4
                  ${viewLandowner.status === "Active"
                    ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                    : "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400"}
                `}>{viewLandowner.status}</span>
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div className="flex items-center gap-2">
                  <FaIdCard className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">ID</p>
                    <p className="font-medium text-gray-800 dark:text-white">{viewLandowner.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-800 dark:text-white">{viewLandowner.mail}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <FaUser className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Role</p>
                    <p className="font-medium text-gray-800 dark:text-white">{viewLandowner.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <FaPhone className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="font-medium text-gray-800 dark:text-white">{viewLandowner.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <FaBuilding className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Company</p>
                    <p className="font-medium text-gray-800 dark:text-white">{viewLandowner.company}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <FaClipboardList className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Updated At</p>
                    <p className="font-medium text-gray-800 dark:text-white">{viewLandowner.updated_at}</p>
                  </div>
                </div>
                
                <div className="md:col-span-2 mt-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Notes</p>
                  <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 min-h-[80px]">
                    {viewLandowner.notes || "No notes available."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : showAddForm ? (
          <form onSubmit={handleFormSubmit} className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                Add New Landowner
              </h2>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-xs font-medium dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                <FaArrowLeft /> Back to Table
              </button>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-xl mb-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Left Column */}
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      <FaUser className="inline mr-2" /> Name
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        errors.name
                          ? "border-red-500 dark:border-red-400"
                          : "border-gray-200 dark:border-gray-700"
                      } text-xs focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600/25 dark:bg-gray-900 dark:text-white`}
                    />
                    {errors.name && (
                      <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      <FaEnvelope className="inline mr-2" /> Email
                    </label>
                    <input
                      name="mail"
                      value={form.mail}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        errors.mail
                          ? "border-red-500 dark:border-red-400"
                          : "border-gray-200 dark:border-gray-700"
                      } text-xs focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600/25 dark:bg-gray-900 dark:text-white`}
                    />
                    {errors.mail && (
                      <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                        {errors.mail}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Role
                    </label>
                    <input
                      name="role"
                      value={form.role}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        errors.role
                          ? "border-red-500 dark:border-red-400"
                          : "border-gray-200 dark:border-gray-700"
                      } text-xs focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600/25 dark:bg-gray-900 dark:text-white`}
                    />
                    {errors.role && (
                      <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                        {errors.role}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Right Column */}
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      <FaPhone className="inline mr-2" /> Phone
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        errors.phone
                          ? "border-red-500 dark:border-red-400"
                          : "border-gray-200 dark:border-gray-700"
                      } text-xs focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600/25 dark:bg-gray-900 dark:text-white`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      <FaBuilding className="inline mr-2" /> Company/Organization
                    </label>
                    <input
                      name="company"
                      value={form.company}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        errors.company
                          ? "border-red-500 dark:border-red-400"
                          : "border-gray-200 dark:border-gray-700"
                      } text-xs focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600/25 dark:bg-gray-900 dark:text-white`}
                    />
                    {errors.company && (
                      <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                        {errors.company}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      <FaImage className="inline mr-2" /> Avatar URL
                    </label>
                    <input
                      name="avatar"
                      value={form.avatar}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600/25 dark:bg-gray-900 dark:text-white"
                      placeholder="/images/user/default.jpg"
                    />
                  </div>
                </div>
              </div>
              
              {/* Full Width - Notes */}
              <div className="mt-6">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600/25 dark:bg-gray-900 dark:text-white"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                <FaPlus className="inline mr-2" /> Add Landowner
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Search and Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b border-gray-100 dark:border-gray-700">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaSearch className="text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search by email"
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded outline-none text-xs text-gray-700 dark:text-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:focus:border-blue-600 dark:focus:ring-blue-600"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <button
                  className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition text-xs font-medium"
                >
                  <FaFilter /> Filters
                </button>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 bg-blue-600 dark:bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-700 transition text-xs font-medium"
                >
                  <FaPlus /> Add Landowner
                </button>
              </div>
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs">
                <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                  <tr>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avatar</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Updated At</th>
                    <th className="px-2 py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">View</th>
                    <th className="px-2 py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Delete</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 text-xs">
                  {filteredLandowners.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-gray-400 dark:text-gray-500 text-xs">
                        No landowners found.
                      </td>
                    </tr>
                  ) : (
                    filteredLandowners.map((landowner) => (
                      <tr key={landowner.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                        <td className="px-2 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300">{landowner.id}</td>
                        <td className="px-2 py-2 whitespace-nowrap">
                          <img
                            src={landowner.avatar || "/images/user/default.jpg"}
                            alt={landowner.name}
                            className="w-6 h-6 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                          />
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap font-medium text-gray-800 dark:text-white">{landowner.name}</td>
                        <td className="px-2 py-2 whitespace-nowrap text-gray-600 dark:text-gray-300">{landowner.mail}</td>
                        <td className="px-2 py-2 whitespace-nowrap text-gray-600 dark:text-gray-300">{landowner.role}</td>
                        <td className="px-2 py-2 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold
                            ${landowner.status === "Active"
                              ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                              : "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400"}
                          `}>{landowner.status}</span>
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-gray-600 dark:text-gray-300">{landowner.updated_at}</td>
                        <td className="px-2 py-2 whitespace-nowrap text-center">
                          <button
                            onClick={() => setViewLandowner(landowner)}
                            className="inline-flex items-center justify-center p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            title="View landowner details"
                          >
                            <FaEye size={14} />
                          </button>
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleDelete(landowner.id)}
                            className="inline-flex items-center justify-center p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                            title="Delete landowner"
                          >
                            <FaTrash size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
