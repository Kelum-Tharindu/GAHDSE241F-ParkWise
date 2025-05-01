import React, { useState, useMemo, useEffect } from "react";
import {
  FaSearch,
  FaEye,
  FaTrash,
  FaPlus,
  FaFilter,
  FaUser,
  FaEnvelope,
  FaMoon,
  FaSun,
  FaImage,
  FaIdCard,
  FaClipboardList,
  FaArrowLeft,
  FaUserShield,
} from "react-icons/fa";

interface Admin {
  id: number;
  avatar: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  userType: string;
  applicationAccess: string;
  status: "Active" | "Inactive";
  dateAdded: string;
  addedBy: string;
  notes: string;
}

const initialAdmins: Admin[] = [
  {
    id: 1,
    avatar: "/images/user/user-1.jpg",
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice.johnson@company.com",
    username: "alicej",
    userType: "System Admin",
    applicationAccess: "Dashboard, Reports",
    status: "Active",
    dateAdded: "2025-04-27",
    addedBy: "superadmin",
    notes: "Main system administrator.",
  },
  {
    id: 2,
    avatar: "/images/user/user-2.jpg",
    firstName: "Bob",
    lastName: "Smith",
    email: "bob.smith@company.com",
    username: "bobsmith",
    userType: "Department Admin",
    applicationAccess: "Dashboard",
    status: "Active",
    dateAdded: "2025-04-28",
    addedBy: "alicej",
    notes: "",
  },
];

