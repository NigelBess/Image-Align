import React, { useEffect, MouseEventHandler, FC, useState, useRef} from 'react';
import {Point,Size, Rectangle, Inset} from '../DataObjects'
import * as Helpers from '../Helpers'



interface IPointSelectProperties {
    src:HTMLImageElement
    displayX:boolean
    displayY:boolean
    crop:Rectangle|null//expects the crop as image pixel coordinates BL
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
    const canvasHolder = useRef<HTMLDivElement>(null);
    const zoom = useRef<number>(1)
    const lockedPoint = useRef<Point | null>(null)//stored in image pixel coordinates TL
    const hoverPoint = useRef<Point | null> (null)//stored in image pixel coordinates TL
    
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
        const canvasSize = sizes.canvasSize

        function RenderRectangle(rectangle:Rectangle,color:string)
        {
            const p = rectangle.point
            const s = rectangle.size
            context.fillStyle = color
            context.fillRect(p.x,p.y,s.width,s.height)
        }
        function RenderSelectionPoint(point:Point|null,color:string)
        {
            if(!point) return
            const canvasPoint = Helpers.ConvertPointToNewSize(point,sizes.imgSize,canvasSize)
            const rectangles:Rectangle[] = []
            if(displayY) 
            {
                rectangles.push(Helpers.GenerateRectangle(0,canvasPoint.y,canvasSize.width,1))
            }            
            if(displayX)
            {  
                rectangles.push(Helpers.GenerateRectangle(canvasPoint.x,0,1,canvasSize.height))
            }
            rectangles.forEach(rect => {
                RenderRectangle(rect,color)
                
            });
        }

        //draw lines for point selection
        const mainLineColor = "#F00"
        const secondLineColor = "#700"
        RenderSelectionPoint(lockedPoint.current,mainLineColor)
        const hoverPointColor =lockedPoint.current==null?mainLineColor:secondLineColor
        RenderSelectionPoint(hoverPoint.current,hoverPointColor)
        
        

        //draw crop overlay
        function RenderCrop(crop:Rectangle|null,color:string)
        {
            if(!crop) return

            
            const inset = ConvertCrop(crop,sizes)
            //draw 4 rectangles to overlay crop
            const rectangles = Helpers.InsetToArray(inset)
            rectangles.forEach(rect => {
                RenderRectangle(rect,color)
            });
        }
        const cropOverlayColor = "#0008"
        RenderCrop(crop,cropOverlayColor)

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
    if(canvas.current == null) return;
    let point = lockedPoint.current
    if(point != null)    point = Helpers.TLtoBLPoint(point,src.height);
    pointChanged(point)
  }

  function ExtractImageSizes(image:HTMLImageElement, canvas:HTMLCanvasElement):ImageSizes
  {
    return {canvasSize:{width:canvas.width,height:canvas.height},imgSize:{width:image.naturalWidth,height:image.naturalHeight}}
  }

  function ConvertCrop(incoming:Rectangle,sizes:ImageSizes):Inset
  {
    const canvasSize = sizes.canvasSize
    let newCrop = Helpers.ConvertCropToNewSize(incoming, sizes.imgSize,canvasSize)
    newCrop = Helpers.BLtoTLRectangle(newCrop,canvasSize.height)
    const inset = Helpers.CropToInset(newCrop,canvasSize)
    return inset
  }

  function handleWheel( event: React.WheelEvent) {
    event.stopPropagation();
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
    <div className='CanvasHolder' >
        <canvas className="PrimaryCanvas" ref={canvas} onWheel={handleWheel} onMouseMove={handleMouseMove} onClick={handleCLick} onMouseLeave={handleMouseLeave}></canvas>
        
    </div>
    

  );
};


