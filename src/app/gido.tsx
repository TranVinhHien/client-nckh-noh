"use client"
import React, { useState, useEffect } from "react";
import styles from "./scrolltext/ScrollingText.module.css";

const ScrollingText = ({ text, speed = 100 }: { text: string, speed: number }) => {
    const [visibleText, setVisibleText] = useState("");

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            if (index < text.length) {
                setVisibleText((prev) => prev + text[index]);
                index++;
            } else {
                clearInterval(interval);
            }
        }, speed); // Tốc độ hiển thị từng ký tự

        return () => clearInterval(interval);
    }, [text, speed]);

    return (
        <div className={styles.scrollingContainer}>
            <p className={styles.scrollingText}>{visibleText}</p>
        </div>
    );
};

export default ScrollingText;
