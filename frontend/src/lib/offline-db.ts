import Dexie, { type Table } from "dexie";

export type OfflineSession = {
  id: "current";
  userId: string;
  role: string;
  fullName: string;
  cachedAt: number;
};

export type CachedClass = {
  id: string; // classId
  className: string;
  students: { id: string; firstName: string; lastName: string; admissionNumber: string; gender: string | null }[];
  subjects: { id: string; name: string }[];
  cachedAt: number;
};

export type CachedGradeStructure = {
  key: string; // `${classId}:${subjectId}:${term}:${session}`
  structure: {
    id: string;
    title: string;
    term: string;
    session: string;
    components: { id: string; name: string; maxScore: number; status: "DRAFT" | "PUBLISHED" }[];
  };
  marks: Record<string, Record<string, number>>; // studentId -> componentId -> score, last known state
  cachedAt: number;
};

export type QueuedAttendance = {
  localId: string; // generated on-device (crypto.randomUUID())
  classId: string;
  date: string;
  records: { studentId: string; status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED" }[];
  createdAt: number;
  status: "pending" | "syncing" | "failed";
  lastError?: string;
};

export type QueuedMarks = {
  localId: string;
  componentId: string;
  marks: { studentId: string; score: number }[];
  action: "draft" | "release";
  createdAt: number;
  status: "pending" | "syncing" | "failed";
  lastError?: string;
};

class OfflineDB extends Dexie {
  session!: Table<OfflineSession, string>;
  cachedClasses!: Table<CachedClass, string>;
  cachedGradeStructures!: Table<CachedGradeStructure, string>;
  attendanceQueue!: Table<QueuedAttendance, string>;
  marksQueue!: Table<QueuedMarks, string>;

  constructor() {
    super("ulead-offline");
    this.version(1).stores({
      session: "id",
      cachedClasses: "id",
      cachedGradeStructures: "key",
      attendanceQueue: "localId, status",
      marksQueue: "localId, status",
    });
  }
}

export const offlineDb = new OfflineDB();