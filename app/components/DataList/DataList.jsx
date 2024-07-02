"use client";
import { useState, useEffect, useRef } from "react";
import { BsCheckCircleFill, BsFillXCircleFill } from "react-icons/bs";
import { BiImageAdd } from "react-icons/bi";
import { BsTrash3 } from "react-icons/bs";
import { toast } from "react-toastify";

// filter yapılmadı
import FilterButton from "./FilterButton";

import Pagination from "./Pagination";
import Image from "next/image";
import DeleteModal from "../DeleteModal";
import Modal from "../Modal";

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
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentStkkod, setCurrentStkkod] = useState(null);
  const fileInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(null);
  const [imageToDelete, setImageToDelete] = useState({ path: "", stkkod: "" });


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const AnimatedSpin = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        className={`fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 tra h-36 w-auto`}
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
  let paginatedProducts;

  if (products && products.length > 0) {
    paginatedProducts = products.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  } else {
    paginatedProducts = [];
  }

  const jsonData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/savejson`, { methods: "GET" });
      if (!response.ok) {
        throw new Error("API hatası: " + response.status);
      }
      const data = await response.json();
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
  const handleFileChange = (e, stkkod) => {
    const file = e.target.files[0];
    setCurrentStkkod(stkkod);
    setSelectedFile(file);
  };
  // foto modal
  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage("");
    setIsModalOpen(false);
  };

  const handleDisplayProductImage = (key, picture) => {
    openModal(picture);
  };

  useEffect(() => {
    if (!selectedFile) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);

    reader.onload = async () => {
      const base64Content = reader.result.split(",")[1]; // Get the base64 string without the prefix

      try {
        const response = await fetch(`/api/images`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileContent: base64Content,
            fileName: selectedFile.name,
            key: currentStkkod,
          }),
        });

        const data = await response.json();
        if (data.message === "Success") {
          toast.success("Başarılı!");
        } else {
          toast.error("Başarısız!");
        }
        fileInputRef.current.value = null;
        jsonData();
      } catch (error) {
        console.error("Failed to upload file", error);
      }
    };

    reader.onerror = () => {
      setMessage("Failed to read file");
    };
  }, [selectedFile]);

  async function deleteImage(filePath, stkkod) {
    // console.log("delete", stkkod, path);
    // const formData = new FormData();
    // formData.append("path", path);
    // formData.append("stkkod", stkkod);

    const payload = {
      filePath,
      stkkod,
    };

    const data = await fetch(`/api/images`, {
      method: "DELETE",
      body: JSON.stringify(payload),
    });
    const res = await data.json();

    if (res.message === "Success") {
      toast.success("Başarılı!");
    } else {
      toast.error("Başarısız!");
    }
    // close delete modal 
    console.log(filePath,stkkod);
    setIsDeleteModalOpen(false)
    jsonData();
  }
  // delete modal

  const handleDeleteProductImage = (imagePath, imageStkkod) => {
    // show delete modal = true
    // modalı aç
    setImageToDelete({ path: imagePath, stkkod: imageStkkod });
    
    setIsDeleteModalOpen(true);

    //deleteImage(imagePath,imageStkkod)
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };
  // get json(images) and product data
  useEffect(() => {
    // tüm ürünleri al

    fetchData();
    jsonData();
  }, []);

  return (
    <div className=" h-3/5 mt-3">
      {isLoading ? (
        <div className="absolute top-0 w-full h-full left-0 bg-slate-800 bg-opacity-40">
          <AnimatedSpin />
        </div>
      ) : (
        ""
      )}
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
                  Grub
                </th>
                <th className="p-3  text-sm font-semibold tracking-wide text-left">
                  Stok
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
              {paginatedProducts &&
                paginatedProducts.map((product) => {
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
                            <Image
                              src={image.path}
                              width={50}
                              height={50}
                              alt={image.stkkod}
                              className="cursor-pointer"
                              onClick={() =>
                                handleDisplayProductImage(
                                  product.STKKOD,
                                  image.path
                                )
                              }
                            />
                            <div className="flex cursor-pointer items-center px-2 mr-5 py-1">
                              <BsTrash3
                                onClick={() =>
                                  handleDeleteProductImage(
                                    image.path,
                                    image.stkkod
                                  )
                                }
                                className={`${
                                  jsonImages && image ? "block" : "hidden"
                                } w-4 h-4 text-red-700`}
                              />
                            </div>
                            <Modal isOpen={isModalOpen} onClose={closeModal}>
                              <img
                                src={selectedImage}
                                alt="Selected"
                                className="max-h-[80vh] w-auto"                              />
                            </Modal>
                            <DeleteModal
                              isOpen={isDeleteModalOpen}
                              onClose={closeDeleteModal}
                              onConfirm={() =>
                                deleteImage(imageToDelete.path, imageToDelete.stkkod)
                              }
                            />
                          </>
                        )}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        {product.STKCINSI}
                      </td>
                      <td className="p-3 text-sm font-bold text-blue-500 hover:underline whitespace-nowrap">
                        {product.STKKOD}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap hover:underline">
                        {product.STKOZKOD3}
                      </td>
                     
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap hover:underline">
                        {product.STKOZKOD5}
                      </td>
                      
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        <span
                          className={`p-1.5 text-xs font-medium uppercase flex justify-evenly tracking-wider rounded-lg ${
                            product.STKOZKOD1 === "A" ||
                            product.STKOZKOD3 === "B2"
                              ? "text-green-800 bg-green-200 pr-11"
                              : ""
                          }`}
                        >
                          {product.STKOZKOD1 === "A" ||
                          product.STKOZKOD3 === "B2" ? (
                            <BsCheckCircleFill className="inline mr-2 self-center" />
                          ) : (
                            ""
                          )}
                          {product.STKOZKOD1 === "A" ||
                          product.STKOZKOD3 === "B2"
                            ? "Satışa uygun"
                            : ""}
                        </span>
                      </td>
                      <td className="whitespace-nowrap text-center">
                        <form className="flex flex-col pt-1 justify-center items-center">
                          <label
                            className="transition-all cursor-pointer p-2 rounded-full hover:bg-gray-300"
                            htmlFor={`file-${product.STKKOD}`}
                          >
                            <BiImageAdd className="w-7 h-7" />
                          </label>
                          <input
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={(event) =>
                              handleFileChange(event, product.STKKOD)
                            }
                            type="file"
                            id={`file-${product.STKKOD}`}
                            className="hidden"
                            name="file"
                          />
                          <label
                            className=" w-24 text-xs  overflow-hidden text-ellipsis"
                            htmlFor={`file-${product.STKKOD}`}
                          ></label>
                        </form>
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
