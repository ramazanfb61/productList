import { NextResponse, NextRequest } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export const POST = async (req, res) => {
  const jsonFilePath = path.join(
    process.cwd(),
    "app",
    "api",
    "savejson",
    "data.json"
  );
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


export const DELETE = async (req) => {
  const formData = await req.formData();
  const stkkod = formData.get("stkkod");

  if (!stkkod) {
    return NextResponse.json({ error: "stkkod is required." }, { status: 400 });
  }

  const jsonFilePath = path.join(
    process.cwd(),
    "app",
    "api",
    "savejson",
    "data.json"
  );

  try {
    const jsonData = await fs.readFile(jsonFilePath, "utf-8");
    const data = JSON.parse(jsonData);

    const itemIndex = data.findIndex((item) => item.stkkod === stkkod);

    if (itemIndex === -1) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    const filePath = path.join(process.cwd(), "public", data[itemIndex].path);

    // Dosyayı sil
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error("Error deleting file:", error);
      return NextResponse.json({ message: "Failed to delete file", error: error.message }, { status: 500 });
    }

    // JSON dosyasını güncelle
    data.splice(itemIndex, 1);
    await fs.writeFile(jsonFilePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.error("Error occurred", error);
    return NextResponse.json(
      { message: "Failed", error: error.message },
      { status: 500 }
    );
  }
};
