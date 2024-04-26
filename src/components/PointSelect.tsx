import React, { useEffect, MouseEventHandler, FC, useState, useRef} from 'react';
import {Point,Size} from '../DataObjects'
import * as Helpers from '../Helpers'



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

    const img = useRef<HTMLImageElement>(null)



    useEffect(()=>{
        ClearSelection()
    },[src])

    function ClearSelection()
    {
        setLockedPointCount(0)
        setPoints([])
    }

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
    broadcastPoints(lockedPointCount+1)
    setLockedPointCount(prev => prev+1)    
  }

  function broadcastPoints(pointCount:number)
  {
    if (!img.current) throw new Error("attempting to select points on a non-existing image. This is likely a bug");
    const preparedPoints = points.slice(0, pointCount).map(p=>PreparePointForExport(p,img.current as HTMLImageElement))
    console.log(preparedPoints[0].x)
    pointsChanged(preparedPoints)
  }

  function PreparePointForExport(point:Point, image:HTMLImageElement):Point
  //converts point in html/screen coordinates to image coordinates
  { 
        const htmlSize:Size = {width:image.width,height:image.height}
        const imgSize:Size = {width:image.naturalWidth,height:image.naturalHeight}
        point = convertPointToImagePixelLocations(point,htmlSize,imgSize)
        point = Helpers.FlipVerticalAxis(point,imgSize)
        return point
  }
  function convertPointToImagePixelLocations(point:Point,imageSizeHTML:Size, imageSizeActual:Size):Point
  {
    
    const x = convert(point.x,imageSizeHTML.width,imageSizeActual.width)
    const y = convert(point.y,imageSizeHTML.height,imageSizeActual.height)

    function convert(pixelValue:number,oldRange:number,newRange:number):number{
        return pixelValue*newRange/oldRange
    }
    return {x:x,y:y};
  }

  const handleMouseLeave: MouseEventHandler<HTMLElement> = (event) =>  {
        //delete the horizontal and vertical lines currently following the cursor
        const unlocked = unlockedPoints()
        if (unlocked<=0) return
        setPoints(points.slice(0,-unlocked))
  }



  return (
    <div>
        <span className='stack'>
            <img className='PrimaryImage' src={src} ref={img} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove} onClick={handleCLick}
            ></img>
            {points.map((point,index)=>
            <React.Fragment key={index}>
                    <div className="TargetLine" style={{/*vertical line: defines X positioning*/
                        top: 0,
                        left: point.x,
                        width: '1px',
                        height: '100%',
                        visibility: displayX ? "visible":"hidden",
                    }} />
                    <div className="TargetLine" style={{/*horizontal line: defines Y positioning*/
                        left: 0,
                        top: point.y,
                        width: '100%',
                        height: '1px',
                        visibility: displayY ? "visible":"hidden",
                    }} />
                </React.Fragment>
            )}
        </span>
        
    </div>
    

  );
};


