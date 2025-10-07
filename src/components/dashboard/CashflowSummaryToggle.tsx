import React, { useState } from "react";

interface CashflowSummaryToggleProps {
  entries: any;
}

export function CashflowSummaryToggle({ entries }: CashflowSummaryToggleProps) {
  const [show, setShow] = useState(false);
  return (
    <div className="mt-4">
      <button
        className="bg-primary text-white px-4 py-2 rounded shadow"
        onClick={() => setShow((v) => !v)}
      >
        {show ? "Hide details" : "More details"}
      </button>
      {show && (
        <div className="mt-3">
          <h2 className="text-lg font-bold mb-2">Cashflow Summary</h2>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
            {JSON.stringify(entries, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}