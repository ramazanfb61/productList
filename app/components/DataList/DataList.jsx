"use client";
import { useState, useEffect } from "react";
import { BsCheckCircleFill, BsFillXCircleFill } from "react-icons/bs";
import { BiImageAdd } from "react-icons/bi";
import FilterButton from "./FilterButton";
import Pagination from "./Pagination";
import Image from "next/image";

// sayfadaki item sayısı
const ITEMS_PER_PAGE = 10;

export default function DataList() {
  // gelen ürünler
  const [products, setProducts] = useState([]);
  // şimdiki sayfa
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [filter, setFilter] = useState(false);
  const [jsonImages, setJsonImages] = useState([]);
  // toplam sayfa
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // ürünleri sayfalara böl
  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const sortedProducts = paginatedProducts.slice().sort((a, b) => {
    // Örneğin, isimlere göre sıralama yapmak için STKCINSI alanını kullanıyoruz.
    // Bu alana göre sıralama yapabilirsiniz.
    const nameA = a.STKCINSI.toUpperCase(); // Büyük/küçük harfe duyarlı sıralama
    const nameB = b.STKCINSI.toUpperCase();

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

  const jsonData = async () => {
    try {
      const response = await fetch(`/api/savejson`, { methods: "GET" });
      if (!response.ok) {
        throw new Error("API hatası: " + response.status);
      }
      const data = await response.json();
      console.log(data);
      setJsonImages(data);
    } catch (error) {
      console.error("Veri çekme hatası: ", error);
    }
  };
  const fetchData = async () => {
    try {
      const response = await fetch(`/api/products`, { methods: "GET" });
      if (!response.ok) {
        throw new Error("API hatası: " + response.status);
      }
      const data = await response.json();
      setProducts(data.data);
    } catch (error) {
      console.error("Veri çekme hatası: ", error);
    }
  };

  // fotoğraf yükleme
  async function handleFiles(e, key) {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("key", key);

    const data = await fetch(`/api/getImage`, {
      method: "POST",
      body: formData,
    });
    jsonData();
  }

  useEffect(() => {
    // tüm ürünleri al

    fetchData();
    jsonData();
  }, []);

  return (
    <div className=" h-3/5 mt-3">
      <section className="mb-3">
        <h3 className="text-3xl text-center">Ürünler</h3>
        <div>
          <div className="border flex justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItem={products.length}
            />
          </div>
        </div>
        <div className="overflow-auto md:rounded-lg shadow">
          <table className="md:mx-auto border w-full md:w-11/12">
            <thead className="bg-blue-900 text-white border-b-2 border-gray-200">
              <tr>
                <th className="p-3 w-10 text-sm font-semibold tracking-wide text-left">
                  <input type="checkbox" name="" id="" className="h-5 w-5" />
                </th>
                <th className="p-3 w-10 text-sm font-semibold tracking-wide text-left">
                  Image
                </th>
                <th className="p-3 w-72 text-sm font-semibold tracking-wide text-left">
                  <span className="flex items-center">
                    <span className="mr-1">İsim</span>
                    <FilterButton />
                  </span>
                </th>
                <th className="p-3 w-10 text-sm font-semibold tracking-wide text-left">
                  Stok Kodu
                </th>
                <th className="p-3 w-10 text-sm font-semibold tracking-wide text-left">
                  <span className=" w-24 flex items-center">
                    <span className="mr-1">Stok Sayısı</span>
                    <FilterButton />
                  </span>
                </th>
                <th className="p-3 w-10 text-sm font-semibold tracking-wide text-left">
                  <span className=" w-12 flex items-center">
                    <span className="mr-1">Fiyat</span>
                    <FilterButton />
                  </span>
                </th>
                <th className="p-3 w-10 text-sm font-semibold tracking-wide text-left">
                  Ders
                </th>
                <th className="p-3 w-10 text-sm font-semibold tracking-wide text-left">
                  Sınıf
                </th>
                <th className="p-3 w-16 text-sm font-semibold tracking-wide text-left">
                  Ürün Durumu
                </th>
                <th className="p-3 w-10 text-sm font-semibold tracking-wide text-center">
                  Image Ekle/Düzenle
                </th>
              </tr>
            </thead>
            <tbody className="text-left divide-y min-w-96 divide-gray-100">
              {paginatedProducts.map((product) => (
                <tr key={product.STKKOD} className="even:bg-gray-50">
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    <input type="checkbox" name="" id="" className="h-5 w-5" />
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {jsonImages.map(e => e.stkkod === product.STKKOD ? 'var' : 'yok')}
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {product.STKCINSI}
                  </td>
                  <td className="p-3 text-sm font-bold cursor-pointer text-blue-500 hover:underline whitespace-nowrap">
                    {product.STKKOD}
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {product.STOK}
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {product.FIYAT}
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {product.CARCATEGORY}
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    {product.CARGRADE}
                  </td>
                  <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    <span
                      className={`p-1.5 text-xs font-medium uppercase flex justify-evenly tracking-wider rounded-lg ${
                        product.STKOZKOD1 === "A"
                          ? "text-green-800 bg-green-200 pr-11"
                          : "text-red-800 bg-red-200"
                      }`}
                    >
                      {product.STKOZKOD1 === "A" ? (
                        <BsCheckCircleFill className="inline mr-2 self-center" />
                      ) : (
                        <BsFillXCircleFill className="inline mr-2 self-center" />
                      )}
                      {product.STKOZKOD1 === "A"
                        ? "Satışa uygun"
                        : "Satışa uygun değil"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap text-center">
                    <div className="flex flex-col pt-1 justify-center items-center">
                      <label
                        className="transition-all cursor-pointer p-2 rounded-full hover:bg-gray-300"
                        htmlFor={`file-${product.STKKOD}`}
                      >
                        <BiImageAdd className="w-7 h-7" />
                      </label>
                      <form>
                        <input
                          multiple
                          onChange={(event) =>
                            handleFiles(event, product.STKKOD)
                          }
                          type="file"
                          id={`file-${product.STKKOD}`}
                          className="hidden"
                          name="file"
                        />
                      </form>
                      <label
                        className=" w-24 text-xs  overflow-hidden text-ellipsis"
                        htmlFor={`file-${product.STKKOD}`}
                      ></label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
