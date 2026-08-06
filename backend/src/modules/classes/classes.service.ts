import { findAllClasses, createClass, updateClass } from "./classes.repository";

export function getClasses() {
  return findAllClasses();
}

export function addClass(className: string, capacity?: number) {
  return createClass({ className, capacity });
}

export function editClass(id: string, className: string, capacity?: number) {
  return updateClass(id, { className, capacity });
}