"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { IoClose } from "react-icons/io5";

const Drawer = ({ children, title }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  //Handle Dynamic Params

  console.log("Current Path name is :", pathname);
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black/25 z-50 flex items-center justify-end">
      <div className="h-full w-1/4 bg-white shadow-2xl flex flex-col items-center p-6 overflow-y-auto">
        <div className="w-full flex items-center justify-between mb-12">
          <div className="text-3xl text-blue-600 font-semibold"> {title}</div>
          <a href={pathname}>
            <IoClose
              size={48}
              className="text-blue-950 drop-shadow-lg cursor-pointer"
            />
          </a>
        </div>
        <div className="grow flex flex-col items-center justify-center w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Drawer;
