import React, { useEffect, MouseEventHandler, FC, useState} from 'react';

export class Point{
    x:number = 0;
    y:number = 0;
}

interface IPointSelectProperties {
    src:string
    displayX:boolean
    displayY:boolean
    pointsChanged:(points: Point[])=>void
}

function GetRelativePositionPx(event:React.MouseEvent<HTMLElement>):[number,number]
{
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return [x,y]
}



export const PointSelect: FC<IPointSelectProperties> = ({src,displayX,displayY,pointsChanged}) => {  
  
    const maxPoints:number = 1//set this to 2 in the future when we want to allow 2-point select
    const [points,setPoints] = useState<Array<Point>>([])
    const [lockedPointCount,setLockedPointCount] = useState<number>(0)

    function unlockedPoints():number{// gives number of crosshairs currently not locked in
        return points.length-lockedPointCount
    }

  const handleMouseMove: MouseEventHandler<HTMLElement> = (event) =>  {
    if (lockedPointCount>= maxPoints) return//if we already have all points selected, do nothing

    const [x,y] = GetRelativePositionPx(event)
    let newPoints = [...points]
        
    if(unlockedPoints()<1)//check if we need to track a new point
    {
            
        newPoints = [...newPoints,{x,y}]
    } else//otherwise just move the last point
    {          
            newPoints[newPoints.length-1] = {x,y} 
    }
    setPoints(newPoints)
  }

  const handleCLick:MouseEventHandler<HTMLElement> = (event) =>  {
    pointsChanged(points.slice(0, lockedPointCount+1))    
    setLockedPointCount(prev => prev+1)
        
  }

  const handleMouseLeave: MouseEventHandler<HTMLElement> = (event) =>  {
        //delete the horizontal and vertical lines currently following the cursor
        const unlocked = unlockedPoints()
        if (unlocked<=0) return
        setPoints(points.slice(0,-unlocked))
  }


  return (
    <div>
        <div className='stack'>
            <div>hello workd</div>
            <img className='PrimaryImage' src={src} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove} onClick={handleCLick}
            ></img>
            {points.map((point,index)=>
            <React.Fragment key={index}>
                    <div className="TargetLine" style={{/*vertical line*/
                        top: 0,
                        left: point.x,
                        width: '1px',
                        height: '100%',
                        visibility: displayY ? "visible":"hidden",
                    }} />
                    <div className="TargetLine" style={{/*horizontal line*/
                        left: 0,
                        top: point.y,
                        width: '100%',
                        height: '1px',
                        visibility: displayX ? "visible":"hidden",
                    }} />
                </React.Fragment>
            )}
        </div>
        
    </div>
    

  );
};


