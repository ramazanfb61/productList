import { getAllData } from "../../../services/serviceOperations/index";
import { NextRequest, NextResponse } from "next/server";



export async function GET() {
  const data = await getAllData("STKKART");
  return NextResponse.json({ message: "Method GET", data });
}
