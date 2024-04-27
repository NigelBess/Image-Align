import React, { useEffect, MouseEventHandler, FC, useState, useRef} from 'react';
import {Point,Size, Crop, DefaultCrop, Inset} from '../DataObjects'
import * as Helpers from '../Helpers'



interface IPointSelectProperties {
    src:string
    displayX:boolean
    displayY:boolean
    crop:Crop//expects the crop as image pixel coordinates
    pointsChanged:(points: Point[])=>void//returns the points in image pixel coordinates
}

interface ImageSizes
{
    htmlSize:Size//size of the image in display pixels on screen (not equal to image size if the image is zoomed in/out)
    imgSize:Size//size of the actual image data
}

function GetRelativePositionPx(event:React.MouseEvent<HTMLElement>):[number,number]
{
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return [x,y]
}



export const PointSelect: FC<IPointSelectProperties> = ({src,displayX,displayY,crop,pointsChanged}) => {  
  
    const maxPoints:number = 1//set this to 2 in the future when we want to allow 2-point select
    const [points,setPoints] = useState<Array<Point>>([])
    const [lockedPointCount,setLockedPointCount] = useState<number>(0)
    const [inset,setInset] = useState<Inset>()

    const img = useRef<HTMLImageElement>(null)



    useEffect(()=>{
        ClearSelection()
        ResetCrop()
    },[src])

    useEffect(()=>{
        if(!img.current) return
        const sizes = ExtractImageSizes(img.current as HTMLImageElement)
        const inset = ConvertIncomingCrop(crop,sizes)
        setInset(inset)
    },[crop])

    function ClearSelection()
    {
        setLockedPointCount(0)
        setPoints([])
    }

    function ResetCrop()
    {
        if(!img.current) return
        const sizes = ExtractImageSizes(img.current as HTMLImageElement)
        const fullCrop = Helpers.GenerateFullImageCrop(sizes.htmlSize)
        const inset = Helpers.CropToInset(fullCrop,sizes.htmlSize)
        setInset(inset)
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
    const sizes = ExtractImageSizes(img.current as HTMLImageElement);
    const preparedPoints = points.slice(0, pointCount).map(p=>PreparePointForExport(p,sizes))
    pointsChanged(preparedPoints)
  }

  function ExtractImageSizes(image:HTMLImageElement):ImageSizes
  {
    return {htmlSize:{width:image.width,height:image.height},imgSize:{width:image.naturalWidth,height:image.naturalHeight}}
  }

  function PreparePointForExport(point:Point, sizes:ImageSizes):Point
  //converts point in html/screen coordinates to image coordinates
  { 
        point = Helpers.ConvertPointToNewSize(point,sizes.htmlSize,sizes.imgSize)
        point = Helpers.FlipVerticalAxis(point,sizes.imgSize)
        return point
  }

  function ConvertIncomingCrop(incoming:Crop,sizes:ImageSizes):Inset
  {
    let newCrop = Helpers.ConvertCropToNewSize(incoming, sizes.imgSize,sizes.htmlSize)
    const inset = Helpers.CropToInset(newCrop,sizes.htmlSize)
    return inset
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
            <img className='PrimaryImage' src={src}
            style={{
                opacity:"0.5"
            }}/>
            <img className='PrimaryImage' src={src} ref={img} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove} onClick={handleCLick}style={{
                clipPath: `inset( ${inset?.top}px ${inset?.right}px ${inset?.bottom}px ${inset?.left}px)`,//Top right bottom left
            }}/>
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


