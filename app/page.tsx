"use client"
import { fabric } from 'fabric';
import Live from "@/components/Live";
import Navbar from "@/components/Navbar";
import LeftSideBar from "@/components/LeftSideBar";
import RightSideBar from "@/components/RightSideBar";
import {useEffect, useRef, useState} from "react";
import {
  handleCanvasMouseMove,
  handleCanvasMouseDown,
  handleResize,
  initializeFabric,
  handleCanvasMouseUp
} from "@/lib/canvas";
import {ActiveElement} from "@/types/type";
import {useMutation, useStorage} from "@/liveblocks.config";
import {LiveMap} from "@liveblocks/client";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef(false);
  const shapeRef = useRef<fabric.Object | null>(null);
  const activeObjectRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<string | null>(null);

  const storage = useStorage((root) => root);
  console.log(storage)
  // const syncShapeInStorage = useMutation(({storage}, object) => {
  //   if (!object) return;
  //   const { objectId } = object;
  //   const shapeData = object.toJSON();
  //   shapeData.objectId = objectId;
  //   const canvasObjects = storage.get('canvasObjects');
  //   canvasObjects.set(objectId, shapeData);
  // }, [canvasObjects]);

  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: '',
    value: '',
    icon: '',
  });

  const handleActiveElement = (elem: ActiveElement) => {
    setActiveElement(elem);
    selectedShapeRef.current = elem?.value as string;
  }

  useEffect(() => {
    const canvas = initializeFabric({
      canvasRef,
      fabricRef
    });

    canvas.on("mouse:down", (options) => {
      handleCanvasMouseDown({
        options,
        canvas,
        selectedShapeRef,
        isDrawing,
        shapeRef,
      });
    });

    // canvas.on("mouse:move", (options) => {
    //   handleCanvasMouseMove({
    //     options,
    //     canvas,
    //     selectedShapeRef,
    //     isDrawing,
    //     shapeRef,
    //     syncShapeInStorage
    //   })
    // })
    //
    // canvas.on("mouse:up", (options) => {
    //   handleCanvasMouseUp({
    //     canvas,
    //     selectedShapeRef,
    //     isDrawing,
    //     shapeRef,
    //     syncShapeInStorage,
    //     activeObjectRef,
    //     setActiveElement
    //   })
    // })

    const eHandleResize = () => handleResize({ canvas: fabricRef.current });
    window.addEventListener('resize', eHandleResize);
    return () => {
      window.removeEventListener('resize', eHandleResize);
    }
  }, [canvasRef.current]);

  return (
    <main className="h-screen overflow-hidden">
      <Navbar
        activeElement={activeElement}
        handleActiveElement={handleActiveElement}
      />
      
      <section className="flex h-full flex-row">
        <LeftSideBar />
        <Live canvasRef={canvasRef} />
        <RightSideBar />
      </section>
    </main>
  );
}
