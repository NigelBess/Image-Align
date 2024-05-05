import {ImageEdit} from './ImageEdit';
import BuyMeACoffee from './BuyMeACoffee';
import logo from '../img/imageAlign.png';
import GridAd from './GridAd';


export const PrimaryWindowContent:React.FC = ()=>{
    return(
    <div className='AppContainer'> 
        <span className="Heading HorizontalStackPanel"> <img src={logo} className='TitleLogo' alt="Title Logo Image Align"></img>ImageAlign.io</span>
    
        <div className='SubHeading'>A tool for cropping images relative to their contents</div>
            <ImageEdit/>
        <div  className='CoffeeButtonContainer'>
            <BuyMeACoffee/>
        </div>
        <div className='Footer'>© 2024 Nigel Bess</div>
        <div className='AdContainer'>
            <GridAd/>
        </div>
        
       
    </div>
  );
}