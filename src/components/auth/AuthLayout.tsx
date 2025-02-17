import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#2A2D43] flex items-center justify-center p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
};

export default AuthLayout;
