"use client";

import Image from "next/image";
import { memo } from "react";

import { NavbarProps } from "@/types/type";
import ActiveUsers from "./users/ActiveUsers";

const Navbar = ({ activeElement }: NavbarProps) => {
  // const isActive = (value: string | Array<ActiveElement>) =>
  //   (activeElement && activeElement.value === value) ||
  //   (Array.isArray(value) && value.some((val) => val?.value === activeElement?.value));

  return (
    <nav className="flex select-none items-center justify-between gap-4 bg-primary-black px-5 text-white border-b-[0.5px]">
      <div className="text-white text-2xl">Jigma</div>
      <ActiveUsers />
    </nav>
  );
};

export default memo(
  Navbar,
  (prevProps, nextProps) =>
    prevProps.activeElement === nextProps.activeElement
);
