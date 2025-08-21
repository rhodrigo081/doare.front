import { HeartHandshake, LayoutDashboard, History } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

type props = {
  openAside?: boolean;
};

const Navbar: React.FC<props> = ({ openAside }) => {
  const location = useLocation();

  const navbarItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="flex flex-shrink-0 w-6 h-6" />,
      link: "/dashboard",
    },
    {
      title: "Doadores",
      icon: <HeartHandshake className="flex flex-shrink-0 w-6 h-6" />,
      link: "/donors",
    },
    {
      title: "Histórico de Doações",
      icon: <History className="flex flex-shrink-0 w-6 h-6" />,
      link: "/donation-history",
    },
  ];

  return (
    <nav className="h-full">
      <ul className="w-full flex lg:block items-center justify-center h-full gap-3 lg:space-y-4">
        {navbarItems.map((item, index) => (
          <li key={index} className="my-1 lg:mb-2 text-black">
            <Link
              to={item.link}
              className={`flex items-center p-3 rounded-full lg:rounded-lg transition-all ${
                location.pathname === item.link
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span
                className={`${
                  openAside ? "lg:ml-3 lg:w-full" : "lg:w-0 lg:ml-0"
                } ml-3 w-full hidden lg:block overflow-hidden text-nowrap`}
              >
                {item.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
