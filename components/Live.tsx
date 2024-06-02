import LiveCursors from "@/components/cursor/LiveCursors";
import {useMyPresence, useOthers} from "@/liveblocks.config";
import {useCallback, useEffect, useState} from "react";
import CursorChat from "@/components/cursor/CursorChat";
import {CursorMode, CursorState, Reaction} from "@/types/type";
import ReactionSelector from "@/components/reaction/ReactionButton";

const Live = () => {
  const others = useOthers();
  const [{cursor}, updateMyPresence] = useMyPresence() as any;
  const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden
  });
  const [reactions, setReactions] = useState<Reaction[]>([]);
  
  const handlePointerMove = useCallback((e:React.PointerEvent) => {
    e.preventDefault();
    
    if (cursor == null || cursorState.mode !== CursorMode.ReactionSelector) {
      const x = e.clientX - e.currentTarget.getBoundingClientRect().x;
      const y = e.clientY - e.currentTarget.getBoundingClientRect().y;
      updateMyPresence({cursor: {x, y}})
    }
    
  }, []);
  
  const handlePointerDown = useCallback((e:React.PointerEvent) => {
    e.preventDefault();
    const x = e.clientX - e.currentTarget.getBoundingClientRect().x;
    const y = e.clientY - e.currentTarget.getBoundingClientRect().y;
    updateMyPresence({cursor: {x, y}});
    
    setCursorState((state:CursorState) => cursorState.mode === CursorMode.Reaction ? {...state, isPressed:true} : state);
  }, []);
  
  const handlePointerUp = useCallback((e:React.PointerEvent) => {
    setCursorState((state:CursorState) => cursorState.mode === CursorMode.Reaction ? {...state, isPressed:true} : state);
  }, []);
  
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
  
  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerUp={handlePointerUp}
      onPointerDown={handlePointerDown}
      className="h-[100vh] w-full flex justify-center items-center text-center border-5 border-green-500 overflow-hidden"
    >
      <h1 className="text-2xl text-white">Jigma</h1>
      
      {cursor &&
        <CursorChat
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
        />
      }
      
      {cursorState.mode === CursorMode.Reaction && (
        <ReactionSelector
          setReaction={(reaction) => {
            setReaction(reaction);
          }}
        />
      )}
      
      <LiveCursors others={others} />
    </div>
  );
};

export default Live;
