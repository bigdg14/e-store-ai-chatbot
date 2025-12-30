import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-700">
          404
        </h1>
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mt-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-4 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2">
              Go Home
            </Button>
          </Link>
          <Link href="/categories">
            <Button variant="outline" className="px-6 py-2">
              Browse Categories
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
