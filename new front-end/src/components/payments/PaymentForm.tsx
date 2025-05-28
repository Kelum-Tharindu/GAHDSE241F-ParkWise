import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface Landowner {
  _id: string;
  username: string;
}

interface PaymentFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onClose, onSuccess }) => {
  const [landowners, setLandowners] = useState<Landowner[]>([]);
  const [landownerId, setLandownerId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [status, setStatus] = useState("Pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("[PaymentForm] Fetching landowners from /api/landowners/all");
    fetch("/api/landowners/all")
      .then((res) => {
        console.log("[PaymentForm] Response status for landowners:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("[PaymentForm] Landowners data received:", data);
        setLandowners(data);
      })
      .catch((err) => {
        console.log("[PaymentForm] Error fetching landowners:", err);
        setLandowners([]);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        type: "billing",
        amount: Number(amount),
        method,
        status,
        billingId: landownerId,
        date: new Date(),
      };
      console.log("[PaymentForm] Sending payment payload:", payload);
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log("[PaymentForm] Payment response status:", res.status);
      const resData = await res.json().catch(() => undefined);
      console.log("[PaymentForm] Payment response data:", resData);
      if (!res.ok) throw new Error("Failed to save transaction");
      onSuccess();
      onClose();
    } catch (err) {
      console.log("[PaymentForm] Error during payment:", err);
      setError("Failed to save transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setStatus("Cancelled");
    setLoading(true);
    setError("");
    try {
      const payload = {
        type: "billing",
        amount: Number(amount),
        method,
        status: "Cancelled",
        billingId: landownerId,
        date: new Date(),
      };
      console.log("[PaymentForm] Sending cancel payload:", payload);
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log("[PaymentForm] Cancel response status:", res.status);
      const resData = await res.json().catch(() => undefined);
      console.log("[PaymentForm] Cancel response data:", resData);
      if (!res.ok) throw new Error("Failed to save transaction");
      onSuccess();
      onClose();
    } catch (err) {
      console.log("[PaymentForm] Error during cancel:", err);
      setError("Failed to save transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <form className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center border border-gray-200" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Pay Landowner</h2>
        <div className="mb-4 text-left">
          <Label htmlFor="landowner">Landowner</Label>
          <select
            id="landowner"
            className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-50 dark:bg-[#232b39] text-gray-900 dark:text-white border-gray-200 dark:border-[#444c5e] focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={landownerId}
            onChange={(e) => setLandownerId(e.target.value)}
            required
          >
            <option value="" className="bg-white dark:bg-[#232b39] text-gray-900 dark:text-white">Select Landowner</option>
            {landowners.map((l) => (
              <option key={l._id} value={l._id} className="bg-white dark:bg-[#232b39] text-gray-900 dark:text-white">{l.username}</option>
            ))}
          </select>
        </div>
        <div className="mb-4 text-left">
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)} required />
        </div>
        <div className="mb-4 text-left">
          <Label htmlFor="method">Method</Label>
          <Input id="method" type="text" value={method} onChange={e => setMethod(e.target.value)} required />
        </div>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="flex gap-4 justify-center mt-6">
          <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">{loading ? "Paying..." : "Pay"}</Button>
          <Button type="button" onClick={handleCancel} disabled={loading} className="bg-gray-400 hover:bg-gray-500 text-white">Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
