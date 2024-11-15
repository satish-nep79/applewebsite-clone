import { useEffect, useRef, useState } from "react";
import { hightlightsSlides } from "../constants";
import gsap from "gsap";
import { pauseImg, playImg, replayImg } from "../utils";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger"; // Import ScrollTrigger

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

type VideoState = {
  isEnd: boolean;
  StartPlay: boolean;
  videoId: number;
  isLastVideo: boolean;
  isPlaying: boolean;
};

const VideoCarousel = () => {
  const videoRef = useRef<(HTMLVideoElement | null)[]>([]);
  const videoSpanRef = useRef<(HTMLElement | null)[]>([]);
  const videoDivRef = useRef<(HTMLElement | null)[]>([]);

  const [video, setVideo] = useState<VideoState>({
    isEnd: false,
    StartPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });
  const [loadedData, setLoadedData] = useState<any[]>([]);

  const { isEnd, StartPlay, videoId, isLastVideo, isPlaying } = video;

  useGSAP(() => {
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inout",
    });

    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        setVideo((prev) => ({
          ...prev,
          StartPlay: true,
          isPlaying: true,
        }));
      },
    });
  }, [isEnd, videoId]);

  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId]?.pause();
      } else {
        StartPlay && videoRef.current[videoId]?.play();
      }
    }
  }, [StartPlay, videoId, isPlaying, loadedData]);

  const handleLoadedData = (i: any, e: any) =>
    setLoadedData((prev) => [...prev, e]);

  useEffect(() => {
    let currentProgess = 0;
    let span = videoSpanRef.current;
    let videoDiv = videoDivRef.current;

    if (span[videoId] && videoDiv[videoId]) {
      // Animate the progress of the video
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100);
          if (progress !== currentProgess) {
            currentProgess = progress;
            gsap.to(videoDiv[videoId], {
              width:
                window.innerWidth < 760
                  ? "10vw"
                  : window.innerWidth < 1200
                  ? "10vw"
                  : "4vw",
            });
            gsap.to(span[videoId], {
              width: `${currentProgess}%`,
              backgroundColor: "#fff",
            });
          }
        },
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDiv[videoId], {
              width: "12px",
            });
            gsap.to(span[videoId], {
              backgroundColor: "#afafaf",
            });
          }
        },
      });

      if (videoId === 0) {
        anim.restart();
      }
      const animeUpdate = () => {
        const currentTime = videoRef.current[videoId]?.currentTime ?? 0;
        const duration = hightlightsSlides[videoId]?.videoDuration || 1;

        anim.progress(currentTime / duration);
      };

      if (isPlaying) {
        gsap.ticker.add(animeUpdate);
      } else {
        gsap.ticker.remove(animeUpdate);
      }
    }
  }, [videoId, StartPlay, isPlaying]);

  const handleProcess = (type: string, i: number = video.videoId) => {
    switch (type) {
      case "video-end":
        setVideo((prev) => ({
          ...prev,
          isEnd: true,
          videoId: i + 1,
        }));
        break;
      case "video-last":
        setVideo((prev) => ({
          ...prev,
          isLastVideo: true,
        }));
        break;
      case "video-reset":
        setVideo((prev) => ({
          ...prev,
          isLastVideo: false,
          videoId: 0,
        }));
        break;
      case "play":
        setVideo((prev) => ({
          ...prev,
          isPlaying: !prev.isPlaying,
        }));
        break;
      case "pause":
        setVideo((prev) => ({
          ...prev,
          isPlaying: false,
        }));
        break;
      default:
        return video;
    }
  };

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((slide, i) => (
          <div id="slider" className="sm:pr-20 pr-10" key={slide.id}>
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  id="video"
                  playsInline
                  preload="auto"
                  muted
                  ref={(el) => (videoRef.current[i] = el)}
                  onEnded={() => {
                    i !== 3
                      ? handleProcess("video-end", i)
                      : handleProcess("video-last");
                  }}
                  onPlay={() => {
                    setVideo((prev) => ({
                      ...prev,
                      isPlaying: true,
                    }));
                  }}
                  onLoadedData={(e) => handleLoadedData(i, e)}
                  className={`${
                    slide.id === 2 && "translate-x-44"
                  } pointer-events-none`}
                >
                  <source src={slide.video} type="video/mp4" />
                </video>
              </div>
              <div className="absolute top-12 left-[5%] z-10">
                {slide.textLists.map((text) => (
                  <p key={text} className="md:text-2xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current?.map((_, i) => (
            <span
              className="mx-2 w-3 h-3 bg-gray-100 rounded-full relative cursor-pointer"
              key={i}
              ref={(el) => (videoDivRef.current[i] = el)}
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => (videoSpanRef.current[i] = el)}
              />
            </span>
          ))}
        </div>
        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            onClick={
              isLastVideo
                ? () => handleProcess("video-reset")
                : !isPlaying
                ? () => handleProcess("play")
                : () => handleProcess("pause")
            }
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
