import React, { useState, useEffect, useRef, ReactNode} from 'react';

interface IOverlayProperties {
  targetId: string;  // Define the props using an interface
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


export const Overlay: React.FC<IOverlayProperties> = ({ targetId, children,direction }) => {  // Destructure the props correctly
  const overlayRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  let target:HTMLElement|null= null

  useEffect(() => {
    target ??= document.getElementById(targetId);

    const setPositionFromTarget = () => {
      if (target && overlayRef.current) {
        const [top,left] = GetPosition(direction,target.getBoundingClientRect())
        
        setPosition({
          top: top,  
          left: left
        });
      }
    };

    setPositionFromTarget();

    // Update position on window resize or scroll
    window.addEventListener('resize', setPositionFromTarget);
    window.addEventListener('scroll', setPositionFromTarget);

    return () => {
      window.removeEventListener('resize', setPositionFromTarget);
      window.removeEventListener('scroll', setPositionFromTarget);
    };
  }, );

  return (
    <div ref={overlayRef} style={{ 
      position: 'absolute',
       top: position.top, 
       left: position.left,
        zIndex: 1000,
         pointerEvents: 'none'}}>
      {children}
    </div>
  );
};


