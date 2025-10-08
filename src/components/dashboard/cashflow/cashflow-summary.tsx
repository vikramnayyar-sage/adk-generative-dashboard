
"use client";
import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CashflowModal } from "./cashflow-modal";
import { CashflowBalanceModal } from "./cashflow-balance-modal";
import { AgentState, AgentSetState } from "@/lib/types";

interface CashflowSummaryProps {
  state: AgentState | undefined;
  setState: AgentSetState<AgentState>;
}

export function CashflowSummary({ state, setState }: CashflowSummaryProps) {
  const [isBalanceModalOpen, setIsBalanceModalOpen] = React.useState(false);
  const [isCustomersModalOpen, setIsCustomersModalOpen] = React.useState(false);
  const [editingCustomer, setEditingCustomer] = React.useState<null | { id: number; type: "creditor" | "debitor" }>(null);
  const [customerForm, setCustomerForm] = React.useState({ businessName: "", phoneNumber: "", emailAddress: "", links: "", type: "creditor" as "creditor" | "debitor" });
  const cashflowEntries: { amount: number; type: "in" | "out" }[] = state?.cashflowEntries || [];
  const creditors = state?.creditors || [];
  const debitors = state?.debitors || [];

  // Keep a combined customers array in AgentState for agent compatibility
  React.useEffect(() => {
    const combined = [...creditors, ...debitors];
    if (JSON.stringify(state?.customers) !== JSON.stringify(combined)) {
      setState(prev => ({ ...prev!, customers: combined }));
    }
  }, [creditors, debitors]);
  // Customer CRUD handlers
  const handleAddCustomer = () => {
    const nextId = Math.max(0,
      ...(customerForm.type === "creditor" ? creditors : debitors).map(c => c.id)
    ) + 1;
    const newCustomer = { id: nextId, businessName: customerForm.businessName, phoneNumber: customerForm.phoneNumber, emailAddress: customerForm.emailAddress, links: customerForm.links };
    if (customerForm.type === "creditor") {
      setState(prev => ({
        ...prev!,
        creditors: [...(prev?.creditors ?? []), newCustomer],
        debitors: prev?.debitors ?? []
      }));
    } else {
      setState(prev => ({
        ...prev!,
        debitors: [...(prev?.debitors ?? []), newCustomer],
        creditors: prev?.creditors ?? []
      }));
    }
    setCustomerForm({ businessName: "", phoneNumber: "", emailAddress: "", links: "", type: "creditor" });
    setEditingCustomer(null);
  };

  const handleEditCustomer = (id: number, type: "creditor" | "debitor") => {
    const customer = (type === "creditor" ? creditors : debitors).find(c => c.id === id);
    if (customer) {
      setCustomerForm({
        businessName: customer.businessName || "",
        phoneNumber: customer.phoneNumber || "",
        emailAddress: customer.emailAddress || "",
        links: customer.links || "",
        type
      });
      setEditingCustomer({ id, type });
    }
  };

  const handleSaveEditCustomer = () => {
    if (!editingCustomer) return;
    if (editingCustomer.type === "creditor") {
      setState(prev => ({
        ...prev!,
        creditors: prev?.creditors?.map(c => c.id === editingCustomer.id ? { ...c, ...customerForm } : c) ?? [],
        debitors: prev?.debitors ?? []
      }));
    } else {
      setState(prev => ({
        ...prev!,
        debitors: prev?.debitors?.map(c => c.id === editingCustomer.id ? { ...c, ...customerForm } : c) ?? [],
        creditors: prev?.creditors ?? []
      }));
    }
    setCustomerForm({ businessName: "", phoneNumber: "", emailAddress: "", links: "", type: "creditor" });
    setEditingCustomer(null);
  };

  const handleDeleteCustomer = (id: number, type: "creditor" | "debitor") => {
    if (type === "creditor") {
      setState(prev => ({
        ...prev!,
        creditors: prev?.creditors?.filter(c => c.id !== id) ?? [],
        debitors: prev?.debitors ?? []
      }));
    } else {
      setState(prev => ({
        ...prev!,
        debitors: prev?.debitors?.filter(c => c.id !== id) ?? [],
        creditors: prev?.creditors ?? []
      }));
    }
    if (editingCustomer && editingCustomer.id === id && editingCustomer.type === type) {
      setEditingCustomer(null);
      setCustomerForm({ businessName: "", phoneNumber: "", emailAddress: "", links: "", type: "creditor" });
    }
  };

  // Calculate summary
  const totalInflow = cashflowEntries
    .filter((entry: { amount: number; type: "in" | "out" }) => entry.type === "in")
    .reduce((sum: number, entry: { amount: number; type: "in" | "out" }) => sum + entry.amount, 0);

  const totalOutflow = cashflowEntries
    .filter((entry: { amount: number; type: "in" | "out" }) => entry.type === "out")
    .reduce((sum: number, entry: { amount: number; type: "in" | "out" }) => sum + Math.abs(entry.amount), 0);

  const netCashflow = totalInflow - totalOutflow;

  // Update AgentState with summary fields for agent access (only if changed)
  React.useEffect(() => {
    if (
      state?.totalInflow !== totalInflow ||
      state?.totalOutflow !== totalOutflow ||
      state?.netCashflow !== netCashflow
    ) {
      setState(prev => ({
        ...prev!,
        totalInflow,
        totalOutflow,
        netCashflow
      }));
    }
  }, [totalInflow, totalOutflow, netCashflow]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(amount));
  };

  return (
    <Card className="shadow-none border-none bg-transparent">
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">Quick Summary</h3>
            <div className="flex gap-2 text-sm">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                In: {formatCurrency(totalInflow)}
              </Badge>
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                Out: {formatCurrency(totalOutflow)}
              </Badge>
              <Badge variant={netCashflow >= 0 ? "default" : "destructive"}>
                Net: {formatCurrency(netCashflow)}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CashflowModal state={state} setState={setState} />
            <button
              className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-semibold text-sm border-none cursor-pointer"
              onClick={() => setIsCustomersModalOpen(true)}
            >
              Customers
            </button>
            <button
              className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-semibold text-sm border-none cursor-pointer"
              onClick={() => setIsBalanceModalOpen(true)}
            >
              Set Starting Balance (${state?.startingBalance ?? 0})
            </button>
            <CashflowBalanceModal
              isOpen={isBalanceModalOpen}
              setIsOpen={setIsBalanceModalOpen}
              state={state}
              setState={setState}
            />
            {isCustomersModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-6 min-w-[350px] max-w-[90vw]">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Customers</h2>
                    <button onClick={() => {
                      setIsCustomersModalOpen(false);
                      setEditingCustomer(null);
                    setCustomerForm({ businessName: "", phoneNumber: "", emailAddress: "", links: "", type: "creditor" });
                    }} className="text-gray-500 hover:text-gray-800">✕</button>
                  </div>
                  {/* List creditors */}
                  <div className="mb-2">
                    <h4 className="font-semibold mb-1">Creditors</h4>
                    {creditors.length === 0 ? (
                      <div className="text-sm text-gray-500">No creditors yet.</div>
                    ) : (
                      <ul className="divide-y">
                        {creditors.map(c => (
                          <li key={c.id} className="py-2 flex items-center justify-between">
                            <div>
                              <div className="font-medium">{c.businessName}</div>
                              <div className="text-xs text-gray-500">{c.emailAddress || c.phoneNumber || ""}</div>
                            </div>
                            <div className="flex gap-2">
                              <button className="text-blue-600 text-xs" onClick={() => handleEditCustomer(c.id, "creditor")}>Edit</button>
                              <button className="text-red-600 text-xs" onClick={() => handleDeleteCustomer(c.id, "creditor")}>Delete</button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {/* List debitors */}
                  <div className="mb-4">
                    <h4 className="font-semibold mb-1">Debitors</h4>
                    {debitors.length === 0 ? (
                      <div className="text-sm text-gray-500">No debitors yet.</div>
                    ) : (
                      <ul className="divide-y">
                        {debitors.map(c => (
                          <li key={c.id} className="py-2 flex items-center justify-between">
                            <div>
                              <div className="font-medium">{c.businessName}</div>
                              <div className="text-xs text-gray-500">{c.emailAddress || c.phoneNumber || ""}</div>
                            </div>
                            <div className="flex gap-2">
                              <button className="text-blue-600 text-xs" onClick={() => handleEditCustomer(c.id, "debitor")}>Edit</button>
                              <button className="text-red-600 text-xs" onClick={() => handleDeleteCustomer(c.id, "debitor")}>Delete</button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {/* Add/Edit customer form */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">{editingCustomer === null ? "Add Customer" : "Edit Customer"}</h3>
                    <div className="flex flex-col gap-2">
                      <select
                        value={customerForm.type}
                        onChange={e => setCustomerForm(f => ({ ...f, type: e.target.value as "creditor" | "debitor" }))}
                        className="border rounded px-2 py-1"
                      >
                        <option value="creditor">Creditor</option>
                        <option value="debitor">Debitor</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Business Name"
                        className="border rounded px-2 py-1"
                        value={customerForm.businessName}
                        onChange={e => setCustomerForm(f => ({ ...f, businessName: e.target.value }))}
                      />
                      <input
                        type="text"
                        placeholder="Phone Number"
                        className="border rounded px-2 py-1"
                        value={customerForm.phoneNumber}
                        onChange={e => setCustomerForm(f => ({ ...f, phoneNumber: e.target.value }))}
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        className="border rounded px-2 py-1"
                        value={customerForm.emailAddress}
                        onChange={e => setCustomerForm(f => ({ ...f, emailAddress: e.target.value }))}
                      />
                      <input
                        type="text"
                        placeholder="Links (optional)"
                        className="border rounded px-2 py-1"
                        value={customerForm.links}
                        onChange={e => setCustomerForm(f => ({ ...f, links: e.target.value }))}
                      />
                      <div className="flex gap-2 mt-2">
                        {editingCustomer === null ? (
                          <button
                            className="bg-green-600 text-white px-3 py-1 rounded"
                            onClick={handleAddCustomer}
                            disabled={!customerForm.businessName}
                          >Add</button>
                        ) : (
                          <>
                            <button
                              className="bg-blue-600 text-white px-3 py-1 rounded"
                              onClick={handleSaveEditCustomer}
                              disabled={!customerForm.businessName}
                            >Save</button>
                            <button
                              className="bg-gray-300 text-gray-700 px-3 py-1 rounded"
                              onClick={() => {
                                setEditingCustomer(null);
                            setCustomerForm({ businessName: "", phoneNumber: "", emailAddress: "", links: "", type: "creditor" });
                              }}
                            >Cancel</button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}