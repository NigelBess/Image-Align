import {ImageEdit} from './ImageEdit';
import BuyMeACoffee from './BuyMeACoffee';



export const PrimaryWindowContent:React.FC = ()=>{
    return(
    <div className='AppContainer'> 
        <span className="Heading"> ImageAlign.io</span>
    
        <div className='SubHeading'>A tool for cropping images relative to their contents</div>
            <ImageEdit/>
        <div  className='CoffeeButtonContainer'>
            <BuyMeACoffee/>
        </div>
        <div className='Footer'>© 2024 Nigel Bess</div>
    </div>
  );
}