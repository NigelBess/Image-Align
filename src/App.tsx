import React from 'react';
import './App.css';
import {ImageEdit} from './components/ImageEdit';
import BuyMeACoffee from './components/BuyMeACoffee';
import ghImage from "./img/github-logo.png"





export const App:React.FC = () => {
  return (
    <div className="App">
      <div className='TopBar'>
        <span className='HorizontalStackPanel FloatRight'>
          <a className='TransparentButton' href='https://github.com/NigelBess/Image-Align' target='_blank'><img className='Icon' src={ghImage}/>Github </a>
          <span className='TransparentButton'>Contact</span>
        </span>
      </div>
      <span className="Heading"> Image Align</span>
      
      <div className='SubHeading'>A tool for cropping images to align their subjects</div>
      <ImageEdit/>
      <div  className='CoffeeButtonContainer'>
        <BuyMeACoffee/>
      </div>
      <div className='Footer'>© 2024 Nigel Bess</div>
    </div>

  );
}
export default App;
