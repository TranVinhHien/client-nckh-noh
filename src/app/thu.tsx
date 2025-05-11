
"use client";
import { FloatLabel } from "primereact/floatlabel";
import { InputNumber } from "primereact/inputnumber";
import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
import { Data } from "./page";
import { useGlobal } from "./components/Context";


const scrollY = keyframes`
  0% {
    transform: translateY(5vh);
  }
  100% {
    transform: translateY(-100%);
  }
`;

const commonStyles = (props: { isPlaying: boolean }) => css`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  animation: ${scrollY} var(--animation-duration, 10s) linear infinite;
  animation-delay: 1s;
  animation-play-state: ${props.isPlaying ? 'running' : 'paused'};
`;





type AppProps = {
  onSave: (data: any) => void;
  text: Data;
};

const App: React.FC<AppProps> = ({ onSave, text }) => {
  const sharedValue = useGlobal();
  const [showControls, setShowControls] = useState<boolean>(true); // ẩn hiện các nút
  const inactivityTimerRef = useRef<NodeJS.Timeout>();// lấy thời gian để ẩn controollerr
  const [isPlaying, setIsPlaying] = useState<boolean>(true);// tùy chỉnh chạy hay không
  const [speed, setSpeed] = useState<number>(1);// tốc độ phát
  const [size, setSize] = useState<number>(24);// tốc độ phát
  const sizeEditRef = useRef<HTMLDivElement>(null);// set siZeable

  const [viewportHeight, setViewportHeight] = useState<number>(0);// cài chung với thằng speed
  const marqueeRef = useRef<HTMLDivElement>(null);// ?????

  const [progress, setProgress] = React.useState(0);// quá trình chạy 

  const handleIncreaseProgress = () => {
    setProgress((prev) =>prev + 5); //Math.min(, 100));
  };

  const handleDecreaseProgress = () => {
    setProgress((prev) => Math.max(prev - 5, 0));
  };

 
  useEffect(() => {
    const updateViewportHeight = () => {
      setViewportHeight(window.innerHeight);
    };
    updateViewportHeight();
    sharedValue.handleShowHeaqder(false);
    window.addEventListener("resize", updateViewportHeight);
    document.documentElement.requestFullscreen().catch((err) => {
      console.error(`Error attempting to enable full-screen mode: ${err.message}`);
    });
    return () => {
      window.removeEventListener("resize", updateViewportHeight);
    };
  }, []);


  useEffect(() => {
    console.log("size",size,"rèf",sizeEditRef)
    if (sizeEditRef.current) {
      sizeEditRef.current.style.setProperty("font-size", `${size}px`);
    }
  }, [size]);




  useEffect(() => {
    if (marqueeRef.current && viewportHeight > 0) {
      const totalDistance =  viewportHeight;
      let newDuration = totalDistance / speed;
      newDuration /= 30;
      marqueeRef.current.style.setProperty("--animation-duration", `${newDuration}s`);
    }
  }, [speed,  viewportHeight]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();

      switch (event.key) {
        case " ":
          setIsPlaying((prev) => !prev);
          break
        case 'ArrowUp':
          handleIncreaseProgress();
          break;
        case 'ArrowDown':
          handleDecreaseProgress();
          break;
        case 'ArrowRight':
            handleIncreaseProgress();
            break;
        case 'ArrowLeft':
            handleDecreaseProgress();
            break;
        default:
          break;
      }
      
    };

    const handleMouseActivity = () => {
      setShowControls(true);
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      inactivityTimerRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    handleMouseActivity();
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousemove", handleMouseActivity);
    window.addEventListener("mousedown", handleMouseActivity);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousemove", handleMouseActivity);
      window.removeEventListener("mousedown", handleMouseActivity);
    };
  }, []);

  const handlePausePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleExit = () => {
    onSave(false);
    sharedValue.handleShowHeaqder(true);
    document.exitFullscreen().catch((err) => {
      console.error(`Error attempting to exit full-screen mode: ${err.message}`);
    });
  };

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error(`Error attempting to exit full-screen mode: ${err.message}`);
      });
    }
  };

  useEffect(() => {
    if (!marqueeRef.current || progress === undefined) return;

    const element = marqueeRef.current;
    const animations = element.getAnimations();
    if (animations.length > 0) {
      const animation = animations[0];
      const timing = animation.effect?.getComputedTiming();
      const duration = timing?.duration;
      if (duration && typeof duration === 'number') {
        setIsPlaying(false)
        animation.currentTime = duration * (progress / 100);
        setIsPlaying(true)
      }
    }
  }, [progress]);




  return (
    <AppContainer className={showControls ? "" : "cursor-hidden"}>
      {showControls && (
        <ControlPanel>
          <div className="p-inputgroup flex-1">
            <FloatLabel>
              <InputNumber
                style={{ backgroundColor: "#000", width: "60px", height: "40px" }}
                id="number-input"
                min={0.01}
                max={100}
                value={size}
                onChange={(e: any) => setSize(e.value)}
              />
              <label htmlFor="number-input">Size</label>
            </FloatLabel>
          </div>
          <div className="p-inputgroup flex-1">
            <FloatLabel>
              <InputNumber
                style={{ backgroundColor: "#000", width: "60px", height: "40px" }}
                id="number-input"
                min={0.01}
                max={100}
                value={speed}
                onChange={(e: any) => setSpeed(e.value)}
              />
              <label htmlFor="number-input">Number</label>
            </FloatLabel>
          </div>
          <ControlButton onClick={handlePausePlay}>
            {isPlaying ? (
              <i className="pi pi-pause" style={{ color: "slateblue" }}></i>
            ) : (
              <i className="pi pi-stop" style={{ color: "slateblue" }}></i>
            )}
          </ControlButton>
          <ControlButton onClick={handleFullScreen}>
            <i className="pi pi-window-maximize" style={{ color: "slateblue" }}></i>
          </ControlButton>
          <ControlButton onClick={handleExit}>
            <i className="pi pi-times" style={{ color: "slateblue" }}></i>
          </ControlButton>
          <ControlButton onClick={handleDecreaseProgress}>
            <i className="pi pi-arrow-up" style={{ color: "slateblue" }}></i>
          </ControlButton>
          <ControlButton onClick={handleIncreaseProgress}>
            <i className="pi pi-arrow-down" style={{ color: "slateblue" }}></i>
          </ControlButton>
        </ControlPanel>
      )}
      <Wrapper>
        <Marquee >
          {/* <MarqueeGroup ref={marqueeRef} isPlaying={isPlaying}>
            <ContentWrapper style={{ width: "90vw" }} >
                  <div dangerouslySetInnerHTML={{ __html: text.content }} />
            </ContentWrapper>
          </MarqueeGroup> */}
                  <MarqueeGroup ref={marqueeRef}  isPlaying={isPlaying} >
                  <ContentWrapper  style={{ width: "90vw" ,}} >
                              <div
                                ref={sizeEditRef}
                              style={{transform:"scaleX(-1)"}}
                              dangerouslySetInnerHTML={{ __html: text.content }} />
                  </ContentWrapper>
                  </MarqueeGroup>

        </Marquee>
      </Wrapper>
    </AppContainer>
  );
};

