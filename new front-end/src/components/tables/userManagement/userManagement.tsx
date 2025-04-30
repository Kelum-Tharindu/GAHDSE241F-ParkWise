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
  FaLink,
  FaMoon,
  FaSun,
} from "react-icons/fa";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive";
  role: string;
  department: string;
  bio: string;
  linkedin: string;
  avatar: string;
  updated: string;
}

const initialUsers: User[] = [
  {
    id: 1,
    firstName: "Jeannette",
    lastName: "Prosacco",
    email: "Arnoldo.Bayer51@yahoo.com",
    phone: "+1 555-123-4567",
    status: "Active",
    role: "Admin",
    department: "Finance",
    bio: "Experienced admin with a passion for numbers.",
    linkedin: "https://linkedin.com/in/jeannette",
    avatar: "/images/user/user-1.jpg",
    updated: "21/09/2022",
  },
  {
    id: 2,
    firstName: "Janie",
    lastName: "Funk",
    email: "janie.funk@yahoo.com",
    phone: "+1 555-987-6543",
    status: "Active",
    role: "User",
    department: "HR",
    bio: "",
    linkedin: "",
    avatar: "/images/user/user-17.jpg",
    updated: "20/09/2022",
  },
  {
    id: 3,
    firstName: "Tonya",
    lastName: "Keeling",
    email: "tonya45@gmail.com",
    phone: "+1 555-222-3333",
    status: "Inactive",
    role: "Admin",
    department: "IT",
    bio: "",
    linkedin: "",
    avatar: "/images/user/user-17.jpg",
    updated: "20/09/2022",
  },
  {
    id: 4,
    firstName: "Ramiro",
    lastName: "Homenick",
    email: "ramiro.homenick@hotmail.com",
    phone: "+1 555-444-5555",
    status: "Active",
    role: "Analyst",
    department: "Analytics",
    bio: "",
    linkedin: "",
    avatar: "/images/user/user-17.jpg",
    updated: "21/09/2022",
  },
  {
    id: 5,
    firstName: "Dominick",
    lastName: "West",
    email: "dominick.west@hotmail.com",
    phone: "+1 555-666-7777",
    status: "Active",
    role: "User",
    department: "Support",
    bio: "",
    linkedin: "",
    avatar: "/images/user/user-5.jpg",
    updated: "20/09/2022",
  },
];

