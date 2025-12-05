import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";

function LoginFormWrapper() {
  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LoginFormWrapper />
    </Suspense>
  );
}