export default App;

// Styles remain unchanged from your original code
const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  color: #fff;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin: 0;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  &.cursor-hidden {
    cursor: none;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Marquee = styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden;
  user-select: none;
  position: relative;
`;

// const scrollY = keyframes`
//   0% {
//     transform: translateY(5vh);
//   }
//   100% {
//     transform: translateY(-100%);
//   }
// `;

const common = css<{ isPlaying: boolean }>`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  animation: ${scrollY} var(--animation-duration, 10s) linear infinite;
  animation-delay: 1s;
  animation-play-state: ${props => (props.isPlaying ? 'running' : 'paused')};
`;

const MarqueeGroup = styled.div<{ isPlaying: boolean }>`
  ${commonStyles}
  padding-top: 100vh;
  padding-bottom: 100vh;
`;

const TextItem = styled.div`
  width: 90%;
  white-space: normal;
  font-size: 24px;
  margin-bottom: 30px;
  text-align: start;  
  transform: scaleX(-1); 
  color: #ffffff !important; 
  background: #000; 
  & * {
    color: #ffffff !important;
    background: #000 !important;
  }
`;

const ControlPanel = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  z-index: 10;
  & input {
    background: #000 !important;
    color: #ffffff !important;
  }
`;

const ControlButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  color: #ffffff;
  transition: background 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.4);
  }
`;

const ExitMessage = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: #000;
  font-size: 24px;
`;

const ContentWrapper = styled.div`
  width: 100%;

`;
