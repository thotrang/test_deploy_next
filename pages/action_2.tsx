/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import anime from "animejs";
import Image from "next/image";
export default function Action1() {
  useEffect(() => {
    const textWrapper = document.querySelector(".ml3");
    if (textWrapper) {
      const text = textWrapper?.textContent?.replace(/\S|_/g, (match) => {
        if (match === "_") {
          return "<p class='letter text-2xl text-transparent'>_</p>";
        } else {
          return `<span class='letter'>${match}</span>`;
        }
      });
      textWrapper.innerHTML = text ?? "";
    }

    const animation = anime.timeline({ loop: true });
    animation
      .add({
        targets: ".ml3 .letter",
        opacity: [0, 1],
        easing: "easeInOutQuad",
        duration: 500,
        delay: (_: any, i: number) => 100 * (i + 1),
      })
      .add({
        targets: ".ml3",
        opacity: 0,
        duration: 100,
        easing: "easeOutExpo",
        delay: 10000,
      });

    return () => {
      animation.pause();
    };
  }, []);
  const styles = `.ml2 {
    font-weight: 900;
    font-size: 3.5em;
  }
  
  .ml2 .letter {
    display: inline-block;
    line-height: 1em;
  }
  `;
  const audioRef = useRef<HTMLAudioElement>(null);
  return (
    <div
      className=" h-screen w-screen text-7xl max-md:text-3xl leading-[80px] font-medium  relative"
      onClick={() => audioRef?.current?.play()}
    >
      <div className="absolute h-screen w-screen px-3 bg-transparent flex justify-center items-center text-center text-pink-200">
        <style>{styles}</style>
        <div className="ml3">
          Không biết nói gì hơn _ Mong em sang tuổi mới luôn vui vẻ, yêu đời,
          đạt được những điều mình mong muốn _ Chúc mừng sinh nhật em nhé _ I
          LOVE YOU
        </div>
      </div>
      <div className="absolute h-screen w-screen z-[-10]">
        <img
          src="https://gifsec.com/wp-content/uploads/2022/09/heart-gif-10.gif"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      <div className="hidden">
        <audio controls ref={audioRef} autoPlay loop>
          <source
            src="/Nhac-Chuong-Nothings-Gonna-Change-My-Love-for-You-Dave-Moffatt.mp3"
            type="audio/ogg"
          />
          <source
            src="/Nhac-Chuong-Nothings-Gonna-Change-My-Love-for-You-Dave-Moffatt.mp3"
            type="audio/mpeg"
          />
        </audio>
      </div>
    </div>
  );
}
