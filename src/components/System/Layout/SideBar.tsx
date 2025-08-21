import Navbar from "./Navbar";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { Link } from "react-router-dom";
import UserAsideAndHeader from "./UserAsideAndHeader";

//Importando Logo 
import logo from "@/assets/22ae72c2-d56e-4002-9acf-fe41d79a1f45-removebg-preview.png";

type Props = {
  openAside: boolean;
  setOpenAside: (open: boolean) => void;
};

const SideBar = ({ openAside, setOpenAside }: Props) => {
  const handleAside = () => {
    setOpenAside(!openAside);
  };

  return (
    <aside
      className={`fixed h-screen shadow-lg bg-white hidden lg:flex select-none overflow-hidden transition-all justify-between flex-col ${
        openAside ? "w-[309px]" : "w-[88px]"
      }`}
    >
      <div className="px-5 py-5 grid grid-a">
        <div className="flex justify-between items-center">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 w-auto transition-all overflow-hidden`}
          >
            <img
              className={`h-16 ${!openAside && "w-0"} transition-all object-contain`}
              src={logo}  
              width={100}
              height={1}
              alt="Logo A.R.L.S"
            />
          </Link>
          <div
            className="text-black cursor-pointer p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all"
            onClick={handleAside}
          >
            {openAside ? <PanelRightOpen /> : <PanelRightClose />}
          </div>
        </div>
        <div className="w-full h-[2px] bg-black opacity-30 my-5"></div>
        <Navbar openAside={openAside} />
      </div>
      <UserAsideAndHeader openAside={openAside} />
    </aside>
  );
};

export default SideBar;
