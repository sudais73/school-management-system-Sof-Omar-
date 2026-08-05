import { findAllClasses, createClass } from "./classes.repository";

export function getClasses() {
  return findAllClasses();
}

export function addClass(className: string, capacity?: number) {
  return createClass({ className, capacity });
}