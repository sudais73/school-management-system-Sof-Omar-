import type { Request, Response } from "express";
import { addStudent, getStudents } from "./students.service";

export async function listStudentsHandler(_req: Request, res: Response) {
  const students = await getStudents();
  res.status(200).json({ students });
}

export async function createStudentHandler(req: Request, res: Response) {
  const {
    firstName, middleName, lastName, gender, dateOfBirth,
    residentialAddress, stateOfOrigin, nationality,
    classId, admissionDate, previousSchool, status,
    guardianName, guardianRelationship, guardianPhone, guardianOccupation, guardianEmail, guardianAddress,
  } = req.body;

  if (!firstName || !lastName) return res.status(400).json({ message: "firstName and lastName are required" });
  if (!guardianName || !guardianPhone) return res.status(400).json({ message: "guardianName and guardianPhone are required" });

  const result = await addStudent({
    firstName, middleName, lastName, gender,
    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
    residentialAddress, stateOfOrigin, nationality, classId,
    admissionDate: admissionDate ? new Date(admissionDate) : undefined,
    previousSchool, status,
    guardianName, guardianRelationship, guardianPhone, guardianOccupation, guardianEmail, guardianAddress,
  });

  res.status(201).json({ student: result.student, generatedEmail: result.email, setupOtp: result.otp });
}