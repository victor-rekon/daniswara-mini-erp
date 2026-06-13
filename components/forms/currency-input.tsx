"use client";

import { useState } from "react";

type CurrencyInputProps = {
  name: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  defaultValue?: number | string;
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatRupiah(value: string) {
  const digits = onlyDigits(value);
  if (!digits) return "";

  return `Rp ${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(Number(digits))}`;
}

export function CurrencyInput({ name, placeholder = "Rp 0", className, required, defaultValue }: CurrencyInputProps) {
  const [value, setValue] = useState(defaultValue ? formatRupiah(String(defaultValue)) : "");

  return (
    <input
      name={name}
      value={value}
      onChange={(event) => setValue(formatRupiah(event.target.value))}
      inputMode="numeric"
      placeholder={placeholder}
      className={className}
      required={required}
    />
  );
}