function StatusBadge({ status }: { status: User["status"] }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold
        ${status === "Active"
          ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
          : "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400"}
      `}
    >
      {status}
    </span>
  );
}

export default function UserManagementTable() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [viewUser, setViewUser] = useState<User | null>(null);

  const [form, setForm] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    department: string;
    bio: string;
    linkedin: string;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    bio: "",
    linkedin: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const isDark = localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
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
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    if (!form.department.trim()) errs.department = "Department is required";
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
    setUsers((prev) => [
      ...prev,
      {
        id: prev.length ? Math.max(...prev.map((u) => u.id)) + 1 : 1,
        ...form,
        status: "Active",
        role: "User",
        avatar: "/images/user/default.jpg",
        updated: new Date().toLocaleDateString(),
      },
    ]);
    setShowAddForm(false);
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      department: "",
      bio: "",
      linkedin: "",
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  // Only search by email
  const filteredUsers = useMemo(() => {
    const lower = search.trim().toLowerCase();
    if (!lower) return users;
    return users.filter((u) => u.email.toLowerCase().includes(lower));
  }, [users, search]);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen font-outfit">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-theme-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Theme toggle button */}
        <div className="flex justify-end items-center p-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            aria-label="Toggle theme"
          >
            {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700" />}
          </button>
        </div>
        {viewUser ? (
          <div className="p-8 flex flex-col items-center">
            <img
              src={viewUser.avatar}
              alt={`${viewUser.firstName} ${viewUser.lastName}`}
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 mb-4"
            />
            <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{viewUser.firstName} {viewUser.lastName}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs w-full max-w-xl">
              <div>
                <span className="font-semibold text-gray-600 dark:text-gray-400">ID:</span> {viewUser.id}
              </div>
              <div>
                <span className="font-semibold text-gray-600 dark:text-gray-400">Email:</span> {viewUser.email}
              </div>
              <div>
                <span className="font-semibold text-gray-600 dark:text-gray-400">Role:</span> {viewUser.role}
              </div>
              <div>
                <span className="font-semibold text-gray-600 dark:text-gray-400">Status:</span>{" "}
                <StatusBadge status={viewUser.status} />
              </div>
              <div>
                <span className="font-semibold text-gray-600 dark:text-gray-400">Phone:</span> {viewUser.phone}
              </div>
              <div>
                <span className="font-semibold text-gray-600 dark:text-gray-400">Department:</span> {viewUser.department}
              </div>
              <div>
                <span className="font-semibold text-gray-600 dark:text-gray-400">Updated:</span> {viewUser.updated}
              </div>
              <div>
                <span className="font-semibold text-gray-600 dark:text-gray-400">LinkedIn:</span>{" "}
                {viewUser.linkedin ? (
                  <a href={viewUser.linkedin} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
                    {viewUser.linkedin}
                  </a>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </div>
              <div className="sm:col-span-2">
                <span className="font-semibold text-gray-600 dark:text-gray-400">Bio:</span> {viewUser.bio || <span className="text-gray-400">N/A</span>}
              </div>
            </div>
            <button
              className="mt-8 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 text-xs font-medium"
              onClick={() => setViewUser(null)}
            >
              Back to Table
            </button>
          </div>
        ) : showAddForm ? (
          <form onSubmit={handleFormSubmit} className="p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90">Register New User</h2>
            {/* Personal Info Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b dark:border-gray-700 pb-2">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
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
                    } focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600/25 dark:bg-gray-900 dark:text-white`}
                  />
                  {errors.firstName && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    <FaUser className="inline mr-2" /> Last Name
                  </label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.lastName
                        ? "border-red-500 dark:border-red-400"
                        : "border-gray-200 dark:border-gray-700"
                    } focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600/25 dark:bg-gray-900 dark:text-white`}
                  />
                  {errors.lastName && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>
            </div>
            {/* Contact Info Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b dark:border-gray-700 pb-2">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    <FaEnvelope className="inline mr-2" /> Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      errors.email
                        ? "border-red-500 dark:border-red-400"
                        : "border-gray-200 dark:border-gray-700"
                    } focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600/25 dark:bg-gray-900 dark:text-white`}
                  />
                  {errors.email && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
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
                    } focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600/25 dark:bg-gray-900 dark:text-white`}
                  />
                  {errors.phone && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>
            {/* Department */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b dark:border-gray-700 pb-2">Department</h3>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  <FaBuilding className="inline mr-2" /> Department
                </label>
                <input
                  name="department"
                  value={form.department}
                  onChange={handleFormChange}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.department
                      ? "border-red-500 dark:border-red-400"
                      : "border-gray-200 dark:border-gray-700"
                  } focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600/25 dark:bg-gray-900 dark:text-white`}
                />
                {errors.department && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.department}</p>}
              </div>
            </div>
            {/* Additional Info Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b dark:border-gray-700 pb-2">Additional Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  <FaLink className="inline mr-2" /> LinkedIn Profile
                </label>
                <input
                  name="linkedin"
                  value={form.linkedin}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600/25 dark:bg-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600/25 dark:bg-gray-900 dark:text-white"
                />
              </div>
            </div>
            {/* Form Actions */}
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Register User
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
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
                  <FaPlus /> Add User
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
                    <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Updated</th>
                    <th className="px-2 py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">View</th>
                    <th className="px-2 py-2 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Delete</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 text-xs">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-gray-400 dark:text-gray-500 text-xs">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                        <td className="px-2 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300">{user.id}</td>
                        <td className="px-2 py-2 whitespace-nowrap">
                          <img
                            src={user.avatar || "/images/user/default.jpg"}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="w-6 h-6 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                          />
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap font-medium text-gray-800 dark:text-white">{user.firstName} {user.lastName}</td>
                        <td className="px-2 py-2 whitespace-nowrap text-gray-600 dark:text-gray-300">{user.email}</td>
                        <td className="px-2 py-2 whitespace-nowrap">
                          <StatusBadge status={user.status} />
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-gray-600 dark:text-gray-300">{user.updated}</td>
                        <td className="px-2 py-2 whitespace-nowrap text-center">
                          <button
                            onClick={() => setViewUser(user)}
                            className="inline-flex items-center justify-center p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            title="View user details"
                          >
                            <FaEye size={14} />
                          </button>
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="inline-flex items-center justify-center p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                            title="Delete user"
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
