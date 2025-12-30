import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function About() {

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          About SmartCart
        </h1>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            SmartCart is a modern e-commerce platform built with cutting-edge web
            technologies. Our mission is to provide a seamless shopping
            experience with intuitive navigation, responsive design, and
            intelligent product recommendations powered by AI.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Technologies Used
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                Frontend
              </h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                <li>Next.js 15 with App Router</li>
                <li>React 19</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>Lucide Icons</li>
                <li>ShadCN UI Components</li>
              </ul>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                Backend
              </h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                <li>Next.js API Routes</li>
                <li>PostgreSQL Database</li>
                <li>OpenAI API Integration</li>
                <li>LangChain</li>
                <li>Server Components</li>
                <li>Server Actions</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Key Features
          </h2>
          <div className="space-y-4 mb-6">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                Modern UI/UX Design
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Responsive design with dark mode support, custom animations, and
                accessibility features.
              </p>
            </div>
            <div className="p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-400">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                AI-Powered Shopping Assistant
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Integrated AI chatbot that can answer product questions, provide
                recommendations, and help with the shopping process.
              </p>
            </div>
            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-400">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                Full-Featured Shopping Experience
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Product browsing, search functionality, shopping cart, and
                checkout process with real-time inventory management.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Developer Showcase
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            This project demonstrates proficiency in:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6">
            <li>Modern React patterns and best practices</li>
            <li>Next.js App Router architecture</li>
            <li>Server Components and Server Actions</li>
            <li>TypeScript for type safety</li>
            <li>Responsive UI design with Tailwind CSS</li>
            <li>State management with React Context</li>
            <li>AI integration with LangChain and OpenAI</li>
            <li>Database operations with PostgreSQL</li>
            <li>Deployment and CI/CD workflows</li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Contact The Developer
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Interested in hiring the developer behind this project? Feel free to
            reach out for more information about this demo or to discuss
            potential opportunities.
          </p>
          <div className="flex justify-center">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
              developer@example.com
            </Button>
          </div>
        </div>

        {/* Return to Home */}
        <div className="flex justify-center mt-8">
          <Link
            href="/"
            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
