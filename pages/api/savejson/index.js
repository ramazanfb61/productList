import fs from "fs/promises";
import path from "path";

// JSON dosyasının yolu
 let jsonFilePath;
 if (process.env.NODE_ENV === "production") {
   jsonFilePath = path.join(process.cwd(), "data.json");
 } else {
   jsonFilePath = path.join(process.cwd(), "public", "data.json");
 }

//let jsonFilePath = path.join(process.cwd(), "public", "data.json");


const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      // JSON dosyasını oku
      const jsonData = await fs.readFile(jsonFilePath, "utf-8");
      if (JSON.parse(jsonData).length > 0) {
        return res.json(JSON.parse(jsonData));
      }
      return res.json({ msg: "No Data" });
      // JSON verisini yanıt olarak gönder
    } catch (error) {
      // Hata durumunda uygun yanıtı gönder
      console.error("Error reading JSON file:", error);
      return res.json({ error: error });
    }
  } else if (req.method === "POST") {
    try {
      const body = await req.body;
      const { stkkod, ...newData } = body;

      // JSON dosyasını oku
      const jsonData = await fs.readFile(jsonFilePath, "utf-8");
      const data = JSON.parse(jsonData);

      // JSON dosyasındaki veriyi güncelle
      const updatedData = data.map((item) =>
        item.stkkod === stkkod ? { ...item, ...newData } : item
      );

      // Eğer eşleşen stkkod yoksa yeni öğeyi ekle
      if (!updatedData.find((item) => item.stkkod === stkkod)) {
        updatedData.push(body);
      }

      // Güncellenmiş veriyi JSON dosyasına yaz
      await fs.writeFile(jsonFilePath, JSON.stringify(updatedData, null, 2));

      // Başarılı yanıtı gönder
      res.json({ message: "Data successfully updated." });
    } catch (error) {
      // Hata durumunda uygun yanıtı gönder
      console.error("Error updating data:", error);
      res.json({ error: "An error occurred while updating data." });
    }
  }
};

//export const POST = async (req, res) => {};
export default handler;