import { useState } from "react";
import { X, CheckCircle } from "lucide-react";
import { createTeacherRequest } from "../services/teachers.api";
import type { ClassWithSubjectsForAssignment } from "@/types/teacher";

type AddTeacherModalProps = {
  open: boolean;
  onClose: () => void;
  classes: ClassWithSubjectsForAssignment[];
  onSuccess: () => void;
};

const GENDER_OPTIONS = ["MALE", "FEMALE"];
const EMPLOYMENT_TYPE_OPTIONS = ["FULL_TIME", "PART_TIME", "CONTRACT"];
const DESIGNATION_OPTIONS = ["TEACHER", "CASHIER", "ADMIN"];

export function AddTeacherModal({ open, onClose, classes, onSuccess }: AddTeacherModalProps) {
  const [form, setForm] = useState({
    fullName: "", email: "", gender: "MALE", dateOfBirth: "", phone: "", alternatePhone: "",
    residentialAddress: "", employmentDate: "", employmentType: "FULL_TIME", department: "",
    designation: "TEACHER", highestQualification: "", specialization: "", professionalCertification: "",
  });
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
  const [isHomeroomTeacher, setIsHomeroomTeacher] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [setupOtp, setSetupOtp] = useState<string | null>(null);

  if (!open) return null;

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleClassChange(classId: string) {
    setSelectedClassId(classId);
    setSelectedSubjectIds([]);
  }

  function toggleSubject(subjectId: string) {
    setSelectedSubjectIds((prev) =>
      prev.includes(subjectId) ? prev.filter((id) => id !== subjectId) : [...prev, subjectId]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.fullName || !form.email) return setError("Name and email are required");
    if (!selectedClassId) return setError("Please select a class");
    if (selectedSubjectIds.length === 0) return setError("Please select at least one subject");

    setLoading(true);
    try {
      const result = await createTeacherRequest({
        ...form,
        classId: selectedClassId,
        subjectIds: selectedSubjectIds,
        isHomeroomTeacher,
      });
      setSetupOtp(result.setupOtp);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to add teacher");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="flex max-h-[80vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="font-serif text-xl font-bold text-ink">Add Teacher</h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        {setupOtp ? (
          <div className="p-6">
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-evergreen/20 bg-evergreen/[0.06] p-4">
              <CheckCircle className="mt-0.5 shrink-0 text-evergreen-deep" size={20} />
              <div>
                <p className="text-sm font-semibold text-ink">Teacher created successfully</p>
                <p className="mt-1 text-sm text-ulead-slate">
                  Share this one-time setup code with them so they can activate their account:
                </p>
                <p className="mt-2 rounded-lg bg-white px-3 py-2 font-mono text-lg font-semibold tracking-wider text-evergreen-deep">
                  {setupOtp}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-full rounded-lg bg-evergreen py-2.5 text-sm font-semibold text-white hover:bg-evergreen-deep"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
            <Section title="Basic information">
              <Field label="Full name" required>
                <input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} className={inputClass} placeholder="Selamawit Bekele" />
              </Field>
              <Field label="Email" required>
                <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} placeholder="teacher@ulead.school" />
              </Field>
              <Field label="Gender">
                <select value={form.gender} onChange={(e) => update("gender", e.target.value)} className={inputClass}>
                  {GENDER_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </Field>
              <Field label="Date of birth">
                <input type="date" value={form.dateOfBirth} onChange={(e) => update("dateOfBirth", e.target.value)} className={inputClass} />
              </Field>
            </Section>

            <Section title="Contact">
              <Field label="Phone"><input value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} /></Field>
              <Field label="Alternate phone"><input value={form.alternatePhone} onChange={(e) => update("alternatePhone", e.target.value)} className={inputClass} /></Field>
              <Field label="Address" full><input value={form.residentialAddress} onChange={(e) => update("residentialAddress", e.target.value)} className={inputClass} /></Field>
            </Section>

            <Section title="Employment">
              <Field label="Employment date">
                <input type="date" value={form.employmentDate} onChange={(e) => update("employmentDate", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Employment type">
                <select value={form.employmentType} onChange={(e) => update("employmentType", e.target.value)} className={inputClass}>
                  {EMPLOYMENT_TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t.replace("_", "-")}</option>)}
                </select>
              </Field>
              <Field label="Department"><input value={form.department} onChange={(e) => update("department", e.target.value)} className={inputClass} placeholder="Science" /></Field>
              <Field label="Designation">
                <select value={form.designation} onChange={(e) => update("designation", e.target.value)} className={inputClass}>
                  {DESIGNATION_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>
            </Section>

            <Section title="Qualifications">
              <Field label="Highest qualification"><input value={form.highestQualification} onChange={(e) => update("highestQualification", e.target.value)} className={inputClass} placeholder="B.Sc." /></Field>
              <Field label="Specialization"><input value={form.specialization} onChange={(e) => update("specialization", e.target.value)} className={inputClass} placeholder="Mathematics" /></Field>
              <Field label="Certification" full><input value={form.professionalCertification} onChange={(e) => update("professionalCertification", e.target.value)} className={inputClass} /></Field>
            </Section>

            <div className="mb-6 border-t border-ulead-line pt-6">
              <h3 className="mb-3 font-serif text-base font-semibold text-ink">Class & subject assignment</h3>

              <label className="mb-1.5 block text-sm font-medium text-ink">
                Select class <span className="text-red-500">*</span>
              </label>
              <select value={selectedClassId} onChange={(e) => handleClassChange(e.target.value)} className={`${inputClass} mb-4 md:w-1/2`}>
                <option value="">-- Select a class --</option>
                {classes.map((c) => <option key={c.id} value={c.id}>{c.className}</option>)}
              </select>

              {selectedClass ? (
                selectedClass.subjects.length > 0 ? (
                  <>
                    <label className="mb-2 block text-sm font-medium text-ink">
                      Subjects in {selectedClass.className}
                      <span className="ml-1 font-normal text-ulead-slate">({selectedSubjectIds.length} selected)</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
                      {selectedClass.subjects.map((s) => (
                        <label key={s.id} className="flex cursor-pointer items-center gap-2 rounded-lg border border-ulead-line p-2.5 hover:bg-chalk">
                          <input type="checkbox" checked={selectedSubjectIds.includes(s.id)} onChange={() => toggleSubject(s.id)} className="accent-evergreen" />
                          <span className="text-sm font-medium text-ink">{s.name}</span>
                        </label>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="rounded-lg border border-dashed border-ulead-line p-4 text-center text-sm text-ulead-slate">
                    This class has no subjects yet — add some from the Subjects page first.
                  </p>
                )
              ) : (
                <p className="rounded-lg bg-chalk p-4 text-center text-sm text-ulead-slate">
                  Select a class above to see its subjects.
                </p>
              )}

              <label className="mt-4 flex items-center gap-2.5 rounded-lg border border-ulead-line p-3">
                <input type="checkbox" checked={isHomeroomTeacher} onChange={(e) => setIsHomeroomTeacher(e.target.checked)} className="accent-marigold" />
                <span className="text-sm text-ink">
                  Make this teacher the <strong>homeroom owner</strong> of {selectedClass ? selectedClass.className : "this class"}
                </span>
              </label>
            </div>

            {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

            <div className="flex gap-3 border-t border-ulead-line pt-5">
              <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-ulead-line py-2.5 text-sm font-medium text-ink hover:bg-chalk">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="flex-1 rounded-lg bg-evergreen py-2.5 text-sm font-semibold text-white hover:bg-evergreen-deep disabled:opacity-60">
                {loading ? "Creating..." : "Add Teacher"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const inputClass = "w-full rounded-lg border border-ulead-line px-3.5 py-2.5 text-sm outline-none focus:border-evergreen focus:ring-2 focus:ring-evergreen/15";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="mb-3 font-serif text-base font-semibold text-ink">{title}</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
    </div>
  );
}

function Field({ label, required, full, children }: { label: string; required?: boolean; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="mb-1.5 block text-sm font-medium text-ink">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}