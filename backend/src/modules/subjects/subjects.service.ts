import { findClassesWithSubjects, createSubject } from "./subjects.repository";

export function getClassesWithSubjects() {
  return findClassesWithSubjects();
}

export function addSubject(classId: string, name: string) {
  return createSubject(classId, name);
}