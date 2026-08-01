import { forwardRef, type InputHTMLAttributes } from "react";

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(function AuthField(
  { label, id, ...props },
  ref,
) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        className="w-full rounded-lg border border-ulead-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-ulead-slate/60 focus:border-evergreen focus:ring-2 focus:ring-evergreen/15"
        {...props}
      />
    </div>
  );
});
