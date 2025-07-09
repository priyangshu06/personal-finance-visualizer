

import { NextRequest, NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongoose"
import { Expense } from "@/models/expense"


export async function GET() {
  try {
    await connectToDB()
    const expenses = await Expense.find().sort({ date: -1 })
    return NextResponse.json(expenses, { status: 200 })
  } catch (error) {
    console.error("GET Error:", error)
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 })
  }
}


export async function POST(req: NextRequest) {
  try {
    await connectToDB()
    const body = await req.json()

    const { title, amount, category, date } = body

    if (!title || !amount || !category || !date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const newExpense = await Expense.create({
      title,
      amount,
      category,
      date,
    })

    return NextResponse.json(newExpense, { status: 201 })
  } catch (error) {
    console.error("POST Error:", error)
    return NextResponse.json({ error: "Failed to create expense" }, { status: 500 })
  }
}
