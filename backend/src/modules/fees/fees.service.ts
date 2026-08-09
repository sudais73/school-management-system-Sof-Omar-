import { createFeeStructure, findStructuresByClass, findStudentFeesByStructure } from "./fees.repository";
import { recordPayment as recordPaymentRepo } from "./fees.repository";

export function addFeeStructure(input: Parameters<typeof createFeeStructure>[0]) {
  return createFeeStructure(input);
}

export function getStructuresForClass(classId: string, session: string, term: string) {
  return findStructuresByClass(classId, session, term);
}

export function getStudentFees(feeStructureId: string) {
  return findStudentFeesByStructure(feeStructureId);
}