import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Sun,
  Moon,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Users,
  ParkingCircle,
  Calendar,
  MapPin,
  Building,
  Tag,
  ClipboardList,
} from "lucide-react";
import { useUser } from "../../../context/UserContext";

type ParkingOption = { id: string; name: string; available: number };
type FormState = {
  parkingId: string;
  chunkName: string;
  company: string;
  totalSpots: number;
  validFrom: string;
  validTo: string;
  remarks: string;
};

// Define BulkBooking type based on backend model
type BulkBooking = {
  _id: string;
  user: string | { email: string; _id: string }; // User can be ID or populated object
  purchaseDate: string;
  parkingName: string;
  chunkName: string;
  company: string;
  totalSpots: number;
  usedSpots: number;
  availableSpots: number;
  validFrom: string;
  validTo: string;
  status: string;
  remarks?: string;
  vehicleType?: string;
  qrImage?: string;
};

const parkingOptions: ParkingOption[] = [
  { id: "colombo", name: "Colombo Fort Parking", available: 100 },
  { id: "kandy", name: "Kandy Lake Parking", available: 60 },
  { id: "galle", name: "Galle Face Green", available: 80 },
];

const companyOptions = [
  "Acme Corp",
  "Beta Solutions",
  "Omega Ltd",
  "Gamma Innovations",
];

