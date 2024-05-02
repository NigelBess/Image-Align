

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


export interface Rectangle{
    size:Size;
    point:Point;
}

export interface Inset{
    top:Rectangle;
    bottom:Rectangle;
    left:Rectangle;
    right:Rectangle;
}


export function DefaultCrop():Rectangle {return {point:DefaultPoint(),size:DefaultSize()}}