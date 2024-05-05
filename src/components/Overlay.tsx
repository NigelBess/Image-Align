import React, { useState, useEffect, useRef, ReactNode, RefObject} from 'react';

interface IOverlayProperties {
  targetRef: RefObject<HTMLElement>; 
  children: ReactNode;
  direction: OverlayDirection;
}

export enum OverlayDirection {
  Below,
  Right,
}

function GetPosition(direction: OverlayDirection, targetRect: DOMRect): [number, number] {
  let top = targetRect.top + window.scrollY;
  let left = targetRect.left + window.scrollX;

  if (direction === OverlayDirection.Below) {
    top += targetRect.height; // Position below the target
  } else if (direction === OverlayDirection.Right) {
    left += targetRect.width; // Position to the right of the target
  }

  return [top, left];
}


export const Overlay: React.FC<IOverlayProperties> = ({ targetRef, children,direction }) => {  // Destructure the props correctly
  const self = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(()=>{
    const observer = new ResizeObserver(targetRef => {
      UpdatePosition()
    });
    if (targetRef.current)
      observer.observe(targetRef.current)


    window.addEventListener('scroll', UpdatePosition);


    return () =>{
      observer.disconnect();
      window.removeEventListener('scroll', UpdatePosition);
    }
  },[]);//empty array to make sure this only runs once

  function UpdatePosition()
  {
      if (!targetRef.current || !self.current) return;
      const [top,left] = GetPosition(direction,targetRef.current.getBoundingClientRect())
      if (position.top === top && position.left===left) return
      setPosition({
          top: top,  
          left: left
        });
  }

  return (
    <div ref={self} style={{ 
      position: "absolute",
       top: position.top, 
       left: position.left,
        zIndex: 1000,
         pointerEvents: 'none'}}>
      {children}
    </div>
  );
};


