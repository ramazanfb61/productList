import {
  AiOutlineDoubleRight,
  AiOutlineDoubleLeft,
  AiFillCaretRight,
  AiFillCaretLeft,
} from "react-icons/ai";

const Pagination = ({ currentPage, totalPages, onPageChange, totalItem }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };
  const handlePreviousTwice = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 2);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  const handleNextTwice = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 2);
    }
  };

  return (
    <div className="md:mr-16 pb-1 flex flex-col md:flex-row items-center mx-auto md:mx-0">
      <div className="md:mr-3">Kitap sayısı: {totalItem}</div>
      <div className="flex gap-x-2">
        <button
          className={`p-1.5 border hover:bg-gray-400 transition-all cursor-pointer `}
          onClick={handlePreviousTwice}
          disabled={currentPage === 2}
        >
          <AiOutlineDoubleLeft />
        </button>
        <button
          className="p-1.5 mx-1 border hover:bg-gray-400 transition-all cursor-pointer"
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          <AiFillCaretLeft />
        </button>

        <span className="flex justify-between items-center">
          <div className={`box-content rounded-full  bg-blue-900 p-1  text-white ${currentPage < 10 ? 'px-3' :'px-2' }`}>
            <div className="">
              {currentPage}
            </div>
          </div>
          <span>/</span>
          <span className="">{totalPages}</span>
        </span>
        <button
          className="p-1.5 mx-1 border hover:bg-gray-400 transition-all cursor-pointer"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          <AiFillCaretRight />
        </button>
        <button
          className="p-1.5 border hover:bg-gray-400 transition-all cursor-pointer"
          onClick={handleNextTwice}
          disabled={currentPage === totalPages}
        >
          <AiOutlineDoubleRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
