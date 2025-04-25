"use client";

import { useState } from "react";

import { Icon } from "@/components/Icon";

interface FormFieldProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dir?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function FormField({
  label,
  id,
  name,
  value,
  onChange,
  dir = "rtl",
  type = "text",
  required = false,
  disabled = false,
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-lg font-medium text-dark">
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          id={id}
          name={name}
          value={value}
          dir={dir}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`w-full p-3 border border-gray-300 text-gray-700 rounded-full focus:ring-2 focus:ring-accent focus:border-accent outline-none transition ${
            disabled ? "bg-gray-100 cursor-not-allowed" : ""
          } ${type === "password" ? "pr-10" : ""}`}
        />
        {type === "password" && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "مخفی کردن رمز" : "نشان دادن رمز"}
          >
            {showPassword ? (
              <Icon name="EyeOff" className="text-black" />
            ) : (
              <Icon name="Eye" className="text-black" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