export default function PurchaseParkingChunk() {
  const { user, loading: userLoading } = useUser(); // Get user from context
  const [darkMode, setDarkMode] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({
    parkingId: "",
    chunkName: "",
    company: "",
    totalSpots: 1,
    validFrom: "",
    validTo: "",
    remarks: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  // State for fetched bulk booking chunks
  const [fetchedChunks, setFetchedChunks] = useState<BulkBooking[]>([]);
  const [chunksLoading, setChunksLoading] = useState<boolean>(true);

  useEffect(() => {
    const isDark =
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  // useEffect to fetch bulk booking chunks based on user role
  useEffect(() => {
    const fetchChunks = async () => {
      if (userLoading || !user || !user._id) {
        // Wait for user data to be loaded or if no user is logged in.
        // Set loading to false if there's no user to prevent infinite loading state.
        if (!userLoading && !user?._id) {
          setChunksLoading(false);
          setFetchedChunks([]); // Clear any existing chunks
        }
        return;
      }

      setChunksLoading(true);
      let apiUrl = "";
      // Using "admin" and "Event Coordinator" as role names. Adjust if different in your system.
      if (user.role === "admin") {
        apiUrl = "http://localhost:5000/api/bulkbooking";
      } else if (user.role === "Event Coordinator") { 
        apiUrl = `http://localhost:5000/api/bulkbooking/user/${user._id}`;
      } else {
        console.warn("User role not recognized for fetching bulk bookings:", user.role);
        setFetchedChunks([]);
        setChunksLoading(false);
        return;
      }

      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Include Authorization header if your API requires it (e.g., JWT token)
            // "Authorization": `Bearer ${your_auth_token_here}`,
          },
          credentials: "include", // Important if using cookies for session management
        });
        if (!response.ok) {
          const errorData = await response.text(); // Or response.json() if error is JSON
          throw new Error(`Failed to fetch bulk bookings: ${response.statusText} (status: ${response.status}) - ${errorData}`);
        }
        const data: BulkBooking[] = await response.json();
        setFetchedChunks(data);
      } catch (error) {
        console.error("Error fetching bulk bookings:", error);
        setFetchedChunks([]); // Clear chunks on error
      } finally {
        setChunksLoading(false);
      }
    };

    fetchChunks();
  }, [user, userLoading]); // Rerun when user or its loading state changes

  const toggleTheme = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.theme = newDark ? "dark" : "light";
  };

  const parking = parkingOptions.find((p) => p.id === form.parkingId);

  const validateStep = (): boolean => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (step === 1) {
      if (!form.parkingId) errs.parkingId = "Select a parking location";
      if (!form.chunkName.trim()) errs.chunkName = "Enter a chunk name";
      if (!form.company) errs.company = "Select a company";
    }
    if (step === 2) {
      if (!form.totalSpots || form.totalSpots < 1)
        errs.totalSpots = "Choose at least 1 spot";
      if (parking && form.totalSpots > parking.available)
        errs.totalSpots = `Only ${parking.available} spots available`;
    }
    if (step === 3) {
      if (!form.validFrom) errs.validFrom = "Select a start date";
      if (!form.validTo) errs.validTo = "Select an end date";
      if (form.validFrom && form.validTo && form.validFrom > form.validTo)
        errs.validTo = "End date must be after start date";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "totalSpots" ? Number(value) : value,
    }));
    setErrors((errs) => ({ ...errs, [name]: "" }));
  };

  const handleSlider = (v: number) => {
    setForm((f) => ({ ...f, totalSpots: v }));
    setErrors((errs) => ({ ...errs, totalSpots: "" }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateStep()) {
      setSubmitted(true);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const renderStepIcon = (stepNum: number) => {
    if (stepNum === 1) return <MapPin size={18} />;
    if (stepNum === 2) return <Tag size={18} />;
    if (stepNum === 3) return <Calendar size={18} />;
    if (stepNum === 4) return <ClipboardList size={18} />;
    return null;
  };

  const stepTitles = [
    "Location Details",
    "Spot Allocation",
    "Validity Period",
    "Review & Confirm"
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 dark:from-green-950 dark:to-green-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ParkingCircle className="text-white" size={24} />
            <span className="text-xl font-bold text-white tracking-wide">Purchase Parking Spots</span>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Section to display fetched bulk bookings */}
        <div className="mb-8 p-6 border rounded-xl bg-white dark:bg-gray-800 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Your Purchased Parking Chunks</h2>
          {userLoading && <p className="text-gray-600 dark:text-gray-400">Loading user information...</p>}
          {chunksLoading && !userLoading && <p className="text-gray-600 dark:text-gray-400">Loading purchased chunks...</p>}
          {!userLoading && !user?._id && <p className="text-gray-600 dark:text-gray-400">Please log in to view your purchased chunks.</p>}
          {!chunksLoading && !userLoading && user?._id && fetchedChunks.length === 0 && (
            <p className="text-gray-600 dark:text-gray-400">No purchased chunks found for your account.</p>
          )}
          {!chunksLoading && user?._id && fetchedChunks.length > 0 && (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2"> {/* Scrollable area */}
              {fetchedChunks.map(chunk => (
                <div key={chunk._id} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-lg text-green-700 dark:text-green-400">{chunk.chunkName}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300"><span className="font-medium">Parking:</span> {chunk.parkingName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-medium">Company:</span> {chunk.company}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-medium">Total Spots:</span> {chunk.totalSpots}, <span className="font-medium">Available:</span> {chunk.availableSpots}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-medium">Status:</span> <span className={`font-semibold ${chunk.status === 'active' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>{chunk.status}</span></p>
                  <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-medium">Valid:</span> {formatDate(chunk.validFrom)} to {formatDate(chunk.validTo)}</p>
                  {chunk.remarks && <p className="text-xs italic text-gray-500 dark:text-gray-400 mt-1">Remarks: {chunk.remarks}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Existing Stepper and Form for purchasing new chunks */}
        <div className="mb-8 p-6 border rounded-xl bg-white dark:bg-gray-800 shadow-lg">
           <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Purchase New Parking Chunk</h2>
          {/* Stepper */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`flex flex-col items-center ${s <= step ? "text-green-900 dark:text-green-400" : "text-gray-400"}`}
                  style={{ width: `${100 / 4}%` }}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium mb-2 transition-all
                      ${step > s
                        ? "bg-green-200 text-green-900 dark:bg-green-900/60 dark:text-green-300"
                        : step === s
                          ? "bg-green-900 text-white dark:bg-green-700"
                          : "bg-gray-100 dark:bg-gray-800"}`}
                  >
                    {step > s ? <CheckCircle size={18} /> : renderStepIcon(s)}
                  </div>
                  <span className="text-xs font-medium text-center hidden sm:block">{stepTitles[s - 1]}</span>
                </div>
              ))}
            </div>
            <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full w-full relative">
              <div
                className="absolute top-0 left-0 h-1 bg-green-900 dark:bg-green-500 rounded-full transition-all duration-300"
                style={{ width: `${((step - 1) / (4 - 1)) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main form */}
            <div className="flex-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 border-b border-gray-100 dark:border-gray-700">
                  <h2 className="text-lg font-bold">{stepTitles[step - 1]}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {step === 1 && "Choose the parking location and company details"}
                    {step === 2 && "Select how many parking spots you need"}
                    {step === 3 && "Set the period for which you need these spots"}
                    {step === 4 && "Review your purchase details before confirming"}
                  </p>
                </div>
                <form
                  className="p-6 space-y-6"
                  autoComplete="off"
                  onSubmit={handleSubmit}
                >
                  {/* Step 1: Chunk Details */}
                  {step === 1 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Parking Location
                        </label>
                        <select
                          name="parkingId"
                          value={form.parkingId}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.parkingId
                              ? "border-red-500 dark:border-red-400"
                              : "border-gray-200 dark:border-gray-700"
                          } focus:ring-2 focus:ring-green-900 dark:bg-gray-900 text-sm transition-shadow`}
                        >
                          <option value="">Select parking location...</option>
                          {parkingOptions.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.available} available)
                            </option>
                          ))}
                        </select>
                        {errors.parkingId && (
                          <div className="text-xs text-red-500 mt-1">{errors.parkingId}</div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Chunk Name
                        </label>
                        <input
                          name="chunkName"
                          value={form.chunkName}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.chunkName
                              ? "border-red-500 dark:border-red-400"
                              : "border-gray-200 dark:border-gray-700"
                          } focus:ring-2 focus:ring-green-900 dark:bg-gray-900 text-sm transition-shadow`}
                          placeholder="e.g. Morning Shift May"
                        />
                        {errors.chunkName && (
                          <div className="text-xs text-red-500 mt-1">{errors.chunkName}</div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Company
                        </label>
                        <select
                          name="company"
                          value={form.company}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.company
                              ? "border-red-500 dark:border-red-400"
                              : "border-gray-200 dark:border-gray-700"
                          } focus:ring-2 focus:ring-green-900 dark:bg-gray-900 text-sm transition-shadow`}
                        >
                          <option value="">Select company...</option>
                          {companyOptions.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        {errors.company && (
                          <div className="text-xs text-red-500 mt-1">{errors.company}</div>
                        )}
                      </div>
                    </div>
                  )}
                  {/* Step 2: Spot Allocation */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div className="text-center mb-2">
                          <span className="text-4xl font-bold text-green-900 dark:text-green-400">{form.totalSpots}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">spots selected</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={parking?.available || 100}
                          value={form.totalSpots}
                          onChange={(e) => handleSlider(Number(e.target.value))}
                          className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-900 dark:bg-green-800"
                        />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>1</span>
                          <span>{parking?.available || 100}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Number of Spots
                        </label>
                        <input
                          name="totalSpots"
                          type="number"
                          min={1}
                          max={parking?.available || 100}
                          value={form.totalSpots}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.totalSpots
                              ? "border-red-500 dark:border-red-400"
                              : "border-gray-200 dark:border-gray-700"
                          } focus:ring-2 focus:ring-green-900 dark:bg-gray-900 text-sm transition-shadow`}
                        />
                        {errors.totalSpots && (
                          <div className="text-xs text-red-500 mt-1">{errors.totalSpots}</div>
                        )}
                      </div>
                    </div>
                  )}
                  {/* Step 3: Validity */}
                  {step === 3 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Valid From
                          </label>
                          <input
                            name="validFrom"
                            type="date"
                            value={form.validFrom}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg border ${
                              errors.validFrom
                                ? "border-red-500 dark:border-red-400"
                                : "border-gray-200 dark:border-gray-700"
                            } focus:ring-2 focus:ring-green-900 dark:bg-gray-900 text-sm transition-shadow`}
                          />
                          {errors.validFrom && (
                            <div className="text-xs text-red-500 mt-1">{errors.validFrom}</div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Valid To
                          </label>
                          <input
                            name="validTo"
                            type="date"
                            value={form.validTo}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg border ${
                              errors.validTo
                                ? "border-red-500 dark:border-red-400"
                                : "border-gray-200 dark:border-gray-700"
                            } focus:ring-2 focus:ring-green-900 dark:bg-gray-900 text-sm transition-shadow`}
                          />
                          {errors.validTo && (
                            <div className="text-xs text-red-500 mt-1">{errors.validTo}</div>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Remarks (optional)
                        </label>
                        <textarea
                          name="remarks"
                          value={form.remarks}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-900 dark:bg-gray-900 text-sm transition-shadow"
                          rows={3}
                          placeholder="Add any additional notes or instructions..."
                        />
                      </div>
                    </div>
                  )}
                  {/* Step 4: Review & Submit */}
                  {step === 4 && (
                    <div className="space-y-6">
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">Purchase Summary</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-gray-600 dark:text-gray-400">Parking Location</span>
                            <span className="font-medium">{parking?.name || "-"}</span>
                          </div>
                          <div className="flex justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-gray-600 dark:text-gray-400">Chunk Name</span>
                            <span className="font-medium">{form.chunkName || "-"}</span>
                          </div>
                          <div className="flex justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-gray-600 dark:text-gray-400">Company</span>
                            <span className="font-medium">{form.company || "-"}</span>
                          </div>
                          <div className="flex justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-gray-600 dark:text-gray-400">Number of Spots</span>
                            <span className="font-medium">{form.totalSpots}</span>
                          </div>
                          <div className="flex justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-gray-600 dark:text-gray-400">Validity Period</span>
                            <span className="font-medium">
                              {formatDate(form.validFrom)} - {formatDate(form.validTo)}
                            </span>
                          </div>
                          {form.remarks && (
                            <div className="pt-2">
                              <span className="text-gray-600 dark:text-gray-400 block mb-2">Remarks:</span>
                              <p className="text-sm bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">{form.remarks}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Bottom navigation */}
                  {!submitted && (
                    <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                      {step > 1 ? (
                        <button
                          type="button"
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium text-sm"
                          onClick={prevStep}
                        >
                          <ArrowLeft size={16} /> Back
                        </button>
                      ) : (
                        <div></div>
                      )}
                      {step < 4 ? (
                        <button
                          type="button"
                          className="flex items-center gap-2 px-6 py-2 bg-green-900 hover:bg-green-800 text-white rounded-lg transition font-medium text-sm shadow-sm"
                          onClick={nextStep}
                        >
                          Continue <ArrowRight size={16} />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="flex items-center gap-2 px-6 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg transition font-medium text-sm shadow-sm"
                        >
                          Confirm Purchase <CheckCircle size={16} />
                        </button>
                      )}
                    </div>
                  )}
                  {/* Confirmation */}
                  {submitted && (
                    <div className="flex flex-col items-center py-12">
                      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
                        <CheckCircle className="text-green-900 dark:text-green-400" size={32} />
                      </div>
                      <div className="text-2xl font-bold mb-2 text-green-900 dark:text-green-200">Purchase Successful!</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 text-center mb-8 max-w-md">
                        Your parking spot chunk has been created successfully. You can now allocate spots to your company's employees or customers.
                      </div>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium text-sm"
                          onClick={() => window.location.href = "#"}
                        >
                          View Dashboard
                        </button>
                        <button
                          type="button"
                          className="px-4 py-2 bg-green-900 hover:bg-green-800 text-white rounded-lg transition font-medium text-sm shadow-sm"
                          onClick={() => {
                            setForm({
                              parkingId: "",
                              chunkName: "",
                              company: "",
                              totalSpots: 1,
                              validFrom: "",
                              validTo: "",
                              remarks: "",
                            });
                            setStep(1);
                            setSubmitted(false);
                          }}
                        >
                          Purchase Another
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
            {/* Live Summary Card */}
            <div className="w-full lg:w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 h-fit sticky top-24">
              <div className="p-6">
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4 flex items-center">
                  <ClipboardList size={16} className="mr-2" />
                  Live Summary
                </div>
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-green-900 dark:text-green-400" size={16} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Parking Location</div>
                      <div className="font-medium">{parking?.name || "-"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                      <Building className="text-green-900 dark:text-green-400" size={16} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Company</div>
                      <div className="font-medium">{form.company || "-"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                      <Tag className="text-green-900 dark:text-green-400" size={16} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Chunk Name</div>
                      <div className="font-medium">{form.chunkName || "-"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                      <Users className="text-green-900 dark:text-green-400" size={16} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Spots</div>
                      <div className="font-medium">{form.totalSpots}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                      <Calendar className="text-green-900 dark:text-green-400" size={16} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Validity Period</div>
                      <div className="font-medium">
                        {formatDate(form.validFrom)} - {formatDate(form.validTo)}
                      </div>
                    </div>
                  </div>
                </div>
                {form.parkingId && form.company && form.totalSpots > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Total Price</div>
                        <div className="text-xl font-bold text-green-900 dark:text-green-400">
                          ${(form.totalSpots * 25).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        $25 per spot
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
