"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

const optionalText = z.preprocess((value) => (value === "" ? null : value), z.string().nullable().optional());

const expenseSchema = z.object({
  expense_date: z.string().min(1, "Expense date is required"),
  branch_id: optionalText,
  account_id: z.string().min(1, "Expense account is required"),
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  notes: optionalText,
});

const journalSchema = z.object({
  journal_date: z.string().min(1, "Journal date is required"),
  reference_number: optionalText,
  description: optionalText,
  debit_account_id: z.string().min(1, "Debit account is required"),
  credit_account_id: z.string().min(1, "Credit account is required"),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  notes: optionalText,
});

export async function createExpense(formData: FormData) {
  const payload = expenseSchema.parse({
    expense_date: formData.get("expense_date"),
    branch_id: formData.get("branch_id") || null,
    account_id: formData.get("account_id"),
    description: formData.get("description"),
    amount: formData.get("amount"),
    notes: formData.get("notes") || null,
  });

  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("expense_records").insert(payload);

  if (error) throw new Error(error.message);

  revalidatePath("/accounting");
  revalidatePath("/dashboard");
}

export async function createManualJournal(formData: FormData) {
  const payload = journalSchema.parse({
    journal_date: formData.get("journal_date"),
    reference_number: formData.get("reference_number") || null,
    description: formData.get("description") || null,
    debit_account_id: formData.get("debit_account_id"),
    credit_account_id: formData.get("credit_account_id"),
    amount: formData.get("amount"),
    notes: formData.get("notes") || null,
  });

  if (payload.debit_account_id === payload.credit_account_id) {
    throw new Error("Debit and credit accounts must be different.");
  }

  const supabase = createSupabaseAdmin();

  const { data: entry, error: entryError } = await supabase
    .from("journal_entries")
    .insert({
      journal_date: payload.journal_date,
      reference_number: payload.reference_number,
      description: payload.description,
      source_module: "manual",
    })
    .select("id")
    .single();

  if (entryError) throw new Error(entryError.message);
  if (!entry?.id) throw new Error("Journal entry was not created.");

  const { error: linesError } = await supabase.from("journal_lines").insert([
    {
      journal_entry_id: entry.id,
      account_id: payload.debit_account_id,
      debit_amount: payload.amount,
      credit_amount: 0,
      notes: payload.notes,
    },
    {
      journal_entry_id: entry.id,
      account_id: payload.credit_account_id,
      debit_amount: 0,
      credit_amount: payload.amount,
      notes: payload.notes,
    },
  ]);

  if (linesError) throw new Error(linesError.message);

  revalidatePath("/accounting");
  revalidatePath("/dashboard");
}
