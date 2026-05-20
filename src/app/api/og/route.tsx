import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type") ?? "results";
  const title = searchParams.get("title") ?? "LiftOff";
  const subtitle = searchParams.get("subtitle") ?? "";
  const badgeUrl = searchParams.get("badge") ?? "";

  const accentColor = type === "rank" ? "#8B5CF6" : "#FF6C37";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200",
          height: "630",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #07000F 0%, #0c0319 50%, #07000F 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "80",
            left: "300",
            width: "600",
            height: "600",
            borderRadius: "9999px",
            background: `radial-gradient(circle, ${accentColor}25, transparent 70%)`,
            filter: "blur(60px)",
          }}
        />

        {/* Badge */}
        {badgeUrl && (
          <img
            src={badgeUrl}
            width="160"
            height="160"
            style={{
              borderRadius: "32px",
              marginBottom: "32px",
              boxShadow: `0 0 60px ${accentColor}40`,
            }}
          />
        )}

        {/* Title */}
        <div
          style={{
            fontSize: "56",
            fontWeight: "900",
            background: `linear-gradient(135deg, ${accentColor}, #EC4899)`,
            backgroundClip: "text",
            color: "transparent",
            marginBottom: "12",
            textAlign: "center",
            padding: "0 60px",
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div
            style={{
              fontSize: "28",
              color: "rgba(255,255,255,0.6)",
              textAlign: "center",
              padding: "0 80px",
            }}
          >
            {subtitle}
          </div>
        )}

        {/* Footer branding */}
        <div
          style={{
            position: "absolute",
            bottom: "40",
            display: "flex",
            alignItems: "center",
            gap: "12",
          }}
        >
          <div
            style={{
              fontSize: "24",
              fontWeight: "800",
              color: "white",
            }}
          >
            Lift
          </div>
          <div
            style={{
              fontSize: "24",
              fontWeight: "800",
              background: "linear-gradient(135deg, #FF6C37, #EC4899)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Off
          </div>
          <div
            style={{
              fontSize: "18",
              color: "rgba(255,255,255,0.3)",
              marginLeft: "8",
            }}
          >
            by Postman
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
