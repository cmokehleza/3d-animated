import { useEffect, useState, useCallback } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const IMAGES = [
  { src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png", bg: "#F4845F", panel: "#F79B7F" },
  { src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png", bg: "#6BBF7A", panel: "#85CC92" },
  { src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png", bg: "#E882B4", panel: "#ED9DC4" },
  { src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png", bg: "#6EB5FF", panel: "#8DC4FF" },
];

const GRAIN_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E`;

function getRole(activeIndex: number, itemIndex: number): "center" | "left" | "right" | "back" {
  if (itemIndex === activeIndex) return "center";
  if (itemIndex === (activeIndex + 3) % 4) return "left";
  if (itemIndex === (activeIndex + 1) % 4) return "right";
  return "back";
}

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Preload images
  useEffect(() => {
    IMAGES.forEach((img) => {
      const image = new Image();
      image.src = img.src;
    });
  }, []);

  const navigate = useCallback(
    (dir: "next" | "prev") => {
      if (isAnimating) return;
      setIsAnimating(true);
      setActiveIndex((prev) => (dir === "next" ? (prev + 1) % 4 : (prev + 3) % 4));
      setTimeout(() => setIsAnimating(false), 650);
    },
    [isAnimating]
  );

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: IMAGES[activeIndex].bg,
        transition: "background-color 650ms cubic-bezier(0.4,0,0.2,1)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="relative w-full" style={{ height: "100vh", overflow: "hidden" }}>
        {/* Grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 50,
            opacity: 0.4,
            backgroundImage: `url("${GRAIN_SVG}")`,
            backgroundSize: "200px 200px",
            backgroundRepeat: "repeat",
          }}
        />

        {/* Giant ghost text "3D SHAPE" */}
        <div
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none"
          style={{
            zIndex: 2,
            top: "18%",
          }}
        >
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(90px, 28vw, 380px)",
              fontWeight: 900,
              color: "white",
              opacity: 1,
              lineHeight: 1,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
            }}
          >
            3D SHAPE
          </span>
        </div>

        {/* Top-left brand "TOONHUB" */}
        <div
          className="absolute top-6 left-4 sm:left-8"
          style={{ zIndex: 60 }}
        >
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              color: "white",
              opacity: 0.9,
              letterSpacing: "0.18em",
            }}
          >
            TOONHUB
          </span>
        </div>

        {/* Carousel items */}
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          {IMAGES.map((item, index) => {
            const role = getRole(activeIndex, index);
            let leftVal: string;
            let bottomVal: string;
            let heightVal: string;
            let scaleVal: string;
            let blurVal: string;
            let opacityVal: number;
            let zIdx: number;

            if (role === "center") {
              leftVal = "50%";
              bottomVal = isMobile ? "22%" : "0";
              heightVal = isMobile ? "60%" : "92%";
              scaleVal = isMobile ? "1.25" : "1.68";
              blurVal = "0px";
              opacityVal = 1;
              zIdx = 20;
            } else if (role === "left") {
              leftVal = isMobile ? "20%" : "30%";
              bottomVal = isMobile ? "32%" : "12%";
              heightVal = isMobile ? "16%" : "28%";
              scaleVal = "1";
              blurVal = "2px";
              opacityVal = 0.85;
              zIdx = 10;
            } else if (role === "right") {
              leftVal = isMobile ? "80%" : "70%";
              bottomVal = isMobile ? "32%" : "12%";
              heightVal = isMobile ? "16%" : "28%";
              scaleVal = "1";
              blurVal = "2px";
              opacityVal = 0.85;
              zIdx = 10;
            } else {
              // back
              leftVal = "50%";
              bottomVal = isMobile ? "32%" : "12%";
              heightVal = isMobile ? "13%" : "22%";
              scaleVal = "1";
              blurVal = "4px";
              opacityVal = 1;
              zIdx = 5;
            }

            return (
              <div
                key={item.src}
                style={{
                  position: "absolute",
                  left: leftVal,
                  bottom: bottomVal,
                  height: heightVal,
                  aspectRatio: "0.6 / 1",
                  transform: `translateX(-50%) scale(${scaleVal})`,
                  filter: `blur(${blurVal})`,
                  opacity: opacityVal,
                  zIndex: zIdx,
                  transition:
                    "transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1)",
                  willChange: "transform, filter, opacity",
                }}
              >
                <img
                  src={item.src}
                  alt={`Figurine ${index + 1}`}
                  draggable={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    objectPosition: "bottom center",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom-left text + nav buttons */}
        <div
          className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24"
          style={{ zIndex: 60, maxWidth: 320 }}
        >
          <p
            style={{
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: isMobile ? "0.5rem" : "0.75rem",
              fontSize: isMobile ? "1rem" : "22px",
              color: "white",
              opacity: 0.95,
            }}
          >
            TOONHUB FIGURINES
          </p>
          <p
            className="hidden sm:block"
            style={{
              fontSize: "0.75rem",
              color: "white",
              opacity: 0.85,
              lineHeight: 1.6,
              marginBottom: isMobile ? "1rem" : "1.25rem",
            }}
          >
            The artwork is stunning, shipped fully prepared. The finish is a vision, the 3D craft is flawless. Many thanks! Wishing you the win. Order now.
          </p>
          <div className="flex gap-3">
            {/* Prev button */}
            <button
              onClick={() => navigate("prev")}
              style={{
                width: isMobile ? 48 : 64,
                height: isMobile ? 48 : 64,
                borderRadius: "50%",
                background: "transparent",
                border: "2px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "transform 150ms, background-color 150ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08)";
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <ArrowLeft size={26} strokeWidth={2.25} color="white" />
            </button>
            {/* Next button */}
            <button
              onClick={() => navigate("next")}
              style={{
                width: isMobile ? 48 : 64,
                height: isMobile ? 48 : 64,
                borderRadius: "50%",
                background: "transparent",
                border: "2px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "transform 150ms, background-color 150ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08)";
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <ArrowRight size={26} strokeWidth={2.25} color="white" />
            </button>
          </div>
        </div>

        {/* Bottom-right link "DISCOVER IT" */}
        <a
          href="#"
          className="flex items-center"
          style={{
            position: "absolute",
            bottom: isMobile ? "1.5rem" : "5rem",
            right: isMobile ? "1rem" : "2.5rem",
            zIndex: 60,
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(20px, 4vw, 56px)",
            fontWeight: 400,
            color: "white",
            opacity: 0.95,
            letterSpacing: "-0.02em",
            lineHeight: 1,
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "opacity 200ms",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "0.95";
          }}
        >
          DISCOVER IT
          <ArrowRight
            size={isMobile ? 20 : 32}
            strokeWidth={2.25}
            color="white"
            style={{ marginLeft: "0.25rem" }}
          />
        </a>
      </div>
    </div>
  );
}
