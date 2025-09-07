import React from "react";

interface TextInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder = "",
  className = "",
}) => (
  <div>
    <label className="block text-sm font-medium mb-2 text-white">{label}</label>
    <input
      type={type}
      className={`w-full px-4 py-2 rounded bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`}
      value={value}
      onChange={e => onChange(e.target.value)}
      required={required}
      placeholder={placeholder}
    />
  </div>
);

export default TextInput;
