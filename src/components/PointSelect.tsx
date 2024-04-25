import React, { useEffect} from 'react';

export class Point{
    x:number = 0;
    y:number = 0;
}

interface IPointSelectProperties {
    src:string
    displayX:boolean
    displayY:boolean
    pointsChanged:(points: Point[])=>void
}




export const PointSelect: React.FC<IPointSelectProperties> = ({src,displayX,displayY}) => {  
  
    const handleMouseEnter: React.MouseEventHandler<HTMLImageElement> = (event) =>  {

    }
  
  const handleMouseMove: React.MouseEventHandler<HTMLImageElement> = (event) =>  {

  }

  const handleCLick:React.MouseEventHandler<HTMLImageElement> = (event) =>  {
    //generate a horizontal and vertical line across the image
  }

  const handleMouseLeave: React.MouseEventHandler<HTMLImageElement> = (event) =>  {

  }


  return (
    <img className='PrimaryImage' alt="Image to Edit" src={src} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove} onClick={handleCLick} />

  );
};


