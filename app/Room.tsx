"use client";

import { ReactNode } from "react";
import { RoomProvider } from "@/liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";
import InitSkeleton from "@/components/skeleton/InitSkeleton";

export function Room({ children }: { children: ReactNode }) {
  return (
    <RoomProvider id="my-room" initialPresence={{}}>
      <ClientSideSuspense fallback={<InitSkeleton />}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
