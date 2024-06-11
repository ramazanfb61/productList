import prisma from "../../lib/prisma/index";

// GET ALL
export async function getAllData(tableName) {
  try {
    const data = await prisma[tableName].findMany();
    return data;
  } catch (error) {
   return { error: error.message};
  }
}