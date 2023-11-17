import { atom } from "jotai";
import { atomWithStorage } from 'jotai/utils'


export type WheelItem = {
  option: string;
  style: { textColor: string };
  optionSize?: number;
  requestText?: string;
  requestId?: number;
};

export const emptyWheelData = [
  { option: "Add", style: { textColor: "black" } },
  { option: "Names", style: { textColor: "black" } },
  { option: "to", style: { textColor: "black" } },
  { option: "the", style: { textColor: "black" } },
  { option: "Wheel", style: { textColor: "black" } },
];

export const wheelDataAtom = atomWithStorage<WheelItem[]>("wheelData", [])
export const wowSoundVolumeAtom = atomWithStorage<number>("wowSoundVolume", 0.5)