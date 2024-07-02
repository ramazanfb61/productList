import DataList from "./components/DataList/DataList";
import { ToastContainer } from "react-toastify";

export default function Home() {
  return (
    <div>
      <div className="">
        <DataList />
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        draggable
        
      />
    </div>
  );
}
