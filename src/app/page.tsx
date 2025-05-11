
"use client"  
import React, { useRef, useState } from "react";
import App from "./thu";
import Quill from "./quill";
import { Button } from "primereact/button";
import { CSSProperties } from "styled-components";
import { DataView } from "primereact/dataview";
import { classNames } from "primereact/utils";
import { Card } from "primereact/card";
import { ContextMenu } from "primereact/contextmenu";
export interface Data {
  title:string,
  content:string
}
export default function Home() {

  const [contents, setContents] = useState<Data[]>([{
    title:"bai1",
    content:"hih"
  },{
    title:"bai2",
    content:"hih"
  },{
    title:"bai3",
    content:"hih"
  },{
    title:"bai4",
    content:"hih"
  }]);
  const [contentShow,setContentShow]=useState<Data>({title:"",content:""});
  const [showslide, setShowslide] = useState(false);
  const handleContentChange = (data: any) => {
    setContentShow(data)
  };
  const handleShowSlideChange = (data: any) => {
    setShowslide(data)
  };
  const cm = useRef<any | null>(null);
  const onRightClick = (event:any) => {
    cm.current.show(event);
};
  const sidebarStyle: CSSProperties = {
      position: 'fixed',
      left:  false ? '0' : '-300px',
      top: '90px',
      transition: 'left 0.3s ease',
      // marginRight: "2rem"
  };

  const mainContentStyle: CSSProperties = {
      marginLeft:  false ? '250px' : '0',
      padding: '20px',
      width:  false ? 'calc(100% - 250px)' : '100%',
      transition: 'margin-left 0.3s ease, width 0.3s ease',
      // backgroundColor: '#2c3e50',
      paddingLeft:  false ? "4rem" : "2rem",
  };


  const itemTemplate = (product:Data, index:number) => {
      return (
        <div  
        onContextMenu={(event) => onRightClick(event)}
      className="p-m-2 w-full sm:w-30rem" style={{cursor:"pointer"}}>
        <Card title={product.title}  className="shadow-2 surface-card">

        </Card>
        <ContextMenu ref={cm}  model={[
         {
              label: 'Update',
              id:"update",
              command: () => {
                setContentShow(product);
            }
          },
            {
              label: 'SlideShow',
              id:"update"
          },
        ]} breakpoint="767px" />
      </div> 
      );
  };

  const listTemplate = (items:any) => {
      if (!items || items.length === 0) return null;

      let list = items.map((product:any, index:any) => {
          return itemTemplate(product, index);
      });

      return <div className="grid grid-nogutter">{list}</div>;
  };






  return (
    // <div className='flex p-3 w-100' style={{ marginTop: '4rem', display: 'flex' }}>
    <div className='flex p-3 w-100' style={{  display: 'flex' }}>
    <div className='flex p-3'>
    {/* <DataView style={{width:"250px"}} value={contents} listTemplate={listTemplate} /> */}
    </div>
    <div style={{ marginLeft: "1rem", flex: 1, ...mainContentStyle }}>
     <div >
       {showslide ?
        <App text={contentShow} onSave={handleShowSlideChange} /> :
        <div>
          <Quill onSave={handleContentChange} onShow={() => setShowslide(true)}  text={contentShow}/>
          {/* <Button>New Content</Button> */}
          
{
contentShow.content!=""&&
          <div className="mt-4" style={{borderTop:"2px solid #000",paddingTop:"16px"}} dangerouslySetInnerHTML={{ __html: contentShow.content }} />
}

        </div>
      }

    </div>
    </div>
</div>

  );
}
