import { useState } from "react";
import { X, CheckCircle } from "lucide-react";
import { createStudentRequest } from "../services/students.api";
import { FormSection, FormField, inputClass } from "@/components/form/form-field";
import type { SchoolClass } from "@/types/class";

type AddStudentModalProps = {
  open: boolean;
  onClose: () => void;
  classes: SchoolClass[];
  onSuccess: () => void;
};

const GENDER_OPTIONS = ["MALE", "FEMALE"];
const RELATIONSHIP_OPTIONS = ["Father", "Mother", "Guardian", "Uncle", "Aunt", "Grandparent"];
const STATUS_OPTIONS = ["ACTIVE", "GRADUATED", "SUSPENDED", "INACTIVE"];

export function AddStudentModal({ open, onClose, classes, onSuccess }: AddStudentModalProps) {
  const [form, setForm] = useState({
    firstName: "", middleName: "", lastName: "", gender: "MALE", dateOfBirth: "",
    residentialAddress: "", stateOfOrigin: "", nationality: "",
    guardianName: "", guardianRelationship: "Father", guardianPhone: "", guardianOccupation: "",
    guardianEmail: "", guardianAddress: "",
    classId: "", admissionDate: "", previousSchool: "", status: "ACTIVE",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ email: string; otp: string } | null>(null);

  if (!open) return null;

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.firstName || !form.lastName) return setError("First and last name are required");
    if (!form.guardianName || !form.guardianPhone) return setError("Guardian name and phone are required");

    setLoading(true);
    try {
      const res = await createStudentRequest(form);
      setResult({ email: res.generatedEmail, otp: res.setupOtp });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to add student");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="font-serif text-xl font-bold text-ink">Add Student</h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        {result ? (
          <div className="p-6">
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-evergreen/20 bg-evergreen/[0.06] p-4">
              <CheckCircle className="mt-0.5 shrink-0 text-evergreen-deep" size={20} />
              <div>
                <p className="text-sm font-semibold text-ink">Student created successfully</p>
                <p className="mt-1 text-sm text-ulead-slate">Login email (auto-generated):</p>
                <p className="mt-1 rounded-lg bg-white px-3 py-2 font-mono text-sm font-semibold text-evergreen-deep">{result.email}</p>
                <p className="mt-3 text-sm text-ulead-slate">One-time setup code — share with the guardian:</p>
                <p className="mt-1 rounded-lg bg-white px-3 py-2 font-mono text-lg font-semibold tracking-wider text-evergreen-deep">{result.otp}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-full rounded-lg bg-evergreen py-2.5 text-sm font-semibold text-white hover:bg-evergreen-deep">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
            <FormSection title="Student information">
              <FormField label="First name" required><input value={form.firstName} onChange={(e) => update("firstName", e.target.value)} className={inputClass} /></FormField>
              <FormField label="Middle name"><input value={form.middleName} onChange={(e) => update("middleName", e.target.value)} className={inputClass} /></FormField>
              <FormField label="Last name" required><input value={form.lastName} onChange={(e) => update("lastName", e.target.value)} className={inputClass} /></FormField>
              <FormField label="Gender">
                <select value={form.gender} onChange={(e) => update("gender", e.target.value)} className={inputClass}>
                  {GENDER_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </FormField>
              <FormField label="Date of birth"><input type="date" value={form.dateOfBirth} onChange={(e) => update("dateOfBirth", e.target.value)} className={inputClass} /></FormField>
              <FormField label="Nationality"><input value={form.nationality} onChange={(e) => update("nationality", e.target.value)} className={inputClass} /></FormField>
              <FormField label="State of origin"><input value={form.stateOfOrigin} onChange={(e) => update("stateOfOrigin", e.target.value)} className={inputClass} /></FormField>
              <FormField label="Residential address" full><input value={form.residentialAddress} onChange={(e) => update("residentialAddress", e.target.value)} className={inputClass} /></FormField>
            </FormSection>

            <FormSection title="Guardian information">
              <FormField label="Full name" required><input value={form.guardianName} onChange={(e) => update("guardianName", e.target.value)} className={inputClass} /></FormField>
              <FormField label="Relationship">
                <select value={form.guardianRelationship} onChange={(e) => update("guardianRelationship", e.target.value)} className={inputClass}>
                  {RELATIONSHIP_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </FormField>
              <FormField label="Phone number" required><input value={form.guardianPhone} onChange={(e) => update("guardianPhone", e.target.value)} className={inputClass} /></FormField>
              <FormField label="Occupation"><input value={form.guardianOccupation} onChange={(e) => update("guardianOccupation", e.target.value)} className={inputClass} /></FormField>
              <FormField label="Email" full><input type="email" value={form.guardianEmail} onChange={(e) => update("guardianEmail", e.target.value)} className={inputClass} /></FormField>
              <FormField label="Address" full><input value={form.guardianAddress} onChange={(e) => update("guardianAddress", e.target.value)} className={inputClass} /></FormField>
            </FormSection>

            <FormSection title="Academic information">
              <FormField label="Class">
                <select value={form.classId} onChange={(e) => update("classId", e.target.value)} className={inputClass}>
                  <option value="">-- Select a class --</option>
                  {classes.map((c) => <option key={c.id} value={c.id}>{c.className}</option>)}
                </select>
              </FormField>
              <FormField label="Admission date"><input type="date" value={form.admissionDate} onChange={(e) => update("admissionDate", e.target.value)} className={inputClass} /></FormField>
              <FormField label="Previous school"><input value={form.previousSchool} onChange={(e) => update("previousSchool", e.target.value)} className={inputClass} /></FormField>
              <FormField label="Status">
                <select value={form.status} onChange={(e) => update("status", e.target.value)} className={inputClass}>
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </FormField>
            </FormSection>

            {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

            <div className="flex gap-3 border-t border-ulead-line pt-5">
              <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-ulead-line py-2.5 text-sm font-medium text-ink hover:bg-chalk">Cancel</button>
              <button type="submit" disabled={loading} className="flex-1 rounded-lg bg-evergreen py-2.5 text-sm font-semibold text-white hover:bg-evergreen-deep disabled:opacity-60">
                {loading ? "Adding..." : "Add Student"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}