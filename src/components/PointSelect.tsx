import React, { useEffect, MouseEventHandler, FC, useState, useRef} from 'react';
import {Point,Size, Crop, Inset} from '../DataObjects'
import * as Helpers from '../Helpers'



interface IPointSelectProperties {
    src:HTMLImageElement
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
    const canvas = useRef<HTMLCanvasElement>(null)
    const zoom = useRef<number>(1)
    
    function canvasContext():CanvasRenderingContext2D
    {
        if(!canvas.current) throw Error("Canvas not found")
        const context = canvas.current.getContext('2d')
        if (context == null) throw Error("Canvas has no context")
        return context
    }


    useEffect(()=>{
        ClearSelection()
        ResetCrop()
        zoom.current = 1
        Draw()
    },[src])



    useEffect(()=>{
        if(!img.current) return
        const sizes = ExtractImageSizes(img.current as HTMLImageElement)
        const inset = ConvertIncomingCrop(crop,sizes)
        setInset(inset)
    },[crop])


    function setZoom(newZoom:number)
    {
        const MIN_ZOOM = 0.05
        const MAX_ZOOM = 5
        newZoom = Helpers.clamp(newZoom,MIN_ZOOM,MAX_ZOOM)
        zoom.current = newZoom
        Draw()
    }

    function Draw()
    {   const c = canvas.current
        if (!c) throw Error("Canvas not found");
        const width = src.width*zoom.current
        const height = src.height*zoom.current
        c.width = width
        c.height = height
        const context = canvasContext()
        context.drawImage(src,0,0,width,height)
        points.forEach(p => {
            context.fillRect(p.x,0,1,height)
            context.fillRect(0,p.y,width,1)
        });
    }

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
    Draw()
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

  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    let zoomAmount = 0;
    const zoomPerWheel = 0.05
    if (event.deltaY < 0) {
        zoomAmount = zoomPerWheel
    } else if (event.deltaY > 0) {
        zoomAmount = -zoomPerWheel
    }
    setZoom(zoom.current+zoomAmount)
  };



  const handleMouseLeave: MouseEventHandler<HTMLElement> = (event) =>  {
        //delete the horizontal and vertical lines currently following the cursor
        const unlocked = unlockedPoints()
        if (unlocked<=0) return
        setPoints(points.slice(0,-unlocked))
        Draw()
  }



  return (
    <div className='CanvasHolder'>
        <canvas className="PrimaryCanvas" ref={canvas} onMouseMove={handleMouseMove} onWheel={handleWheel} onClick={handleCLick} onMouseLeave={handleMouseLeave}></canvas>
        
    </div>
    

  );
};


