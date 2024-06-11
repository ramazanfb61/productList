import { NextResponse, NextRequest } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

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
  console.log(filename);
  try {
    await writeFile(
      path.join(process.cwd(), "/public/uploads/" + filename),
      buffer
    );
    const payload = {
      path: `/public/uploads/${filename}`,
      stkkod: key,
    };
    console.log("payload", payload);
    // kaydet
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/savejson`, {
      method: "POST",
      body: JSON.stringify(payload),
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
