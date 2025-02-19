import { AuthProvider } from "@/context/AuthContext";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast"; // Import Toaster

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-600 text-white">
        <AuthProvider>
          {children}
          {/* Add Toaster component here for global toast notifications */}
          <Toaster position="top-right" reverseOrder={false} />
        </AuthProvider>
      </body>
    </html>
  );
}
