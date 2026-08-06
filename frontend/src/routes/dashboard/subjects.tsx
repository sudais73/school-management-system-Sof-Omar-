import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchClassesWithSubjects } from "@/features/subjects/services/subjects.api";
import { SubjectCard } from "@/features/subjects/components/SubjectCard";
import { AddSubjectModal } from "@/features/subjects/components/AddSubjectModal";
import type { ClassWithSubjects } from "@/types/subject";

export const Route = createFileRoute("/dashboard/subjects")({
  component: SubjectsPage,
});

function SubjectsPage() {
  const [classes, setClasses] = useState<ClassWithSubjects[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  function loadClasses() {
    return fetchClassesWithSubjects().then(setClasses);
  }

  useEffect(() => {
    loadClasses();
  }, []);

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-semibold text-ink">Subjects</h1>

      <div className="grid gap-5 md:grid-cols-3">
        {classes.map((classItem) => (
          <SubjectCard
            key={classItem.id}
            classItem={classItem}
            onAddSubject={(classId) => {
              setSelectedClassId(classId);
              setShowModal(true);
            }}
          />
        ))}
      </div>

      {showModal && selectedClassId && (
        <AddSubjectModal
          classId={selectedClassId}
          open={showModal}
          onClose={() => {
            setShowModal(false);
            loadClasses();
          }}
        />
      )}
    </div>
  );
}