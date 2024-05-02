import React, { useEffect, MouseEventHandler, FC, useState, useRef} from 'react';
import {Point,Size, Crop, Inset} from '../DataObjects'
import * as Helpers from '../Helpers'



interface IPointSelectProperties {
    src:HTMLImageElement
    displayX:boolean
    displayY:boolean
    crop:Crop//expects the crop as image pixel coordinates
    pointChanged:(points: Point|null)=>void//returns the points in image pixel coordinates
}

interface ImageSizes
{
    htmlSize:Size//size of the image in display pixels on screen (not equal to image size if the image is zoomed in/out)
    imgSize:Size//size of the actual image data
}

function GetRelativePositionPx(event:React.MouseEvent<HTMLElement>):Point
{
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return {x,y}
}



export const PointSelect: FC<IPointSelectProperties> = ({src,displayX,displayY,crop,pointChanged}) => {  
  
    const maxPoints:number = 1//set this to 2 in the future when we want to allow 2-point select
    const [inset,setInset] = useState<Inset>()

    const canvas = useRef<HTMLCanvasElement>(null)
    const zoom = useRef<number>(1)
    const lockedPoint = useRef<Point | null>(null)
    const hoverPoint = useRef<Point | null> (null)
    
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
        const sizes = ExtractImageSizes(src as HTMLImageElement)
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

        function RenderSelectionPoint(point:Point|null)
        {
            if(!point) return
            context.fillRect(point.x,0,1,height)
            context.fillRect(0,point.y,width,1)
        }

        //draw lines for point selection
        RenderSelectionPoint(hoverPoint.current)
        RenderSelectionPoint(lockedPoint.current)


        //draw crop overlay

    }

    

    function ClearSelection()
    {
        lockedPoint.current = null
        hoverPoint.current = null
    }

    function ResetCrop()
    {
        const sizes = ExtractImageSizes(src)
        const fullCrop = Helpers.GenerateFullImageCrop(sizes.htmlSize)
        const inset = Helpers.CropToInset(fullCrop,sizes.htmlSize)
        setInset(inset)
    }


  const handleMouseMove: MouseEventHandler<HTMLElement> = (event) =>  {
    if (event.buttons & 1) 
        {
        handleCLick(event)
        return;
        } 
    if (lockedPoint.current) return//if we already have all points selected, do nothing

    const point = GetRelativePositionPx(event)
    let toChange = hoverPoint
    
    toChange.current = point
    Draw()
  }



  const handleCLick:MouseEventHandler<HTMLElement> = (event) =>  {
    lockedPoint.current = GetRelativePositionPx(event)
    hoverPoint.current = null
    Draw()    
    broadcastPoint()
  }

  function broadcastPoint()
  {
    pointChanged(lockedPoint.current)
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
        hoverPoint.current = null
        Draw()
  }



  return (
    <div className='CanvasHolder'>
        <canvas className="PrimaryCanvas" ref={canvas} onMouseMove={handleMouseMove} onWheel={handleWheel} onClick={handleCLick} onMouseLeave={handleMouseLeave}></canvas>
        
    </div>
    

  );
};


