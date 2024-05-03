import React from 'react';
import './App.css';
import logo from './img/imageAlign.png';
import { PrimaryWindowContent } from './components/PrimaryWindowContent';
import { ContactContent } from './components/ContactContent';
import ghImage from "./img/github-logo.png"
import { BrowserRouter as Router, Route,Routes, Link } from 'react-router-dom';



export const App:React.FC = () => {
  


  return (
    <Router>
    <div className="App">
      <nav className='TopBar container'>
          <div className='left' style={{margin:"0 10px"}}>
            <Link to='/' className='TopbarText'>
              <div className='HorizontalStackPanel'>
                <img src={logo} className='LargeIcon'/>
                <span className='TopbarText'> ImageAlign.io</span>
              </div>
              
            </Link>
            
          </div>
          <div className='HorizontalStackPanel right' style={{margin:"0 20px"}}>
            <a className='TransparentButton TopbarText' href='https://github.com/NigelBess/Image-Align' target='_blank'>
                <div className='HorizontalStackPanel'>
                <img className='Icon' src={ghImage}/>
              <span>Github</span> 
              </div>
              
            </a>
            <Link to='/contact' className='TransparentButton TopbarText'>Contact</Link>
          </div>
      </nav>
      
        <Routes>
          <Route path='/' element={<PrimaryWindowContent/>}/>
          <Route path='/contact' element={<ContactContent/>}/>

        </Routes>
      
      </div>
      </Router>

  );
}
export default App;
