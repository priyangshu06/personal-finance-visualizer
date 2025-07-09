import mongoose, { Schema, Document, model, models } from "mongoose"


export interface IExpense extends Document {
  title: string
  note?: string
  amount: number
  category: string
  date: string 
}


const ExpenseSchema: Schema<IExpense> = new Schema({
  title: { type: String, required: true },
  note: { type: String },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: String, required: true }, 
})


export const Expense = models.Expense || model<IExpense>("Expense", ExpenseSchema)
