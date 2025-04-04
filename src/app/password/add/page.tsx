"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const AddPasswordForm = () => {
  const router = useRouter();

  const [domainName, setDomainName] = useState("");
  const [password, setPassword] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Toggle state for password visibility

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("You must be logged in to add a password.");
      setLoading(false);
      return;
    }

    const response = await fetch(
      "http://127.0.0.1:8000/api/users/add_password/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain_name: domainName,
          password: password,
          link: link,
        }),
      }
    );

    setLoading(false);

    if (response.ok) {
      toast.success("Password added successfully!");

      // Redirect to the dashboard after successful password addition
      router.push("/dashboard");

      // Reset the form fields
      setDomainName("");
      setPassword("");
      setLink("");
    } else {
      const errorText = await response.text();
      toast.error(`Failed to add password: ${errorText}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center">Add Password</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="domain_name" className="block text-sm font-medium">
              Domain Name
            </label>
            <input
              type="text"
              id="domain_name"
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
              className="mt-1 p-2 w-full bg-gray-700 rounded-md text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // Toggle between text and password input type
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 p-2 w-full bg-gray-700 rounded-md text-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                className="absolute right-3 top-3 text-gray-400"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="link" className="block text-sm font-medium">
              Link
            </label>
            <input
              type="url"
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="mt-1 p-2 w-full bg-gray-700 rounded-md text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPasswordForm;
