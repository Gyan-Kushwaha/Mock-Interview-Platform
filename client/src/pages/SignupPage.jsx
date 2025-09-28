import { cn } from "@/utils/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { registerUser } from "@/api/user.api";
import { useNotification } from "@/components/Notifications/NotificationContext";

// Firebase is not used in the backend, so these imports can be removed.
// import { signInWithPopup } from "firebase/auth";
// import { auth, googleProvider } from "@/utils/firebase/firebase";

export function SignupPage({ className, ...props }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { addNotification } = useNotification();


  const handleSignup = async () => {
    try {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      const formData = { name, email, password };
      await registerUser(formData);
      addNotification({
        id: Date.now().toString(),
        type: "success",
        message: "User Registered Successfully",
      });
      navigate("/login");
    } catch (error) {
      addNotification({
        id: Date.now().toString(),
        type: "error",
        message: error.response?.data?.error || "Registration failed",
      });
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-500">
      <div className={cn("flex flex-col gap-6 lg:w-[400px] max-w-6xl", className)} {...props}>
        <Card className="bg-gray-200 shadow-lg shadow-black">
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>Enter your details to create an account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" type="text" placeholder="John Doe" required onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="m@example.com" required onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} required onChange={(e) => setPassword(e.target.value)} />
                    <button type="button" className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <Eye className="text-red-500" /> : <EyeOff />}
                    </button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} required onChange={(e) => setConfirmPassword(e.target.value)} />
                    <button type="button" className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <Eye className="text-red-500" /> : <EyeOff />}
                    </button>
                  </div>
                </div>
                <Button onClick={handleSignup} className="w-full">
                  Sign Up
                </Button>
              </div>
              {/* <Button onClick={handleGoogleSignup} variant="outline" className="w-full mt-2">
                Continue with Google
              </Button> */}
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}