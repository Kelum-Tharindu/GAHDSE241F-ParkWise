// import React, { useState } from "react"
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// export function RegisterForm({
//   className,
//   ...props
// }: React.ComponentPropsWithoutRef<"form">) {
//   const [role, setRole] = useState("user")

//   return (
//     <form className={cn("flex flex-col gap-6", className)} {...props}>
//       <div className="flex flex-col items-center gap-2 text-center">
//         <h1 className="text-2xl font-bold">Register to your account</h1>
//         <p className="text-balance text-sm text-muted-foreground">
//           Fill these fields to create your account
//         </p>
//       </div>
//       <div className="grid gap-6">
        

//         <div className="flex justify-center">
//         <RadioGroup defaultValue="user" className="flex flex-row items-center gap-6" value={role} onValueChange={setRole} >
//             <div className="flex items-center gap-2">
//             <RadioGroupItem value="user" id="user" />
//             <Label htmlFor="user">User</Label>
//             </div>
//             <div className="flex items-center gap-2">
//             <RadioGroupItem value="landowner" id="landowner" />
//             <Label htmlFor="landowner">Land Owner</Label>
//             </div>
//         </RadioGroup>
//         </div>

//         <div className="grid gap-2">
//           <Label htmlFor="email">Email</Label>
//           <Input id="email" type="email" placeholder="m@example.com" required />
//         </div>
//         <div className="grid gap-2">
//           <Label htmlFor="username">Username</Label>
//           <Input id="username" type="text" placeholder="johndoe123" required />
//         </div>
//         <div className="grid gap-2">
//           <Label htmlFor="password">Password</Label>
//           <Input id="password" type="password" required />
//         </div>
//         <div className="grid gap-2">
//           <Label htmlFor="confirm-password">Confirm Password</Label>
//           <Input id="confirm-password" type="password" required />
//         </div>

//         {role === "landowner" && (
//           <div className="grid gap-2">
//             <Label htmlFor="address">Address</Label>
//             <Input id="address" type="text" placeholder="123 Green Road, City" required />
//           </div>
//         )}

//         <Button type="submit" className="w-full">
//           SignUp
//         </Button>

//         <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
//           <span className="relative z-10 bg-background px-2 text-muted-foreground">
//             Or continue with
//           </span>
//         </div>

//         <Button variant="outline" className="w-full">
//           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
//             <path
//               d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
//               fill="currentColor"
//             />
//           </svg>
//           SignUp with Google
//         </Button>
//       </div>
//       <div className="text-center text-sm">
//         Already have an account?{" "}
//         <a href="/signin" className="underline underline-offset-4">
//           Login
//         </a>
//       </div>
//     </form>
//   )
// }

import React, { useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import PopupMessage from "./PopupMessage";

type Role = "user" | "landowner" | "";

interface RegisterFormProps extends React.ComponentPropsWithoutRef<"form"> {}

interface RegisterFormState {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

// Backend URL configuration - this should be from environment variables in production
const BACKEND_URL = "http://localhost:5000";

export function RegisterForm({ className, ...props }: RegisterFormProps) {
  const [role, setRole] = useState<Role>("");
  const [form, setForm] = useState<RegisterFormState>({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!form.email || !form.username || !form.password || !form.confirmPassword || !role) {
      setError("All fields are required.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        email: form.email.trim(),
        username: form.username.trim(),
        password: form.password,
        role,
      };
      // Log the payload for debugging
      console.log("Register payload:", payload);
      
      // Using the full backend URL for the API endpoint
      const res = await axios.post<{ message: string }>(
        `${BACKEND_URL}/api/auth/register`, 
        payload, 
        {
          headers: { 
            "Content-Type": "application/json"
          }
        }
      );
      
      setSuccess(res.data.message || "Registration successful!");
      setForm({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      });
      setRole("");
      setShowPopup(true);
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showPopup && (
        <PopupMessage
          message={success || "Registration successful!"}
          onClose={() => {
            setShowPopup(false);
            window.location.href = "/";
          }}
        />
      )}
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={handleSubmit}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Register to your account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Fill these fields to create your account
          </p>
        </div>
        <div className="grid gap-6">
          <div className="flex justify-center">
            <RadioGroup
              defaultValue=""
              className="flex flex-row items-center gap-6"
              value={role}
              onValueChange={(v: Role) => setRole(v)}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="Parking Coordinator" id="Parking Coordinator" />
                <Label htmlFor="user">Parking Coordinator</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="landowner" id="landowner" />
                <Label htmlFor="landowner">Land Owner</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="johndoe123"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          {success && (
            <div className="text-green-600 text-sm text-center">{success}</div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing Up..." : "SignUp"}
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
          <Button
            variant="outline"
            className="w-full"
            type="button"
            onClick={() => window.location.href = `${BACKEND_URL}/api/auth/google`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            SignUp with Google
          </Button>
        </div>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <a href="/" className="underline underline-offset-4">
            Login
          </a>
        </div>
      </form>
    </>
  );
}
