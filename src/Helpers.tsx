import { Point, Size, Crop, Inset} from "./DataObjects";
const PERCENT_MULT = 100

export function Round(x:number,decimals:number=2):number{
    const mult = 10**decimals
    return Math.round((x + Number.EPSILON) * mult) / mult
}

export function PercentToRatio(percent:number):number {return percent/PERCENT_MULT}

export function PixelToPercent(point:Point,size:Size):Point
{
    return ConvertPointToNewSize(point,size,GeneratePercentSize())
}

export function ClampPercent(percent:number):number {return percent < 0 ? 0 : percent > PERCENT_MULT? PERCENT_MULT: percent}

export function PercentToPixel(point:Point,size:Size):Point
{
    return ConvertPointToNewSize(point,GeneratePercentSize(),size)
}

function GeneratePercentSize():Size {return {width:PERCENT_MULT,height:PERCENT_MULT};}


/**
 * Flips the vertical axis of a point within a given size. This function can convert coordinates
 * from a top-left origin to a bottom-left origin and vice versa.
 * 
 * If no size object is provided, the function assumes the coordinates of the point are in percentage
 * terms relative to a theoretical 100% height, which effectively makes the operation context-independent.
 * 
 * @param point The point whose vertical axis is to be flipped.
 * @param size The size of the canvas from which the point's coordinates are derived.
 * @returns A new point with the vertical coordinate flipped.
 * 
 * @example
 * // If the canvas size is { width: 100, height: 200 } and the point is { x: 49, y: 180 },
 * // flipping the vertical axis would change the point to { x: 49, y: 20 }.
 */
export function FlipVerticalAxis(point:Point, size:Size):Point {return {x:point.x,y:size.height-point.y}}

export function FlipVerticalPercent(point:Point):Point
{    const size = GeneratePercentSize()
    return FlipVerticalAxis(point,size)
}


/**
 * Converts a given point within an old image size to a proportionally equivalent point in a new image size.
 * This function adjusts a point's coordinates based on the relative dimensions of two images.
 * 
 * @param point The point within the original image to convert.
 * @param oldSize The size of the original image.
 * @param newSize The size of the new image to which the point should be converted.
 * @returns A new point with coordinates adjusted to the new image size.
 * 
 * @example
 * // If a point is located at 85% of the height and 2% of the width in the original size,
 * // it will be converted to a point at the same percentages in the new size.
 */
export function ConvertPointToNewSize(point:Point, oldSize:Size, newSize:Size):Point
{
    return {x:point.x*newSize.width/oldSize.width,y:point.y*newSize.height/oldSize.height};
}


/**
 * Proportionally rescales a size based on the scale change between two other sizes.
 * This is useful when resizing elements within a layout that has been resized and you want to maintain proportionality.
 *
 * @param toRescale The size that needs to be rescaled.
 * @param oldSizeReference The original reference size before resizing.
 * @param newSizeReference The new reference size after resizing.
 * @returns A new size object scaled proportionally to the difference between the old and new reference sizes.
 */
export function ConvertSizeWithResize(toRescale:Size,oldSizeReference:Size,newSizeReference:Size):Size
{
    let pTemp:Point = {x:toRescale.width,y:toRescale.height}
    pTemp = ConvertPointToNewSize(pTemp,oldSizeReference,newSizeReference)
    return {width:pTemp.x,height:pTemp.y}
}

export function ConvertCropToNewSize(crop:Crop,oldSizeReference:Size, newSizeReference:Size):Crop
{
    const point = ConvertPointToNewSize(crop.point,oldSizeReference,newSizeReference)
    const size = ConvertSizeWithResize(crop.size,oldSizeReference,newSizeReference)
    return {point:point,size:size}
}

export function ConvertCropToTopLeft(crop:Crop,htmlImageSize:Size):Crop//re-defines crop to use top-left origin from default bottom-left origin
{
    let entryPoint = FlipVerticalAxis(crop.point,htmlImageSize)//references location of the Crop to the bottom left of the parent image
    entryPoint.y -= crop.size.height //point now references bottom left of crop
    return {...crop,point:entryPoint}

}

export function GenerateFullImageCrop(image:Size):Crop
{
    return {point:{x:0,y:0},size:{...image}}
}

export function CropToInset(crop:Crop,htmlImageSize:Size):Inset
{
    const top = htmlImageSize.height-(crop.size.height + crop.point.y)
    const bottom = crop.point.y
    const left = crop.point.x
    const right = htmlImageSize.width - (crop.size.width + crop.point.x)
    return {top:top,bottom:bottom,left:left,right:right}
}

export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}
