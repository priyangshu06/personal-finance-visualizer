"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

type Expense = {
  _id?: string
  title?: string
  note?: string
  amount: number
  category: string
  date: string
}

export default function Page() {
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [expenses, setExpenses] = useState<Expense[]>([])

  const [filterCategory, setFilterCategory] = useState("All")
  const [filterMonth, setFilterMonth] = useState("All")
  const [filterYear, setFilterYear] = useState("")

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await fetch("/api/expenses")
        const data = await res.json()
        setExpenses(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Error fetching expenses:", err)
      }
    }

    fetchExpenses()
  }, [])

  const addExpense = async () => {
    if (!category || !amount) return

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: category,
          amount: parseFloat(amount),
          category,
          date: new Date().toISOString(),
        }),
      })

      if (res.ok) {
        const newExpense = await res.json()
        setExpenses((prev) => [...prev, newExpense])
        setCategory("")
        setAmount("")
      } else {
        console.error("Failed to add expense")
      }
    } catch (err) {
      console.error("Error adding expense:", err)
    }
  }

  const deleteExpense = async (id: string) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setExpenses((prev) => prev.filter((e) => e._id !== id))
      } else {
        console.error("Failed to delete expense")
      }
    } catch (err) {
      console.error("Error deleting expense:", err)
    }
  }

  const filteredExpenses = expenses.filter((expense) => {
    const matchesCategory =
      filterCategory !== "All" ? expense.category === filterCategory : true

    const date = new Date(expense.date)
    const matchesMonth =
      filterMonth !== "All" ? date.getMonth() + 1 === parseInt(filterMonth) : true

    const matchesYear =
      filterYear ? date.getFullYear().toString() === filterYear : true

    return matchesCategory && matchesMonth && matchesYear
  })

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white p-4 sm:p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">💰 Personal Finance Visualizer</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your expenses visually and simply
          </p>
        </div>

        {/* Add Expense */}
        <Card className="shadow-xl rounded-2xl">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-xl font-semibold">➕ Add New Expense</h2>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Select onValueChange={setCategory} value={category}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Food">🍔 Food</SelectItem>
                  <SelectItem value="Rent">🏠 Rent</SelectItem>
                  <SelectItem value="Transport">🚗 Transport</SelectItem>
                  <SelectItem value="Saving">💰 Saving</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full sm:w-40"
              />

              <Button
                onClick={addExpense}
                className="bg-violet-600 hover:bg-violet-700"
              >
                Add Expense
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="shadow-xl rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">🔍 Filter Expenses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select onValueChange={setFilterCategory} value={filterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Rent">Rent</SelectItem>
                  <SelectItem value="Transport">Transport</SelectItem>
                  <SelectItem value="Saving">Saving</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={setFilterMonth} value={filterMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {new Date(0, i).toLocaleString("default", { month: "long" })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Filter by Year (e.g. 2025)"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">📊 Expenses Overview</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredExpenses.map((e) => ({
                    name: e.note || e.title || e.category,
                    amount: e.amount,
                  }))}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Expense Table */}
        <Card className="shadow-xl rounded-2xl">
          <CardContent className="p-6 overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4">📋 Expense List</h2>
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100">
                <tr>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Note</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense._id} className="border-b border-gray-300 dark:border-gray-600">
                    <td className="px-4 py-2">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">{expense.category}</td>
                    <td className="px-4 py-2">₹{expense.amount}</td>
                    <td className="px-4 py-2">{expense.note || expense.title}</td>
                    <td className="px-4 py-2">
                      <Button
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => deleteExpense(expense._id!)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
