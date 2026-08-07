import  prisma  from "@/config/prisma";

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
}

export async function generateStudentEmail(firstName: string, lastName: string): Promise<string> {
  const base = `${slugify(firstName)}.${slugify(lastName)}`;
  let email = `${base}@ulead.school`;
  let suffix = 1;

  while (await prisma.user.findUnique({ where: { email } })) {
    suffix += 1;
    email = `${base}${suffix}@ulead.school`;
  }

  return email;
}