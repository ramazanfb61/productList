import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

// JSON dosyasının yolu

export const jsonFilePath = path.join(
  process.cwd(),
  "app",
  "api",
  "savejson",
  "data.json"
);

export const GET = async (req, res) => {
  try {
    // JSON dosyasını oku
    const jsonData = await fs.readFile(jsonFilePath, "utf-8");
    if(JSON.parse(jsonData).length > 0){

      return NextResponse.json(JSON.parse(jsonData));
    }
    return NextResponse.json({msg:'No Data'})
    // JSON verisini yanıt olarak gönder
  } catch (error) {
    // Hata durumunda uygun yanıtı gönder
    console.error("Error reading JSON file:", error);
    return NextResponse.json({ error: error });
  }
};

export const POST = async (req, res) => {
  try {
    
    const body = await req.json();
    const { stkkod, ...newData } = body;

    // JSON dosyasını oku
    const jsonData = await fs.readFile(jsonFilePath, "utf-8");
    const data = JSON.parse(jsonData);

    // JSON dosyasındaki veriyi güncelle
    const updatedData = data.map(item => 
      item.stkkod === stkkod ? { ...item, ...newData } : item
    );

    // Eğer eşleşen stkkod yoksa yeni öğeyi ekle
    if (!updatedData.find(item => item.stkkod === stkkod)) {
      updatedData.push(body);
    }
  

    // Güncellenmiş veriyi JSON dosyasına yaz
    await fs.writeFile(jsonFilePath, JSON.stringify(updatedData, null, 2));

    // Başarılı yanıtı gönder
    NextResponse.json({ message: "Data successfully updated." });
  } catch (error) {
    // Hata durumunda uygun yanıtı gönder
    console.error("Error updating data:", error);
    NextResponse.json({ error: "An error occurred while updating data." });
  }
};
