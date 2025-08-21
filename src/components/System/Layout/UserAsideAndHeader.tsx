import React from "react";
import { User } from "lucide-react";
import { UserStore } from "@/zustand/user";
import LogoutButton from "@/components/LogoutButton";

type prop = {
  openAside?: boolean;
};

const UserAsideAndHeader: React.FC<prop> = ({ openAside }) => {
  const user = UserStore((state) => state.user);

  console.log(user);

  return (
    <div className="px-5 py-5 border-t-2 border-gray-400 flex items-center justify-between w-full">
      <div className="p-3 bg-gray-100 rounded-full">
        <User />
      </div>
      <div
        className={`${
          openAside ? "lg:ml-3 lg:w-full" : "lg:w-0 lg:ml-0"
        } ml-3 w-full overflow-hidden flex justify-between items-center`}
      >
        <span className="text truncate ">{user?.role}</span>

        <LogoutButton />
      </div>
    </div>
  );
};

export default UserAsideAndHeader;
