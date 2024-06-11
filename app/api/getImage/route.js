import { NextResponse, NextRequest } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import { jsonFilePath } from "../savejson/route";

export const POST = async (req, res) => {
  const formData = await req.formData();

  const file = formData.get("file");
  const key = formData.get("key");
  console.log(file.name, key);

  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = key + "-" + file.name.replaceAll(" ", "_");
  const uploadPath = process.cwd() + "/public/uploads/" + filename;

  console.log(filename);

  try {
    const jsonData = await fs.readFile(jsonFilePath, "utf-8");
    const data = JSON.parse(jsonData);

    const existingItem = data.find((item) => item.stkkod === key);
    let oldFilePath = null;
    if (existingItem) {
      console.log(existingItem.path);
      oldFilePath = path.join(process.cwd(), existingItem.path);
    }

    if (oldFilePath) {
      try {
        await fs.unlink(oldFilePath);
      } catch (error) {
        console.error("Error deleting old file:", error);
      }
    }

    await fs.writeFile(uploadPath, buffer);

    const newData = {
      path: `/uploads/${filename}`,
      stkkod: key,
    };
    console.log("newData", newData);
    // kaydet
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/savejson`, {
      method: "POST",
      body: JSON.stringify(newData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json({ Message: "Success", status: 201 });
  } catch (error) {
    console.log("Error occured ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};
