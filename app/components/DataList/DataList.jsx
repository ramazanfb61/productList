"use client";
import { useState, useEffect } from "react";
import { BsCheckCircleFill, BsFillXCircleFill } from "react-icons/bs";
import { BiImageAdd } from "react-icons/bi";
import { BsTrash3 } from "react-icons/bs";

// filter yapılmadı
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
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState(false);
  const [jsonImages, setJsonImages] = useState([{ msg: "" }, { msg: "" }]);
  // toplam sayfa
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const AnimatedSpin = ({props}) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        className={props}
      >
        <path
          fill="currentColor"
          d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
          opacity="0.25"
        />
        <path
          fill="currentColor"
          d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
        >
          <animateTransform
            attributeName="transform"
            dur="0.75s"
            repeatCount="indefinite"
            type="rotate"
            values="0 12 12;360 12 12"
          />
        </path>
      </svg>
    );
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
      setIsLoading(true);
      const response = await fetch(`/api/savejson`, { methods: "GET" });
      if (!response.ok) {
        throw new Error("API hatası: " + response.status);
      }
      const data = await response.json();
      console.log(data);
      if (data.length < 1) {
        setJsonImages([{ msg: "Bos data" }, { msg: "bos data" }]);
        return;
      }
      setJsonImages(data);

      setIsLoading(false);
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
    // 'post' olursa image yükle 'delete' olursa sil

    const data = await fetch(`/api/getImage`, {
      method: "POST",
      body: formData,
    });
    jsonData();
  }

  async function deleteImage(path, stkkod) {
    console.log("delete", stkkod, path);
    const formData = new FormData();
    formData.append("path", path);
    formData.append("stkkod", stkkod);

    const data = await fetch(`/api/getImage`, {
      method: "DELETE",
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
      <section className="mb-2">
        <h3 className="text-3xl text-center">Ürünler</h3>
        <div>
          <div className="flex justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItem={products.length}
            />
          </div>
        </div>
        <div className="overflow-auto">
          <table className="md:mx-auto border w-full md:rounded-lg shadow">
            <thead className="bg-blue-900 text-white border-b-2 border-gray-200">
              <tr className="w-full border ">
                <th className="p-3 text-sm font-semibold tracking-wide text-left">
                  <input type="checkbox" name="" id="" className="h-5 w-5" />
                </th>
                <th className="p-3  text-sm font-semibold tracking-wide text-left">
                  Resim
                </th>
                <th className="p-3 col-span-3  text-sm font-semibold tracking-wide text-left">
                  <span className="flex items-center">
                    <span className="mr-1">İsim</span>
                  </span>
                </th>
                <th className="p-3  text-sm font-semibold tracking-wide text-left">
                  Stok Kodu
                </th>
                <th className="p-3  text-sm font-semibold tracking-wide text-left">
                  <span className=" w-24 flex items-center">
                    <span className="mr-1">Stok Sayısı</span>
                  </span>
                </th>
                <th className="p-3  text-sm font-semibold tracking-wide text-left">
                  <span className=" w-12 flex items-center">
                    <span className="mr-1">Fiyat</span>
                  </span>
                </th>
                <th className="p-3  text-sm font-semibold tracking-wide text-left ">
                  Ders
                </th>
                <th className="p-3  text-sm font-semibold tracking-wide text-left">
                  Sınıf
                </th>
                <th className="p-3  text-sm font-semibold tracking-wide text-center">
                  Ürün Durumu
                </th>
                <th className="p-3  text-sm font-semibold tracking-wide text-center">
                  Resim ekle
                </th>
              </tr>
            </thead>
            <tbody className="text-left divide-y min-w-96 divide-gray-100">
              {paginatedProducts.map((product) => {
                const image =
                  jsonImages && jsonImages.length > 0
                    ? jsonImages.find((e) => e.stkkod === product.STKKOD)
                    : { stkkod: "", path: "" };

                return (
                  <tr key={product.STKKOD} className="even:bg-gray-50 ">
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      <input
                        type="checkbox"
                        name=""
                        id=""
                        className="h-5 w-5"
                      />
                    </td>
                    <td className="flex p-3 text-sm text-gray-700 whitespace-nowrap box-content">
                      {jsonImages && image && image.path.length > 0 && (
                        <>
                          {isLoading ? <AnimatedSpin props={` h-11 w-11 absolute z-10 bg-opacity-30 bg-slate-500`} /> : ""}
                          <Image
                            src={image.path}
                            width={45}
                            height={45}
                            alt={image.stkkod}
                          />
                          <div className="flex cursor-pointer items-end px-2 py-1">
                            <BsTrash3
                              onClick={() =>
                                deleteImage(image.path, image.stkkod)
                              }
                              className={`${
                                jsonImages && image ? "block" : "hidden"
                              } w-4 h-4 text-red-700`}
                            />
                          </div>
                        </>
                      )}
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
                          {isLoading && product.STKKOD ? (
                            <AnimatedSpin props={` h-7 w-7 absolute z-10 bg-opacity-30 bg-slate-500`} />
                          ) : (
                            <BiImageAdd className="w-7 h-7" />
                          )}
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
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
