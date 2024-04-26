import { Point, Size} from "./DataObjects";
const PERCENT_MULT = 100

export function Round(x:number):number{
    return Math.round((x + Number.EPSILON) * 100) / 100
}

export function PixelToPercent(point:Point,size:Size):Point
{
    return {x:point.x/size.width*PERCENT_MULT,y:point.y/size.height*PERCENT_MULT}
}

export function PercentToPixel(point:Point,size:Size):Point
{
    return {x:point.x*size.width/PERCENT_MULT,y:point.y*size.height/PERCENT_MULT};
}

function GeneratePercentSize():Size {return {width:PERCENT_MULT,height:PERCENT_MULT};}

export function FlipVerticalAxis(point:Point, size:Size|null=null):Point
//converts coordinates starting from top-left to coordinates starting from bottom-left, or vice-versa
//if no size is given it assumes the point to be in percent coordinates
{
    if (!size) size = GeneratePercentSize()
    return {x:point.x,y:size.height-point.y}
}

