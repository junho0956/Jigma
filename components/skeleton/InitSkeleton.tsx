import React from 'react';
import NavbarSkeleton from "@/components/skeleton/Navbar";
import LeftSideBarSkeleton from "@/components/skeleton/LeftSideBar";
import RightSideBarSkeleton from "@/components/skeleton/RightSideBar";
import Spinner from "@/components/skeleton/Spinner";

const InitSkeleton = () => {
  return (
    <div className="h-screen overflow-hidden">
      <NavbarSkeleton />
      
      <section className="flex h-full w-full justify-between">
        <LeftSideBarSkeleton />
        <div className="flex justify-center items-center h-full w-full">
          <Spinner />
        </div>
        <RightSideBarSkeleton />
      </section>
      
      <div className="h-screen absolute inset-0 bg-opacity-30 bg-primary-black z-10" />
    </div>
  );
};

export default InitSkeleton;
