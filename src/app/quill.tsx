'use client' // Required only in App Router.
import dynamic from 'next/dynamic';
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { Data } from "./page";
import { Button } from "primereact/button";

const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
});

export default function Quill({ onSave,text,onShow }: { onSave: (data: any) => void ,text:Data,onShow:()=>void}) {
    const myColors = [
        "purple",
        "#785412",
        "#452632",
        "#856325",
        "#963254",
        "#254563",
        "white"
    ];
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ align: ["right", "center", "justify"] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            [{ color: myColors }],
            [{ background: myColors }]
        ]
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "link",
        "color",
        "image",
        "background",
        "align"
    ];

    const [code, setCode] = useState(
        {
            title:"",
            content:""
        }
    );
    useEffect(()=>{
        setCode(text)
    },[text])
    const handleProcedureContentChange = (content: string) => {
        setCode(pre=>{
            return {
                ...pre,
                content:content
            }

        });
    };
    const handleProcedureTitleChange = (e: any) => {
        setCode(pre=>{
            return {
                ...pre,
                title:e.target.value
            }

        });
    };
    return (
        <div style={{ position: "relative", width: "100%" }}>

            <div className="flex">

           
            <Button
                onClick={() => onSave(code)}
                outlined
                    >
                Save
            </Button>
            <Button
                      outlined
                      onClick={onShow} className="ml-2"
                      >Show slide</Button>
                </div>
            <ReactQuill
            
                theme="snow"
                modules={modules}
                formats={formats}
                value={code.content}
                placeholder="Content"
                onChange={handleProcedureContentChange}
                style={{ width: "100%", minHeight: "300px" }}
            />
            
        </div>
    );
}

export { Quill }