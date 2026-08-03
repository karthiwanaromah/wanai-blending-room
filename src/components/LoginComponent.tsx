import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "./toast";

// 1. Define types for form value and API response
interface LoginValue {
  name: string;
  phone: string;
  email: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  token?: string;
  // Add other expected fields here
}
// 2. Isolate the API request logic outside the component
const loginLead = async (payload: LoginValue): Promise<ApiResponse> => {
  const apiUrl = import.meta.env.VITE_BASE_URL;
  console.log("s", apiUrl);
  const res = await fetch(`${apiUrl}/api/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res.json();
};

const LoginComponent: React.FC = () => {
  const [value, setValue] = React.useState<LoginValue>({
    name: "",
    phone: "",
    email: "",
  });

  const toast = useToast();

  const navigation = useNavigate();

  // 3. Integrate TanStack Query mutation for state management
  const { mutate, isPending, error } = useMutation({
    mutationFn: loginLead,
    onSuccess: (data: any) => {
      console.log("Submission successful:", data);
      // Optional: Clear form or redirect user here
      const valuee = data.token;
      localStorage.setItem("token", valuee);
      navigation("/quiz");
    },
    onError: (err) => {
      toast({
        variant: "error",
        title: "Somthing wrong..",
        message: "Register failed try again with correct data.",
      });
      console.error("Submission failed:", err.message);
    },
  });

  const handleLogin = () => {
    console.log("Login button clicked");
    mutate(value);
  };

  return (
    <div className="w-full flex flex-col space-y-2 my-20">
      <label htmlFor="name">Name</label>
      <input
        className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#c49367]"
        type="text"
        id="name"
        value={value.name}
        onChange={(e) => setValue({ ...value, name: e.target.value })}
        disabled={isPending}
      />
      <label htmlFor="phone">Phone</label>
      <input
        className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#c49367]"
        type="text"
        id="phone"
        value={value.phone}
        onChange={(e) => setValue({ ...value, phone: e.target.value })}
        disabled={isPending}
      />
      <label htmlFor="email">Email</label>
      <input
        className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#c49367]"
        type="email"
        id="email"
        value={value.email}
        onChange={(e) => setValue({ ...value, email: e.target.value })}
        disabled={isPending}
      />

      {error && (
        <span className="text-red-500 text-sm">
          Failed to submit: {error.message}
        </span>
      )}

      <button
        className="cursor-pointer bg-[#c49367] hover:bg-[#a07a53] text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        onClick={handleLogin}
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Login"}
      </button>
    </div>
  );
};

export default LoginComponent;
