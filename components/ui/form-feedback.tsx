type FormFeedbackProps = {
  success?: string | string[];
  error?: string | string[];
};

function pick(value?: string | string[]) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function FormFeedback({ success, error }: FormFeedbackProps) {
  const successMessage = pick(success);
  const errorMessage = pick(error);

  if (!successMessage && !errorMessage) return null;

  if (errorMessage) {
    return (
      <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 shadow-card">
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200 shadow-card">
      {successMessage}
    </div>
  );
}
