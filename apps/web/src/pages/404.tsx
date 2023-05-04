import Link from "next/link";

export default function Custom404() {
  return (
    <div className="min-h-[93vh] flex items-center justify-center bg-gray-100">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-6">
          The page you are looking for does not exist.
        </p>
        <Link
          className="px-4 py-2 font-bold text-white bg-pink-500 rounded hover:bg-pink-600"
          href="/"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
