import  {Point,Size} from './DataObjects'

export interface Dim
{
    x:number
    length:number
}
export function CalculateNewDim(oldDim:Dim,ratio:number):Dim
{
    const OldRatio = oldDim.x/oldDim.length
    let length:number = 0
    let x:number = 0
    if(ratio>=OldRatio)
    {
        length = oldDim.x / ratio
        x = oldDim.x
    } else
    {
        length = (oldDim.length - oldDim.x)/(1-ratio)
        x = length*ratio
    }
    return {x:x,length:length}
}

export function ConvertToDims(point:Point,size:Size):[Dim,Dim]
{
    const x:Dim = {x:point.x,length:size.width}
    const y:Dim = {x:point.y,length:size.height}
    return [x,y]
}