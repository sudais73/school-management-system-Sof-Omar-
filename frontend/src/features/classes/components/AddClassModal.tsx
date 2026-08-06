import { apiClient } from "#/lib/api";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { SchoolClass } from "#/types/class";


export function AddClassModal({
  onClose,
  onSaved,
  editClass,
}: {
  onClose: () => void;
  onSaved: () => void;
  editClass?: SchoolClass | null;
}) {
  const [className, setClassName] = useState("");
  const [capacity, setCapacity] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const isEdit = !!editClass;

  useEffect(() => {
    if (editClass) {
      setClassName(editClass.className);
      setCapacity(editClass.capacity ?? undefined);
    } else {
      setClassName("");
      setCapacity(undefined);
    }
  }, [editClass]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!className || !capacity) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      if (isEdit && editClass) {
        await apiClient.put(`/api/classes/${editClass.id}`, { className, capacity });
      } else {
        await apiClient.post("/api/classes", { className, capacity });
      }

      onSaved();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{isEdit ? "Edit Class" : "Add New Class"}</h2>
            <p className="text-sm text-gray-500 mt-1">{isEdit ? "Update class information" : "Create a new class"}</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class Name *</label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Enter class name"
                autoFocus
                className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Capacity *</label>
              <input
                type="number"
                min={1}
                value={capacity ?? ""}
                onChange={(e) => setCapacity(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Enter class capacity"
                className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !className || !capacity}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : isEdit ? "Update Class" : "Add Class"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}