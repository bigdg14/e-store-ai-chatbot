"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Checkout() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    shippingAddress1: "",
    touched: {
      name: false,
      email: false,
      shippingAddress1: false,
    },
  });

  const errors = {
    name: form.name.length === 0,
    email: form.email.length === 0,
    shippingAddress1: form.shippingAddress1.length === 0,
  };

  const disabled = Object.values(errors).some((error) => error);

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = ev.target;
    setForm((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleBlur = (ev: React.FocusEvent<HTMLInputElement>) => {
    const { name } = ev.target;
    setForm((prevState) => ({
      ...prevState,
      touched: { ...prevState.touched, [name]: true },
    }));
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!disabled) {
      router.push("/orderConfirmation"); // ✅ Redirect after successful submission
    }
  };

  const showError = (field: keyof typeof errors) =>
    errors[field] ? form.touched[field] : false;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Shopping Checkout
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Details */}
        <div>
          <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Your Details
          </h4>
          <hr className="my-2 border-gray-300 dark:border-gray-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter name"
              className={`border p-2 rounded-md w-full ${
                showError("name") ? "border-red-500" : ""
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter email"
              className={`border p-2 rounded-md w-full ${
                showError("email") ? "border-red-500" : ""
              }`}
            />
          </div>
        </div>

        {/* Address Details */}
        <div>
          <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Address Details
          </h4>
          <hr className="my-2 border-gray-300 dark:border-gray-600" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Shipping Address
          </label>
          <input
            type="text"
            name="shippingAddress1"
            value={form.shippingAddress1}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter first address line"
            className={`border p-2 rounded-md w-full ${
              showError("shippingAddress1") ? "border-red-500" : ""
            }`}
          />
          <input
            type="text"
            name="shippingAddress2"
            placeholder="Enter second address line"
            className="border p-2 rounded-md w-full mt-2"
          />
          <input
            type="text"
            name="shippingCity"
            placeholder="Enter city"
            className="border p-2 rounded-md w-full mt-2"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            onClick={() => router.push("/cart")}
            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={disabled}
            className={`px-6 py-2 rounded-lg ${
              disabled
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Confirm Order
          </Button>
        </div>
      </form>
    </div>
  );
}
