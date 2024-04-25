import React from 'react';
import './App.css';
import ImageEdit from './components/ImageEdit';
import BuyMeACoffee from './components/BuyMeACoffee';





const App:React.FC = () => {
  return (
    <div className="App">
     <span className="Heading"> Image Align</span>
     
     <div className='SubHeading'>A tool for cropping images to align their subjects</div>
     <ImageEdit/>
     <div  className='CoffeeButtonContainer'>
      <BuyMeACoffee/>
     </div>
     
      </div>

  );
}
export default App;
