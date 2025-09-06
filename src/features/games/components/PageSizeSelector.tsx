import React from "react";

interface PageSizeSelectorProps {
  pageSize: number;
  onChange: (size: number) => void;
}

const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({ pageSize, onChange }) => (
  <div className="flex items-center gap-2">
    <label className="text-white font-medium mr-2">Page Size:</label>
    <select
      className="rounded p-2 text-black bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
      value={pageSize}
      onChange={e => onChange(Number(e.target.value))}
    >
      {[5, 10, 20, 50].map(size => (
        <option key={size} value={size}>{size}</option>
      ))}
    </select>
  </div>
);

export default PageSizeSelector;
