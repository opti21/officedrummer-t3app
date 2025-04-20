"use client";

import { useAtom } from "jotai";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import Confetti from "react-confetti";
import Swal from "sweetalert2";
import {
  type WheelItem as BaseWheelItem,
  emptyWheelData,
  wowSoundVolumeAtom,
} from "~/server/state";

// Define the extended type including our custom fields
interface ExtendedWheelItem extends BaseWheelItem {
  requestText?: string;
  requestId?: number;
}

const Wheel = dynamic(
  () => import("react-custom-roulette").then((mod) => mod.Wheel),
  { ssr: false },
);

interface WheelWrapperProps {
  requests: ExtendedWheelItem[];
  isAdmin: boolean | undefined;
  deleteRequest: (args: { id: number }) => void; // Pass mutation function
}

export function WheelWrapper({
  requests,
  isAdmin,
  deleteRequest,
}: WheelWrapperProps) {
  const [mustStartSpinning, setMustStartSpinning] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [isExploding, setIsExploding] = useState(false);
  const [volume] = useAtom(wowSoundVolumeAtom); // Keep volume state if needed locally or pass from parent

  const audioRef = useRef<HTMLAudioElement>(null);

  // Ensure formattedRequests uses the extended type
  const formattedRequests: ExtendedWheelItem[] = useMemo(() => {
    if (!requests || requests.length === 0)
      return emptyWheelData as ExtendedWheelItem[]; // Ensure empty data conforms
    // Assuming requests prop is already formatted with the necessary fields
    return requests;
  }, [requests]);

  const playSound = async () => {
    if (audioRef.current) {
      await audioRef.current.play();
    }
  };

  const resetSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [audioRef, volume]);

  const handleRemoveRequest = (id: number) => {
    // Call the mutation function passed via props
    deleteRequest({ id });
  };

  const handleSpinClick = () => {
    resetSound();
    // Ensure we don't pick an index from emptyWheelData if it's active
    const actualRequestCount =
      formattedRequests === emptyWheelData ? 0 : formattedRequests.length;
    if (actualRequestCount > 0) {
      setPrizeNumber(Math.floor(Math.random() * actualRequestCount));
      setMustStartSpinning(true);
    }
  };

  const handleStopSpinning = async () => {
    setMustStartSpinning(false);
    setIsExploding(true);
    await playSound();

    // Access with optional chaining and check existence
    const winner = formattedRequests[prizeNumber];
    const winnerText = winner?.option ?? "Unknown";
    const winnerRequestText = winner?.requestText ?? ""; // Access the extended property

    void Swal.fire({
      title: "The winner is...",
      html: `<h1 class='text-xl font-bold'>${winnerText}</h1>
             <p>${winnerRequestText}</p>`, // Use the retrieved text
      backdrop: false,
      confirmButtonText: "Remove",
      showCancelButton: true,
      cancelButtonText: "Not Here",
    }).then((response) => {
      if (response.isConfirmed) {
        const winnerRequestId = winner?.requestId; // Access the extended property
        if (winnerRequestId !== undefined) {
          handleRemoveRequest(winnerRequestId);
        }
      }
    });
  };

  return (
    <>
      <audio ref={audioRef} src="/wow.mp3" preload="auto"></audio>
      <Confetti
        width={typeof window !== "undefined" ? window.innerWidth : 1920}
        height={typeof window !== "undefined" ? window.innerHeight : 1080}
        numberOfPieces={isExploding ? 1000 : 0}
        recycle={false}
        gravity={0.2}
        initialVelocityX={5}
        initialVelocityY={5}
        onConfettiComplete={() => setIsExploding(false)}
        style={{ zIndex: 20, position: "fixed", top: 0, left: 0 }} // Use fixed positioning for full screen
      />
      <div className="ofd-wheel-container relative aspect-square">
        {/* Pass the correctly typed data to Wheel.
            The Wheel component itself only uses the base properties,
            but we use the extended ones in our handlers. */}
        <Wheel
          mustStartSpinning={mustStartSpinning}
          onStopSpinning={handleStopSpinning}
          prizeNumber={prizeNumber}
          data={formattedRequests} // Pass the extended array
          backgroundColors={["#F49201", "#F24108", "#FFFFFF"]}
          textColors={["#000000"]} // Changed text color for visibility on white
          innerRadius={0}
          spinDuration={0.5}
          pointerProps={{
            src: "/leftStick.png",
            style: {
              transform: "rotate(-90deg)",
            },
          }}
          fontSize={15}
          radiusLineWidth={2}
        />
        {isAdmin && (
          <button
            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-[#df3428] p-8 text-white shadow-xl shadow-yellow-200 disabled:cursor-not-allowed disabled:opacity-50"
            // Adjusted positioning to center using translate
            onClick={handleSpinClick}
            // Disable if data is empty or spinning
            disabled={
              formattedRequests === emptyWheelData ||
              formattedRequests.length === 0 ||
              mustStartSpinning
            }
          >
            Spin
          </button>
        )}
      </div>
    </>
  );
}
