import { AuthForm } from "@/components/auth/auth-form";

export default function AuthPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="flex flex-col items-center space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sign Up</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Create an account to get started
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}