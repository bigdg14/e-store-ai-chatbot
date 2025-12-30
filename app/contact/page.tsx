"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    touched: {
      name: false,
      email: false,
      message: false,
    },
  });

  const [submitted, setSubmitted] = useState(false);

  const errors = {
    name: formData.name.length === 0,
    email: formData.email.length === 0 || !formData.email.includes("@"),
    message: formData.message.length === 0,
  };

  const disabled = Object.values(errors).some((error) => error);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      touched: { ...prevState.touched, [name]: true },
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!disabled) {
      setSubmitted(true);
      // In a real app, you would send the data to your backend here
      // For now, we'll just simulate a successful submission
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
  };

  const showError = (field: keyof typeof errors) =>
    errors[field]
      ? formData.touched[field as keyof typeof formData.touched]
      : false;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
        Contact Us
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
            Get in Touch
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We're here to help! If you have any questions about our products or
            services, please don't hesitate to reach out.
          </p>

          <div className="space-y-4">
            <div className="flex items-center">
              <Mail className="text-blue-500 mr-3" size={20} />
              <span className="text-gray-700 dark:text-gray-300">
                doug@hype-us.com
              </span>
            </div>
            <div className="flex items-center">
              <Phone className="text-blue-500 mr-3" size={20} />
              <span className="text-gray-700 dark:text-gray-300">
                +1 (555) 123-4567
              </span>
            </div>
            <div className="flex items-center">
              <MapPin className="text-blue-500 mr-3" size={20} />
              <span className="text-gray-700 dark:text-gray-300">
                123 E-Commerce St, Digital City, DC 10101
              </span>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
              Business Hours
            </h4>
            <div className="grid grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
              <div>Monday - Friday</div>
              <div>9:00 AM - 6:00 PM</div>
              <div>Saturday</div>
              <div>10:00 AM - 4:00 PM</div>
              <div>Sunday</div>
              <div>Closed</div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-green-500 text-5xl mb-4">✓</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Message Sent!
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Thank you for your message. We'll get back to you as soon as
                possible.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-4">
                Redirecting you to the homepage...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name*</Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your name"
                  className={showError("name") ? "border-red-500" : ""}
                />
                {showError("name") && (
                  <p className="text-red-500 text-sm mt-1">Name is required</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address*</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your email"
                  className={showError("email") ? "border-red-500" : ""}
                />
                {showError("email") && (
                  <p className="text-red-500 text-sm mt-1">
                    Please enter a valid email address
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select
                  name="subject"
                  defaultValue={formData.subject}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, subject: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Product Inquiry">
                      Product Inquiry
                    </SelectItem>
                    <SelectItem value="Order Status">Order Status</SelectItem>
                    <SelectItem value="Returns">Returns</SelectItem>
                    <SelectItem value="Technical Support">
                      Technical Support
                    </SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message*</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your message"
                  rows={5}
                  className={showError("message") ? "border-red-500" : ""}
                />
                {showError("message") && (
                  <p className="text-red-500 text-sm mt-1">
                    Message is required
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={disabled}
                  className={`px-6 py-2 rounded-lg flex items-center ${
                    disabled
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  <Send className="mr-2" size={16} />
                  Send Message
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
