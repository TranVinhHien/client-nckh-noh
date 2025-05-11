"use client"
import { useRouter } from "next/navigation";
import { classNames } from "primereact/utils";
import { cloneElement, CSSProperties, isValidElement, ReactElement, ReactNode, useEffect, useState } from "react";
import Header from "./components/header";
import { useGlobal } from "./components/Context";



const Layout = ({ children }:
    {
        children: ReactNode
    }) => {
  
const [isSidebarVisible, setIsSidebarVisible] = useState(false);
const  sharedValue = useGlobal();

  const toggleSidebar = () => {
      setIsSidebarVisible(!isSidebarVisible);
  };
 // Nếu chỉ truyền 1 child và nó là element, clone và thêm prop
 const childrenWithProps = isValidElement(children)
 ? cloneElement(children as ReactElement<any>, { isSidebarVisible })
 : children;
    return (
        <div>
            <div className='min-h-screen surface-100 overflow-hidden m-0'>
                <div >
                    {/* {sharedValue.showHeader  &&   <Header onClick={toggleSidebar} />} */}
                    {childrenWithProps}
                   
                </div>
            </div>
        </div>
    );
};

export default Layout;
