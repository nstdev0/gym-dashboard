import { prisma } from "../../../database/db"

export const getMembersRepository = async () => {
  const members = await prisma.member.findMany();
  return members;
};