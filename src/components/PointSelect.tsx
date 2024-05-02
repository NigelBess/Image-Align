import React, { useEffect, MouseEventHandler, FC, useState, useRef} from 'react';
import {Point,Size, Crop, Inset} from '../DataObjects'
import * as Helpers from '../Helpers'



interface IPointSelectProperties {
    src:HTMLImageElement
    displayX:boolean
    displayY:boolean
    crop:Crop|null//expects the crop as image pixel coordinates
    pointChanged:(points: Point|null)=>void//returns the points in image pixel coordinates
}

interface ImageSizes
{
    canvasSize:Size//size of the image in display pixels on screen (not equal to image size if the image is zoomed in/out)
    imgSize:Size//size of the actual image data
}

function GetRelativePositionPx(event:React.MouseEvent<HTMLElement>,sizes:ImageSizes):Point//returns relative position in image pixel coordinates
{
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const canvasPoint:Point =  {x,y}
    return Helpers.ConvertPointToNewSize(canvasPoint,sizes.canvasSize,sizes.imgSize)
}



export const PointSelect: FC<IPointSelectProperties> = ({src,displayX,displayY,crop,pointChanged}) => {  
  
    const canvas = useRef<HTMLCanvasElement>(null)
    const zoom = useRef<number>(1)
    const lockedPoint = useRef<Point | null>(null)//stored in image pixel coordinates
    const hoverPoint = useRef<Point | null> (null)//stored in image pixel coordinates
    
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
        Draw()
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
    {   
        if (!canvas.current) throw Error("Canvas not found");
        const c = canvas.current as HTMLCanvasElement
        const width = src.width*zoom.current
        const height = src.height*zoom.current
        c.width = width
        c.height = height
        const context = canvasContext()
        context.drawImage(src,0,0,width,height)
        const sizes = ExtractImageSizes(src,c)

        function RenderSelectionPoint(point:Point|null)
        {
            if(!point) return
            const canvasPoint = Helpers.ConvertPointToNewSize(point,sizes.imgSize,sizes.canvasSize)
            if(displayX) context.fillRect(canvasPoint.x,0,1,height)
            if(displayY) context.fillRect(0,canvasPoint.y,width,1)
        }

        //draw lines for point selection
        RenderSelectionPoint(hoverPoint.current)
        RenderSelectionPoint(lockedPoint.current)


        //draw crop overlay
        function RenderCrop(crop:Crop)
        {
            if(!crop) return
            
            //const inset = Helpers.CropToInset(crop,sizes.htmlSize,sizes.imgSize)
            //draw 4 rectangles to overlay crop
            //top rectangle
        }

    }



    

    function ClearSelection()
    {
        lockedPoint.current = null
        hoverPoint.current = null
    }

    function ResetCrop()
    {  
        crop = null
    }


  const handleMouseMove: MouseEventHandler<HTMLElement> = (event) =>  {
    if (event.buttons & 1) 
        {
        handleCLick(event)
        return;
        } 
    if(canvas.current == null || src==null) return
    const sizes = ExtractImageSizes(src,canvas.current)

    const point = GetRelativePositionPx(event,sizes)
    let toChange = hoverPoint
    
    toChange.current = point
    Draw()
  }



  const handleCLick:MouseEventHandler<HTMLElement> = (event) =>  {
    if(canvas.current == null || src==null) return
    const sizes = ExtractImageSizes(src,canvas.current)
    lockedPoint.current = GetRelativePositionPx(event,sizes)
    hoverPoint.current = null
    Draw()    
    broadcastPoint()
  }

  function broadcastPoint()
  {
    pointChanged(lockedPoint.current)
  }

  function ExtractImageSizes(image:HTMLImageElement, canvas:HTMLCanvasElement):ImageSizes
  {
    return {canvasSize:{width:canvas.width,height:canvas.height},imgSize:{width:image.naturalWidth,height:image.naturalHeight}}
  }

  function PreparePointForExport(point:Point, sizes:ImageSizes):Point
  //converts point in html/screen coordinates to image coordinates
  { 
        point = Helpers.ConvertPointToNewSize(point,sizes.canvasSize,sizes.imgSize)
        point = Helpers.FlipVerticalAxis(point,sizes.imgSize)
        return point
  }

  function ConvertIncomingCrop(incoming:Crop,sizes:ImageSizes):Inset
  {
    let newCrop = Helpers.ConvertCropToNewSize(incoming, sizes.imgSize,sizes.canvasSize)
    const inset = Helpers.CropToInset(newCrop,sizes.canvasSize)
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
        hoverPoint.current = null
        Draw()
  }



  return (
    <div className='CanvasHolder'>
        <canvas className="PrimaryCanvas" ref={canvas} onMouseMove={handleMouseMove} onWheel={handleWheel} onClick={handleCLick} onMouseLeave={handleMouseLeave}></canvas>
        
    </div>
    

  );
};


