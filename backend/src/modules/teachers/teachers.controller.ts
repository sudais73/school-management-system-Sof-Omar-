import type { Request, Response } from "express";
import { addTeacher } from "./teachers.service";

export async function createTeacherHandler(req: Request, res: Response) {
  const {
    fullName, email, gender, dateOfBirth, phone, alternatePhone, residentialAddress,
    employmentDate, employmentType, department, designation,
    highestQualification, specialization, professionalCertification,
    classId, subjectIds, isHomeroomTeacher,
  } = req.body;

  if (!fullName || !email || !classId || !subjectIds?.length) {
    return res.status(400).json({ message: "fullName, email, classId, and at least one subject are required" });
  }

  try {
    const result = await addTeacher({
      fullName, email, gender,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      phone, alternatePhone, residentialAddress,
      employmentDate: employmentDate ? new Date(employmentDate) : undefined,
      employmentType, department, designation,
      highestQualification, specialization, professionalCertification,
      classId, subjectIds, isHomeroomTeacher: !!isHomeroomTeacher,
    });

    res.status(201).json({
      teacher: result.teacher,
     setupOtp: result.otp,
    });
  } catch (err: any) {
    if (err.code === "P2002") {
      return res.status(409).json({ message: "A user with that email already exists" });
    }
    throw err;
  }
}