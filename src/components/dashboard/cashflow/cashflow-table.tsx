"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, DollarSign } from "lucide-react";
import { CashflowEntry, Customer } from "@/lib/types";

interface CashflowTableProps {
  entries: CashflowEntry[];
  onAddEntry: (entry: Omit<CashflowEntry, "id">) => void;
  onRemoveEntry: (id: number) => void;
  isModal?: boolean;
  customers?: Customer[];
}

export function CashflowTable({ entries, onAddEntry, onRemoveEntry, isModal = false, customers = [] }: CashflowTableProps) {
  const [newEntry, setNewEntry] = useState({
    name: "",
    amount: "",
    dateDue: "",
    type: "in" as "in" | "out",
    customerId: ""
  });

  const handleAddEntry = () => {
    if (!newEntry.name || !newEntry.amount || !newEntry.dateDue) return;
    onAddEntry({
      name: newEntry.name,
      amount: parseFloat(newEntry.amount),
      dateDue: newEntry.dateDue,
      type: newEntry.type,
      customerId: newEntry.customerId ? parseInt(newEntry.customerId) : undefined
    });
    setNewEntry({ name: "", amount: "", dateDue: "", type: "in", customerId: "" });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const totalInflow = entries
    .filter(entry => entry.type === "in")
    .reduce((sum, entry) => sum + entry.amount, 0);
    
  const totalOutflow = entries
    .filter(entry => entry.type === "out")
    .reduce((sum, entry) => sum + Math.abs(entry.amount), 0);
    
  const netCashflow = totalInflow - totalOutflow;

  return (
    <Card className={isModal ? "w-full border-none shadow-none" : "w-full"}>
      {!isModal && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Cashflow Management
            </CardTitle>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  In: {formatCurrency(totalInflow)}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  Out: {formatCurrency(totalOutflow)}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant={netCashflow >= 0 ? "default" : "destructive"}>
                  Net: {formatCurrency(netCashflow)}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent>
        {/* Add new entry form */}
        <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Add New Entry</h3>
          <div className="flex flex-wrap gap-4 items-end">
            <Input
              placeholder="Entry name"
              value={newEntry.name}
              onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
              className="flex-1 min-w-[200px] border-gray-300 focus:ring-green-400 focus:border-green-400 h-11"
            />
            <Input
              type="number"
              placeholder="Amount ($)"
              value={newEntry.amount}
              onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
              className="w-32 border-gray-300 focus:ring-green-400 focus:border-green-400 h-11"
            />
            <Input
              type="date"
              value={newEntry.dateDue}
              onChange={(e) => setNewEntry({ ...newEntry, dateDue: e.target.value })}
              className="w-40 border-gray-300 focus:ring-green-400 focus:border-green-400 h-11"
            />
            <select
              value={newEntry.type}
              onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value as "in" | "out" })}
              className="px-3 py-2 h-11 w-32 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-white"
            >
              <option value="in">💰 Inflow</option>
              <option value="out">💸 Outflow</option>
            </select>
            <select
              value={newEntry.customerId}
              onChange={e => setNewEntry({ ...newEntry, customerId: e.target.value })}
              className="px-3 py-2 h-11 w-40 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-white"
            >
              <option value="">No customer</option>
              {customers.map((c: Customer) => (
                <option key={c.id} value={c.id}>{c.businessName}</option>
              ))}
            </select>
            <Button 
              onClick={handleAddEntry} 
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white shadow-md transition-all duration-200 h-11 px-6 whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              <span>Add Entry</span>
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full border-collapse bg-white">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm border-b border-gray-200 w-16">ID</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm border-b border-gray-200 min-w-[150px]">Name</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm border-b border-gray-200 min-w-[120px]">Amount</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm border-b border-gray-200 hidden md:table-cell min-w-[100px]">Due Date</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm border-b border-gray-200 hidden md:table-cell min-w-[90px]">Type</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm border-b border-gray-200 hidden lg:table-cell min-w-[120px]">Customer</th>
                <th className="text-left p-4 font-semibold text-gray-700 text-sm border-b border-gray-200 w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-12 text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <DollarSign className="h-12 w-12 text-gray-300" />
                      <p className="text-lg font-medium">No cashflow entries yet</p>
                      <p className="text-sm">Add one above to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                entries.map((entry, idx) => {
                  const customer = customers.find((c: Customer) => c.id === entry.customerId);
                  return (
                    <tr key={entry.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="p-4 font-mono text-sm text-gray-600">#{entry.id}</td>
                      <td className="p-4 font-medium text-gray-900">
                        <div className="flex flex-col">
                          <span className="font-semibold">{entry.name}</span>
                          <div className="md:hidden flex flex-col gap-1 mt-1">
                            <span className="text-xs text-gray-500">{formatDate(entry.dateDue)}</span>
                            <Badge 
                              variant={entry.type === "in" ? "default" : "secondary"}
                              className={`text-xs w-fit ${entry.type === "in" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                            >
                              {entry.type === "in" ? "💰 In" : "💸 Out"}
                            </Badge>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`font-bold text-lg ${entry.type === "in" ? "text-green-600" : "text-red-600"}`}>
                          {entry.type === "in" ? "+" : "-"}{formatCurrency(Math.abs(entry.amount))}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600 hidden md:table-cell font-medium">{formatDate(entry.dateDue)}</td>
                      <td className="p-4 hidden md:table-cell">
                        <Badge 
                          variant={entry.type === "in" ? "default" : "secondary"}
                          className={`${entry.type === "in" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} px-3 py-1`}
                        >
                          {entry.type === "in" ? "💰 Inflow" : "💸 Outflow"}
                        </Badge>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        {customer ? (
                          <span className="text-sm text-gray-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full font-medium">{customer.businessName}</span>
                        ) : (
                          <span className="text-sm text-gray-400">No customer</span>
                        )}
                      </td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveEntry(entry.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors rounded-full"
                          title="Remove entry"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}