import LiveCursors from "@/components/cursor/LiveCursors";
import {useBroadcastEvent, useEventListener, useMyPresence, useOthers} from "@/liveblocks.config";
import {useCallback, useEffect, useMemo, useState} from "react";
import CursorChat from "@/components/cursor/CursorChat";
import {CursorMode, CursorState, Reaction, ReactionEvent} from "@/types/type";
import ReactionSelector from "@/components/reaction/ReactionButton";
import FlyingReaction from "@/components/reaction/FlyingReaction";
import useInterval from "@/hooks/useInterval";

type Props = {
  canvasRef: React.MutableRefObject<HTMLCanvasElement|null>;
}

const Live = ({ canvasRef }:Props) => {
  const others = useOthers();
  const [{cursor}, updateMyPresence] = useMyPresence() as any;
  const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden
  });
  const [reaction, setReaction] = useState<Reaction[]>([]);
  const broadcast = useBroadcastEvent();
  
  useInterval(() => {
    setReaction((reaction) => reaction.filter(r => r.timestamp > Date.now() - 4000));
  }, 1000);

  const intervalTime = useMemo(() => 100, []);
  useInterval(() => {
    if (cursorState.mode === CursorMode.Reaction && cursorState.isPressed && cursor) {
      setReaction((reactions) => reactions.concat({
        point: { x: cursor.x, y: cursor.y},
        value: cursorState.reaction,
        timestamp: Date.now()
      }));
      
      broadcast({
        x: cursor.x,
        y: cursor.y,
        value: cursorState.reaction
      })
    }
  }, intervalTime);
  
  useEventListener((eventData) => {
    const event = eventData.event as ReactionEvent;
    setReaction((reactions) => reactions.concat({
      point: { x: event.x, y: event.y},
      value: event.value,
      timestamp: Date.now()
    }));
  })
  
  const handlePointerMove = useCallback((e:React.PointerEvent) => {
    e.preventDefault();
    if (cursor == null || cursorState.mode !== CursorMode.ReactionSelector) {
      // const x = e.clientX - e.currentTarget.getBoundingClientRect().x;
      // const y = e.clientY - e.currentTarget.getBoundingClientRect().y;
      const x = e.clientX;
      const y = e.clientY;
      updateMyPresence({cursor: {x, y}})
    }
    
  }, []);
  
  const handlePointerDown = useCallback((e:React.PointerEvent) => {
    e.preventDefault();
    // const x = e.clientX - e.currentTarget.getBoundingClientRect().x;
    // const y = e.clientY - e.currentTarget.getBoundingClientRect().y;
    const x = e.clientX;
    const y = e.clientY;
    updateMyPresence({cursor: {x, y}});
    
    setCursorState((state:CursorState) => cursorState.mode === CursorMode.Reaction ? {...state, isPressed:true} : state);
  }, [cursorState.mode, setCursorState]);
  
  const handlePointerUp = useCallback((e:React.PointerEvent) => {
    setCursorState((state:CursorState) => cursorState.mode === CursorMode.Reaction ? {...state, isPressed:true} : state);
  }, [cursorState.mode, setCursorState]);
  
  const handlePointerLeave = useCallback((e:React.PointerEvent) => {
    setCursorState({mode:CursorMode.Hidden});
    updateMyPresence({cursor:null, message:null});
  }, []);
  
  useEffect(() => {
    const onKeyUp = (e:KeyboardEvent) => {
      if (e.key === '/') {
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: '',
        })
      }
      else if (e.key === 'e') {
        setCursorState({
          mode: CursorMode.ReactionSelector
        })
      }
      else if (e.key === 'Escape') {
        updateMyPresence({ message:'' });
        setCursorState({ mode:CursorMode.Hidden });
      }
    }
    const onKeyDown = (e:KeyboardEvent) => {
      if (e.key === '/') e.preventDefault();
    }
    
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('keydown', onKeyDown);
    }
  }, [updateMyPresence]);
  
  const setReactions = useCallback((reaction:string) => {
    setCursorState({
      mode: CursorMode.Reaction,
      reaction,
      isPressed: false
    })
  }, []);

  return (
    <div
      className="relative h-full w-full flex justify-center items-center text-center border-5 border-green-500"
      id="canvas"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerUp={handlePointerUp}
      onPointerDown={handlePointerDown}
    >
      <canvas ref={canvasRef} />

      {reaction.map((r) => (
        <FlyingReaction
          key={r.timestamp.toString()}
          x={r.point.x}
          y={r.point.y}
          timestamp={r.timestamp}
          value={r.value} />
      ))}
      
      {cursor &&
        <CursorChat
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
        />
      }
      
      {cursorState.mode === CursorMode.ReactionSelector && (
        <ReactionSelector setReaction={setReactions} />
      )}
      
      <LiveCursors others={others} />
    </div>
  );
};

export default Live;
