

export interface Point{
    x:number;
    y:number;
}
export function DefaultPoint():Point {return {x:0,y:0}}

export interface Size{
    width:number;
    height:number;
}
export function DefaultSize():Size {return {width:0,height:0}}


export interface Crop{
    size:Size;
    point:Point;
}

export interface Inset{
    top:number;
    bottom:number;
    left:number;
    right:number;
}

export function DefaultCrop():Crop {return {point:DefaultPoint(),size:DefaultSize()}}