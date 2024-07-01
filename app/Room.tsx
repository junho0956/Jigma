"use client";

import {ReactNode, useMemo} from "react";
import { RoomProvider } from "@/liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";
import InitSkeleton from "@/components/skeleton/InitSkeleton";
import {LiveMap} from "@liveblocks/client";

// const initCanvasObjects = new LiveMap<string, any>();
export function Room({ children }: { children: ReactNode }) {
  return (
    <RoomProvider id="my-room"
      initialPresence={{}}
      initialStorage={{ helloWorld: new LiveMap() }}
    >
      <ClientSideSuspense fallback={<InitSkeleton />}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
