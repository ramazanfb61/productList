import path from "path";
import fs from "fs/promises";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Adjust the limit as per your requirement
    },
  },
};

let jsonFilePath;
 if (process.env.NODE_ENV === "production") {
   jsonFilePath = path.join(process.cwd(), "data.json");
 } else {
   jsonFilePath = path.join(process.cwd(), "public", "data.json");
 }

const handler = async (req, res) => {
  if (req.method === "DELETE") {
    try {
      const { stkkod, filePath } = JSON.parse(req.body);

      if (!stkkod) {
        return res.status(400).json({ error: "stkkod is required." });
      }
      

      // read /public/data.json
      let jsonData;
      try {
        jsonData = await fs.readFile(jsonFilePath, "utf8");
      } catch (error) {
        console.error("Error reading JSON file:", error);
        return res
          .status(500)
          .json({ message: "Failed to read JSON file", error: error.message });
      }

      const data = JSON.parse(jsonData);

      const itemIndex = data.findIndex((item) => item.stkkod === stkkod);
      if (itemIndex === -1) {
        return res.status(404).json({ message: "Item not found" });
      }

      const deleteFilePath = path.join(
        process.cwd(),
        "public",
        data[itemIndex].path
      );
      // Dosyayı sil
      try {
        await fs.unlink(deleteFilePath);
      } catch (error) {
        console.error("Error deleting file:", error);
        return res
          .status(500)
          .json({ message: "Failed to delete file", error: error.message });
      }

      // JSON dosyasını güncelle
      data.splice(itemIndex, 1);
      await fs.writeFile(jsonFilePath, JSON.stringify(data, null, 2));

      return res.status(200).json({ message: "Success" });
    } catch (error) {
      console.error("Error occurred", error);
      return res.status(500).json({ message: "Failed", error: error.message });
    }
  } else if (req.method === "POST") {
    try {
      const { fileContent, fileName, key } = req.body;
      if (!fileContent || !fileName) {
        return res.status(400).json({ error: "No files received." });
      }

      const uploadPath = path.join(process.cwd(), "public", "uploads");

      // uploads klasörü var mı kontrol et
      try {
        await fs.access(uploadPath);
      } catch {
        await fs.mkdir(uploadPath, { recursive: true });
      }

      // dosya path
      const filePath = path.join(uploadPath, key + "-" + fileName);

      console.log(fileName);
      // dosya yaz/oluştur
      await fs.writeFile(filePath, fileContent, "base64");

      // JSON dosya yolu
      let jsonData = [];

      // JSON dosyasını oku
      try {
        const jsonString = await fs.readFile(jsonFilePath, "utf-8");
        jsonData = JSON.parse(jsonString);
      } catch (err) {
        console.error("Json read error: ", err);
      }

      const existingItem = jsonData.find((item) => item.stkkod === key);

      let oldFilePath = null;
      if (existingItem) {
        oldFilePath = path.join(process.cwd(), "public", existingItem.path);
      }

      if (oldFilePath) {
        try {
          await fs.unlink(oldFilePath);
        } catch (error) {
          console.error("Error deleting old file:", error);
        }
      }

      // Yeni veriyi JSON dosyasına ekle
      const newData = {
        path: `/uploads/${key + "-" + fileName}`,
        stkkod: key,
      };

      // Eski öğeyi sil ve yeni öğeyi ekle
      jsonData = jsonData.filter((item) => item.stkkod !== key);
      jsonData.push(newData);

      // JSON dosyasını güncelle
      await fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2));

      // API'ye kaydet
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/savejson`,
        {
          method: "POST",
          body: JSON.stringify(newData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to save JSON: ${response.statusText}`);
      }

      return res.status(201).json({ message: "Success" });
    } catch (error) {
      console.log("Error occurred ", error);
      return res.status(500).json({ message: "Failed" });
    }
  } else {
    res.setHeader("Allow", ["DELETE", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
