"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cartContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, CheckCircle, AlertCircle, Truck } from "lucide-react";

// Types for form fields and validation
interface FormState {
  // Personal details
  name: string;
  email: string;
  phone: string;

  // Shipping information
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;

  // Payment details
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvc: string;

  // UI control - which fields have been touched by the user
  touched: {
    name: boolean;
    email: boolean;
    phone: boolean;
    address1: boolean;
    city: boolean;
    state: boolean;
    zipCode: boolean;
    country: boolean;
    cardNumber: boolean;
    cardExpiry: boolean;
    cardCvc: boolean;
  };
}

export default function Checkout() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Calculate cart total
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shippingCost = cartTotal > 100 ? 0 : 10;
  const taxRate = 0.07; // 7% tax rate
  const taxAmount = cartTotal * taxRate;
  const orderTotal = cartTotal + shippingCost + taxAmount;

  // Form state
  const [form, setForm] = useState<FormState>({
    // Personal details
    name: "",
    email: "",
    phone: "",

    // Shipping information
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",

    // Payment details
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvc: "",

    // UI control
    touched: {
      name: false,
      email: false,
      phone: false,
      address1: false,
      city: false,
      state: false,
      zipCode: false,
      country: false,
      cardNumber: false,
      cardExpiry: false,
      cardCvc: false,
    },
  });

  // Validation rules
  const validators = {
    name: (value: string) => (value.length > 0 ? "" : "Name is required"),
    email: (value: string) =>
      /^\S+@\S+\.\S+$/.test(value) ? "" : "Valid email is required",
    phone: (value: string) =>
      /^\d{10}$/.test(value) ? "" : "10-digit phone number is required",
    address1: (value: string) =>
      value.length > 0 ? "" : "Address is required",
    city: (value: string) => (value.length > 0 ? "" : "City is required"),
    state: (value: string) => (value.length > 0 ? "" : "State is required"),
    zipCode: (value: string) =>
      /^\d{5}(-\d{4})?$/.test(value) ? "" : "Valid ZIP code is required",
    country: (value: string) => (value.length > 0 ? "" : "Country is required"),
    cardNumber: (value: string) =>
      /^\d{16}$/.test(value.replace(/\s/g, ""))
        ? ""
        : "Valid 16-digit card number is required",
    cardExpiry: (value: string) =>
      /^\d{2}\/\d{2}$/.test(value)
        ? ""
        : "Valid expiry date (MM/YY) is required",
    cardCvc: (value: string) =>
      /^\d{3,4}$/.test(value) ? "" : "Valid CVC is required",
  };

  // Format credit card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  // Validate the form fields
  const getErrors = () => {
    return {
      name: validators.name(form.name),
      email: validators.email(form.email),
      phone: validators.phone(form.phone),
      address1: validators.address1(form.address1),
      city: validators.city(form.city),
      state: validators.state(form.state),
      zipCode: validators.zipCode(form.zipCode),
      country: validators.country(form.country),
      cardNumber: validators.cardNumber(form.cardNumber),
      cardExpiry: validators.cardExpiry(form.cardExpiry),
      cardCvc: validators.cardCvc(form.cardCvc),
    };
  };

  const errors = getErrors();

  // Check if the current step is valid
  const isCurrentStepValid = () => {
    if (currentStep === 1) {
      return !errors.name && !errors.email && !errors.phone;
    } else if (currentStep === 2) {
      return (
        !errors.address1 &&
        !errors.city &&
        !errors.zipCode &&
        !errors.state &&
        !errors.country
      );
    } else if (currentStep === 3) {
      return !errors.cardNumber && !errors.cardExpiry && !errors.cardCvc;
    }
    return false;
  };

  // Handle input change (for standard inputs)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Format credit card number if needed
    const formattedValue =
      name === "cardNumber" ? formatCardNumber(value) : value;

    setForm((prevState) => ({
      ...prevState,
      [name]: formattedValue,
    }));
  };

  // Handle select change (for state and country)
  const handleSelectChange = (name: "state" | "country", value: string) => {
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
      touched: { ...prevState.touched, [name]: true },
    }));
  };

  // Mark field as touched when user leaves the input
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setForm((prevState) => ({
      ...prevState,
      touched: { ...prevState.touched, [name]: true },
    }));
  };

  // Move to next step or submit the form
  const handleNext = () => {
    // Before moving to the next step, mark current step fields as touched
    let updatedTouched = { ...form.touched };

    if (currentStep === 1) {
      updatedTouched = {
        ...updatedTouched,
        name: true,
        email: true,
        phone: true,
      };
    } else if (currentStep === 2) {
      updatedTouched = {
        ...updatedTouched,
        address1: true,
        city: true,
        zipCode: true,
        state: true,
        country: true,
      };
    } else if (currentStep === 3) {
      updatedTouched = {
        ...updatedTouched,
        cardNumber: true,
        cardExpiry: true,
        cardCvc: true,
      };
    }

    setForm((prevState) => ({
      ...prevState,
      touched: updatedTouched,
    }));

    if (isCurrentStepValid()) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  // Go back to previous step
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Submit the form
  const handleSubmit = () => {
    // Mark all fields as touched to display all errors on final submit attempt
    const allTouched: FormState["touched"] = {
      name: true,
      email: true,
      phone: true,
      address1: true,
      city: true,
      state: true,
      zipCode: true,
      country: true,
      cardNumber: true,
      cardExpiry: true,
      cardCvc: true,
    };

    setForm((prev) => ({
      ...prev,
      touched: allTouched,
    }));

    // Check if form is valid based on ALL errors
    const isValid = Object.values(errors).every((error) => !error);

    if (isValid) {
      setIsSubmitting(true);

      setTimeout(() => {
        clearCart();
        router.push("/orderConfirmation");
      }, 1500);
    }
  };

  // Helper function to check if field should show error
  const showError = (field: keyof typeof errors) =>
    form.touched[field as keyof typeof form.touched] && errors[field];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Checkout
      </h2>

      {/* Checkout Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div
            className={`flex flex-col items-center ${
              currentStep >= 1 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              1
            </div>
            <span className="mt-2 text-center text-sm">Personal Info</span>
          </div>
          <div
            className={`flex-1 h-1 mx-4 ${
              currentStep >= 2 ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
            }`}
          ></div>
          <div
            className={`flex flex-col items-center ${
              currentStep >= 2 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 2
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              2
            </div>
            <span className="mt-2 text-center text-sm">Shipping</span>
          </div>
          <div
            className={`flex-1 h-1 mx-4 ${
              currentStep >= 3 ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
            }`}
          ></div>
          <div
            className={`flex flex-col items-center ${
              currentStep >= 3 ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 3
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              3
            </div>
            <span className="mt-2 text-center text-sm">Payment</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Section */}
        <div className="lg:col-span-2">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="John Doe"
                      className={showError("name") ? "border-red-500" : ""}
                    />
                    {showError("name") && (
                      <p className="text-red-500 text-sm">{errors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="john.doe@example.com"
                      className={showError("email") ? "border-red-500" : ""}
                    />
                    {showError("email") && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="1234567890"
                      className={showError("phone") ? "border-red-500" : ""}
                    />
                    {showError("phone") && (
                      <p className="text-red-500 text-sm">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Shipping Information */}
            {currentStep === 2 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                  Shipping Address
                </h4>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="address1">Address Line 1 *</Label>
                    <Input
                      id="address1"
                      name="address1"
                      value={form.address1}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="123 Main St"
                      className={showError("address1") ? "border-red-500" : ""}
                    />
                    {showError("address1") && (
                      <p className="text-red-500 text-sm">{errors.address1}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address2">Address Line 2</Label>
                    <Input
                      id="address2"
                      name="address2"
                      value={form.address2}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Apt 4B"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="New York"
                        className={showError("city") ? "border-red-500" : ""}
                      />
                      {showError("city") && (
                        <p className="text-red-500 text-sm">{errors.city}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Select
                        value={form.state}
                        onValueChange={(value) =>
                          handleSelectChange("state", value)
                        }
                      >
                        <SelectTrigger
                          id="state"
                          className={showError("state") ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AL">Alabama</SelectItem>
                          <SelectItem value="AK">Alaska</SelectItem>
                          <SelectItem value="AZ">Arizona</SelectItem>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="CO">Colorado</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                          <SelectItem value="GA">Georgia</SelectItem>
                          <SelectItem value="HI">Hawaii</SelectItem>
                          <SelectItem value="IL">Illinois</SelectItem>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                          <SelectItem value="WA">Washington</SelectItem>
                        </SelectContent>
                      </Select>
                      {showError("state") && (
                        <p className="text-red-500 text-sm">{errors.state}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={form.zipCode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="10001"
                        className={showError("zipCode") ? "border-red-500" : ""}
                      />
                      {showError("zipCode") && (
                        <p className="text-red-500 text-sm">{errors.zipCode}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Select
                      value={form.country}
                      onValueChange={(value) =>
                        handleSelectChange("country", value)
                      }
                    >
                      <SelectTrigger
                        id="country"
                        className={showError("country") ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                        <SelectItem value="AU">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                    {showError("country") && (
                      <p className="text-red-500 text-sm">{errors.country}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment Information */}
            {currentStep === 3 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                  Payment Information
                </h4>
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <CreditCard className="text-blue-500" />
                    <h5 className="font-medium text-gray-700 dark:text-gray-200">
                      Credit Card
                    </h5>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      value={form.cardNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className={
                        showError("cardNumber") ? "border-red-500" : ""
                      }
                    />
                    {showError("cardNumber") && (
                      <p className="text-red-500 text-sm">
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      value={form.cardName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardExpiry">Expiration Date *</Label>
                      <Input
                        id="cardExpiry"
                        name="cardExpiry"
                        value={form.cardExpiry}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="MM/YY"
                        maxLength={5}
                        className={
                          showError("cardExpiry") ? "border-red-500" : ""
                        }
                      />
                      {showError("cardExpiry") && (
                        <p className="text-red-500 text-sm">
                          {errors.cardExpiry}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardCvc">CVC *</Label>
                      <Input
                        id="cardCvc"
                        name="cardCvc"
                        value={form.cardCvc}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="123"
                        maxLength={4}
                        className={showError("cardCvc") ? "border-red-500" : ""}
                      />
                      {showError("cardCvc") && (
                        <p className="text-red-500 text-sm">{errors.cardCvc}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              {currentStep > 1 ? (
                <Button type="button" onClick={handleBack} variant="outline">
                  Back
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => router.push("/cart")}
                  variant="outline"
                >
                  Return to Cart
                </Button>
              )}
              <Button
                type="button"
                onClick={handleNext}
                disabled={!isCurrentStepValid() || isSubmitting}
                variant={
                  isCurrentStepValid() && !isSubmitting
                    ? "default"
                    : "secondary"
                }
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : currentStep < 3 ? (
                  "Continue"
                ) : (
                  "Place Order"
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow">
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Order Summary
            </h4>

            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cart.length === 0 ? (
                <p className="text-gray-500">Your cart is empty.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-gray-900 dark:text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Totals */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-gray-900 dark:text-white">
                <p>Subtotal</p>
                <p>${cartTotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-gray-900 dark:text-white">
                <p>Shipping</p>
                <p>
                  {shippingCost === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `${shippingCost.toFixed(2)}`
                  )}
                </p>
              </div>
              <div className="flex justify-between text-gray-900 dark:text-white">
                <p>Tax (7%)</p>
                <p>${taxAmount.toFixed(2)}</p>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                <p>Total</p>
                <p>${orderTotal.toFixed(2)}</p>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center text-green-600">
                <CheckCircle size={16} className="mr-2" />
                <p className="text-sm">All items in stock</p>
              </div>
              <div className="flex items-center text-blue-600">
                <Truck size={16} className="mr-2" />
                <p className="text-sm">Free shipping on orders over $100</p>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <AlertCircle size={16} className="mr-2" />
                <p className="text-sm">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
