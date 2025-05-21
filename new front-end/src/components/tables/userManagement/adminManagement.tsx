import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
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
  FaExclamationTriangle,
  FaCheck,
  FaEdit,
} from "react-icons/fa";

interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone?: string;
  country?: string;
  city?: string;
  postalCode?: string;
  taxId?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

interface AdminFormData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  role: string;
  phone: string;
  country: string;
  city: string;
  postalCode: string;
  addedBy: string;
  notes: string;
}

export default function AdminManagementTable() {
  const [admins, setAdmins] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewAdmin, setViewAdmin] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const initialFormState: AdminFormData = {
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    role: "admin",
    phone: "",
    country: "",
    city: "",
    postalCode: "",
    addedBy: "",
    notes: "",
  };

  const [form, setForm] = useState<AdminFormData>(initialFormState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/users/role/admin');
      if (response.data.success) {
        setAdmins(response.data.data);
      } else {
        setError("Failed to fetch admins");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching admins:", err);
      setError("Failed to fetch admins. Please try again later.");
      setLoading(false);
    }
  };

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
    if (!isEditMode && !form.password.trim()) errs.password = "Password is required";
    else if (!isEditMode && form.password.length < 6) errs.password = "Password must be at least 6 characters";
    return errs;
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (isEditMode && viewAdmin) {
        // Update existing admin
        const response = await axios.put(`http://localhost:5000/api/users/${viewAdmin._id}`, {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          username: form.username,
          phone: form.phone,
          country: form.country,
          city: form.city,
          postalCode: form.postalCode,
          ...(form.password && { password: form.password }),
        });

        if (response.data.success) {
          setSuccessMessage("Admin updated successfully");
          fetchAdmins();
          setShowAddForm(false);
          setIsEditMode(false);
          resetForm();
          
          // Auto dismiss success message after 3 seconds
          setTimeout(() => {
            setSuccessMessage(null);
          }, 3000);
        }
      } else {
        // Create new admin
        const response = await axios.post('http://localhost:5000/api/users', {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          username: form.username,
          password: form.password,
          role: "admin",
          phone: form.phone,
          country: form.country,
          city: form.city,
          postalCode: form.postalCode,
          addedBy: form.addedBy,
        });

        if (response.data.success) {
          setSuccessMessage("Admin created successfully");
          fetchAdmins();
          setShowAddForm(false);
          resetForm();
          
          // Auto dismiss success message after 3 seconds
          setTimeout(() => {
            setSuccessMessage(null);
          }, 3000);
        }
      }
    } catch (err: any) {
      console.error("Error saving admin:", err);
      setError(err.response?.data?.message || "Failed to save admin. Please try again.");
      
      // Auto dismiss error message after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  const resetForm = () => {
    setForm(initialFormState);
    setErrors({});
  };

  const handleEdit = (admin: User) => {
    setForm({
      firstName: admin.firstName || "",
      lastName: admin.lastName || "",
      email: admin.email || "",
      username: admin.username || "",
      password: "", // Don't populate password for security
      role: "admin",
      phone: admin.phone || "",
      country: admin.country || "",
      city: admin.city || "",
      postalCode: admin.postalCode || "",
      addedBy: admin.createdBy || "",
      notes: "",
    });
    setViewAdmin(admin);
    setIsEditMode(true);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/users/${id}`);
        
        if (response.data.success) {
          setSuccessMessage(`${name} deleted successfully`);
          setAdmins((prev) => prev.filter((admin) => admin._id !== id));
          
          // Auto dismiss success message after 3 seconds
          setTimeout(() => {
            setSuccessMessage(null);
          }, 3000);
        }
      } catch (err: any) {
        console.error("Error deleting admin:", err);
        setError(err.response?.data?.message || "Failed to delete admin. Please try again.");
        
        // Auto dismiss error message after 5 seconds
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
    }
  };

  const filteredAdmins = useMemo(() => {
    const lower = search.trim().toLowerCase();
    if (!lower) return admins;
    return admins.filter((admin) =>
      admin.email?.toLowerCase().includes(lower) ||
      admin.username?.toLowerCase().includes(lower) ||
      admin.firstName?.toLowerCase().includes(lower) ||
      admin.lastName?.toLowerCase().includes(lower)
    );
  }, [admins, search]);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

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

        {/* Success/Error Messages */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center dark:bg-red-900/30 dark:text-red-400">
            <FaExclamationTriangle className="mr-2" /> {error}
          </div>
        )}
        
        {successMessage && (
          <div className="mx-4 mt-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center dark:bg-green-900/30 dark:text-green-400">
            <FaCheck className="mr-2" /> {successMessage}
          </div>
        )}

        {viewAdmin && !showAddForm ? (
          <div className="p-8">
            <button
              className="mb-6 flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 text-xs font-medium"
              onClick={() => setViewAdmin(null)}
            >
              <FaArrowLeft /> Back to Table
            </button>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                  <FaUser className="w-16 h-16 text-blue-500 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                  {viewAdmin.firstName} {viewAdmin.lastName}
                </h2>
                <span className="px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400">
                  Active
                </span>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEdit(viewAdmin)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-xs font-medium"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(viewAdmin._id, `${viewAdmin.firstName} ${viewAdmin.lastName}`)}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-xs font-medium"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div className="flex items-center gap-2">
                  <FaIdCard className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">ID</p>
                    <p className="font-medium text-gray-800 dark:text-white">{viewAdmin._id}</p>
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
                    <p className="text-xs text-gray-500 dark:text-gray-400">Role</p>
                    <p className="font-medium text-gray-800 dark:text-white">{viewAdmin.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaClipboardList className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="font-medium text-gray-800 dark:text-white">{viewAdmin.phone || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaClipboardList className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {viewAdmin.city && viewAdmin.country ? `${viewAdmin.city}, ${viewAdmin.country}` : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaUserShield className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Added By</p>
                    <p className="font-medium text-gray-800 dark:text-white">{viewAdmin.createdBy || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaClipboardList className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Created On</p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {new Date(viewAdmin.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : showAddForm ? (
          <form onSubmit={handleFormSubmit} className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                {isEditMode ? 'Edit Admin' : 'Add New Admin'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setIsEditMode(false);
                  resetForm();
                }}
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
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Password {isEditMode && "(Leave blank to keep current password)"}
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        errors.password
                          ? "border-red-500 dark:border-red-400"
                          : "border-gray-200 dark:border-gray-700"
                      } text-xs focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600/25 dark:bg-gray-900 dark:text-white`}
                    />
                    {errors.password && (
                      <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>
                {/* Right Column */}
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Phone
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600/25 dark:bg-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Country
                    </label>
                    <input
                      name="country"
                      value={form.country}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600/25 dark:bg-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      City
                    </label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600/25 dark:bg-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Postal Code
                    </label>
                    <input
                      name="postalCode"
                      value={form.postalCode}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600/25 dark:bg-gray-900 dark:text-white"
                    />
                  </div>
                  {!isEditMode && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        <FaUserShield className="inline mr-2" /> Added By (Admin Username)
                      </label>
                      <input
                        name="addedBy"
                        value={form.addedBy}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600/25 dark:bg-gray-900 dark:text-white"
                        placeholder="Your username"
                      />
                    </div>
                  )}
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
                onClick={() => {
                  setShowAddForm(false);
                  setIsEditMode(false);
                  resetForm();
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                {isEditMode ? 'Update Admin' : 'Add Admin'}
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
                  onClick={() => {
                    setShowAddForm(true);
                    setIsEditMode(false);
                    resetForm();
                  }}
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
                    <th scope="col" className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                    <th scope="col" className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Username</th>
                    <th scope="col" className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</th>
                    <th scope="col" className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                    <th scope="col" className="px-2 py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 text-xs">
                  {filteredAdmins.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-400 dark:text-gray-500 text-xs">
                        No admins found.
                      </td>
                    </tr>
                  ) : (
                    filteredAdmins.map((admin) => (
                      <tr key={admin._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                        <td className="px-2 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300">{admin._id.substring(0, 8)}...</td>
                        <td className="px-2 py-2 whitespace-nowrap font-medium text-gray-800 dark:text-white">
                          {admin.firstName} {admin.lastName}
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-gray-600 dark:text-gray-300">{admin.email}</td>
                        <td className="px-2 py-2 whitespace-nowrap text-gray-600 dark:text-gray-300">{admin.username}</td>
                        <td className="px-2 py-2 whitespace-nowrap text-gray-600 dark:text-gray-300">{admin.phone || 'N/A'}</td>
                        <td className="px-2 py-2 whitespace-nowrap text-gray-600 dark:text-gray-300">
                          {new Date(admin.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => setViewAdmin(admin)}
                              className="inline-flex items-center justify-center p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                              title="View admin details"
                            >
                              <FaEye size={14} />
                            </button>
                            <button
                              onClick={() => handleEdit(admin)}
                              className="inline-flex items-center justify-center p-2 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400"
                              title="Edit admin"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(admin._id, `${admin.firstName} ${admin.lastName}`)}
                              className="inline-flex items-center justify-center p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                              title="Delete admin"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
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