export default function AdminManagementTable() {
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewAdmin, setViewAdmin] = useState<Admin | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  const [form, setForm] = useState<Omit<Admin, "id" | "status" | "dateAdded">>({
    avatar: "",
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    userType: "",
    applicationAccess: "",
    addedBy: "",
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
    if (!form.firstName.trim()) errs.firstName = "First name is required";
    if (!form.lastName.trim()) errs.lastName = "Last name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email address";
    if (!form.username.trim()) errs.username = "Username is required";
    if (!form.userType.trim()) errs.userType = "User type is required";
    if (!form.applicationAccess.trim()) errs.applicationAccess = "Application access is required";
    if (!form.addedBy.trim()) errs.addedBy = "Added By is required";
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
    setAdmins((prev) => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map((a) => a.id)) + 1 : 1,
        ...form,
        avatar: form.avatar || "/images/user/default.jpg",
        status: "Active",
        dateAdded: new Date().toISOString().slice(0, 10),
      },
    ]);
    setShowAddForm(false);
    setForm({
      avatar: "",
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      userType: "",
      applicationAccess: "",
      addedBy: "",
      notes: "",
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      setAdmins((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const filteredAdmins = useMemo(() => {
    const lower = search.trim().toLowerCase();
    if (!lower) return admins;
    return admins.filter((a) =>
      a.email.toLowerCase().includes(lower) ||
      a.username.toLowerCase().includes(lower) ||
      a.firstName.toLowerCase().includes(lower) ||
      a.lastName.toLowerCase().includes(lower)
    );
  }, [admins, search]);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen font-outfit">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-theme-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Theme toggle button */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Admin Management</h1>
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
        {viewAdmin ? (
          <div className="p-8">
            <button
              className="mb-6 flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 text-xs font-medium"
              onClick={() => setViewAdmin(null)}
            >
              <FaArrowLeft /> Back to Table
            </button>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center">
                <img
                  src={viewAdmin.avatar}
                  alt={viewAdmin.firstName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 mb-4"
                />
                <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                  {viewAdmin.firstName} {viewAdmin.lastName}
                </h2>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold mb-4
                  ${viewAdmin.status === "Active"
                    ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                    : "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400"}
                `}>{viewAdmin.status}</span>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div className="flex items-center gap-2">
                  <FaIdCard className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">ID</p>
                    <p className="font-medium text-gray-800 dark:text-white">{viewAdmin.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-800 dark:text-white">{viewAdmin.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaUser className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Username</p>
                    <p className="font-medium text-gray-800 dark:text-white">{viewAdmin.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaUserShield className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">User Type</p>
                    <p className="font-medium text-gray-800 dark:text-white">{viewAdmin.userType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaClipboardList className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Application Access</p>
                    <p className="font-medium text-gray-800 dark:text-white">{viewAdmin.applicationAccess}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaClipboardList className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Date Added</p>
                    <p className="font-medium text-gray-800 dark:text-white">{viewAdmin.dateAdded}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaUserShield className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Added By</p>
                    <p className="font-medium text-gray-800 dark:text-white">{viewAdmin.addedBy}</p>
                  </div>
                </div>
                <div className="md:col-span-2 mt-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Notes</p>
                  <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 min-h-[80px]">
                    {viewAdmin.notes || "No notes available."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : showAddForm ? (
          <form onSubmit={handleFormSubmit} className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                Add New Admin
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
                      <FaUser className="inline mr-2" /> First Name
                    </label>
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        errors.firstName
                          ? "border-red-500 dark:border-red-400"
                          : "border-gray-200 dark:border-gray-700"
                      } text-xs focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600/25 dark:bg-gray-900 dark:text-white`}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Last Name
                    </label>
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        errors.lastName
                          ? "border-red-500 dark:border-red-400"
                          : "border-gray-200 dark:border-gray-700"
                      } text-xs focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600/25 dark:bg-gray-900 dark:text-white`}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      <FaEnvelope className="inline mr-2" /> Email
                    </label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        errors.email
                          ? "border-red-500 dark:border-red-400"
                          : "border-gray-200 dark:border-gray-700"
                      } text-xs focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600/25 dark:bg-gray-900 dark:text-white`}
                    />
                    {errors.email && (
                      <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Username
                    </label>
                    <input
                      name="username"
                      value={form.username}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        errors.username
                          ? "border-red-500 dark:border-red-400"
                          : "border-gray-200 dark:border-gray-700"
                      } text-xs focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600/25 dark:bg-gray-900 dark:text-white`}
                    />
                    {errors.username && (
                      <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                        {errors.username}
                      </p>
                    )}
                  </div>
                </div>
                {/* Right Column */}
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      User Type
                    </label>
                    <input
                      name="userType"
                      value={form.userType}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        errors.userType
                          ? "border-red-500 dark:border-red-400"
                          : "border-gray-200 dark:border-gray-700"
                      } text-xs focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600/25 dark:bg-gray-900 dark:text-white`}
                      placeholder="System Admin, Department Admin, etc."
                    />
                    {errors.userType && (
                      <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                        {errors.userType}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Application Access
                    </label>
                    <input
                      name="applicationAccess"
                      value={form.applicationAccess}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        errors.applicationAccess
                          ? "border-red-500 dark:border-red-400"
                          : "border-gray-200 dark:border-gray-700"
                      } text-xs focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600/25 dark:bg-gray-900 dark:text-white`}
                      placeholder="Dashboard, Reports, etc."
                    />
                    {errors.applicationAccess && (
                      <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                        {errors.applicationAccess}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      <FaUserShield className="inline mr-2" /> Added By (Admin Username)
                    </label>
                    <input
                      name="addedBy"
                      value={form.addedBy}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        errors.addedBy
                          ? "border-red-500 dark:border-red-400"
                          : "border-gray-200 dark:border-gray-700"
                      } text-xs focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600/25 dark:bg-gray-900 dark:text-white`}
                      placeholder="admin username"
                    />
                    {errors.addedBy && (
                      <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                        {errors.addedBy}
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
                <FaPlus className="inline mr-2" /> Add Admin
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
                  placeholder="Search by email, username, or name"
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
                  <FaPlus /> Add Admin
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
                    <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">First Name</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Name</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Username</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User Type</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date Added</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Added By</th>
                    <th className="px-2 py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">View</th>
                    <th className="px-2 py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Delete</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 text-xs">
                  {filteredAdmins.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="py-8 text-center text-gray-400 dark:text-gray-500 text-xs">
                        No admins found.
                      </td>
                    </tr>
                  ) : (
                    filteredAdmins.map((admin) => (
                      <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                        <td className="px-2 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300">{admin.id}</td>
                        <td className="px-2 py-2 whitespace-nowrap">
                          <img
                            src={admin.avatar || "/images/user/default.jpg"}
                            alt={admin.firstName}
                            className="w-6 h-6 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                          />
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap font-medium text-gray-800 dark:text-white">{admin.firstName}</td>
                        <td className="px-2 py-2 whitespace-nowrap font-medium text-gray-800 dark:text-white">{admin.lastName}</td>
                        <td className="px-2 py-2 whitespace-nowrap text-gray-600 dark:text-gray-300">{admin.email}</td>
                        <td className="px-2 py-2 whitespace-nowrap text-gray-600 dark:text-gray-300">{admin.username}</td>
                        <td className="px-2 py-2 whitespace-nowrap text-gray-600 dark:text-gray-300">{admin.userType}</td>
                        <td className="px-2 py-2 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold
                            ${admin.status === "Active"
                              ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                              : "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400"}
                          `}>{admin.status}</span>
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-gray-600 dark:text-gray-300">{admin.dateAdded}</td>
                        <td className="px-2 py-2 whitespace-nowrap text-gray-600 dark:text-gray-300">{admin.addedBy}</td>
                        <td className="px-2 py-2 whitespace-nowrap text-center">
                          <button
                            onClick={() => setViewAdmin(admin)}
                            className="inline-flex items-center justify-center p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            title="View admin details"
                          >
                            <FaEye size={14} />
                          </button>
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleDelete(admin.id)}
                            className="inline-flex items-center justify-center p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                            title="Delete admin"
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
