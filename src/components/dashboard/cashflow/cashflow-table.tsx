"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, DollarSign } from "lucide-react";
import { CashflowEntry } from "@/lib/types";

interface CashflowTableProps {
  entries: CashflowEntry[];
  onAddEntry: (entry: Omit<CashflowEntry, "id">) => void;
  onRemoveEntry: (id: number) => void;
  isModal?: boolean;
  customers?: any[];
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
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 mb-4 p-4 bg-gray-50 rounded-lg">
          <Input
            placeholder="Entry name"
            value={newEntry.name}
            onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
            className="md:col-span-2"
          />
          <Input
            type="number"
            placeholder="Amount"
            value={newEntry.amount}
            onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
          />
          <Input
            type="date"
            value={newEntry.dateDue}
            onChange={(e) => setNewEntry({ ...newEntry, dateDue: e.target.value })}
          />
          <select
            value={newEntry.type}
            onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value as "in" | "out" })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="in">Inflow</option>
            <option value="out">Outflow</option>
          </select>
          <select
            value={newEntry.customerId}
            onChange={e => setNewEntry({ ...newEntry, customerId: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">No customer</option>
            {customers.map((c: any) => (
              <option key={c.id} value={c.id}>{c.businessName}</option>
            ))}
          </select>
          <Button onClick={handleAddEntry} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium">ID</th>
                <th className="text-left p-2 font-medium">Name</th>
                <th className="text-left p-2 font-medium">Amount</th>
                <th className="text-left p-2 font-medium">Due Date</th>
                <th className="text-left p-2 font-medium">Type</th>
                <th className="text-left p-2 font-medium">Customer</th>
                <th className="text-left p-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-gray-500">
                    No cashflow entries yet. Add one above to get started.
                  </td>
                </tr>
              ) : (
                entries.map((entry) => {
                  const customer = customers.find((c: any) => c.id === entry.customerId);
                  return (
                    <tr key={entry.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-mono text-sm">{entry.id}</td>
                      <td className="p-2">{entry.name}</td>
                      <td className="p-2">
                        <span className={entry.type === "in" ? "text-green-600" : "text-red-600"}>
                          {entry.type === "in" ? "+" : "-"}{formatCurrency(Math.abs(entry.amount))}
                        </span>
                      </td>
                      <td className="p-2">{formatDate(entry.dateDue)}</td>
                      <td className="p-2">
                        <Badge 
                          variant={entry.type === "in" ? "default" : "secondary"}
                          className={entry.type === "in" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                        >
                          {entry.type === "in" ? "Inflow" : "Outflow"}
                        </Badge>
                      </td>
                      <td className="p-2">
                        {customer ? (
                          <span className="text-xs text-gray-700">{customer.businessName}</span>
                        ) : (
                          <span className="text-xs text-gray-400">No customer</span>
                        )}
                      </td>
                      <td className="p-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveEntry(entry.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
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