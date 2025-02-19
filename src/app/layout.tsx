// app/layout.tsx
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ReactNode } from "react";
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className="bg-gray-900 text-white">{children}</body>
      </html>
    </AuthProvider>
  );
}
