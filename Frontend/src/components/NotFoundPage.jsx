import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="flex flex-col items-center text-center">
        <h1 className="mb-4 text-5xl font-semibold tracking-tight text-gray-900">
          404 — Page Not Found
        </h1>

        <p className="mb-10 max-w-md text-lg text-gray-500">
          The page you're looking for doesn't exist.
        </p>

        <button
  onClick={() => navigate("/")}
  className="rounded-full border-2 border-blue-600 bg-white px-7 py-3 text-sm font-medium text-black shadow-sm transition-all duration-200 hover:bg-blue-50 hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
>
  Go back to map
</button>
      </div>
    </div>
  );
}
