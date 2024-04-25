import React, { useState} from 'react';
import {OverlayDirection, Overlay} from './Overlay';
import step1Arrow from "../img/step1Arrow.png"
import step2Arrow from '../img/step2arrow.png';

const ImageEdit: React.FC = () => {
    let [imagePath, setImagePath] = useState<string >('');
    let [tutorialStep, setTutorialStep] = useState<number>(1);


    const changeImage= (event: React.ChangeEvent<HTMLInputElement>) => {
        const imageFile = event.target.files ? event.target.files[0] : null;
        if (!imageFile) return

        const url = URL.createObjectURL(imageFile)
        setTutorialStep(2)
        setImagePath(url)        
    }


    function showTutorial():boolean {
        return tutorialStep<5
    }



    return (       
        <div className='OuterContainer Shadow'>
        <Overlay targetId='chooseImageButton' direction={OverlayDirection.Below}> 
            <div className='HorizontalStackPanel PulseGradient' style={{ visibility: showTutorial() && tutorialStep==1 ? "visible" : "hidden" }} >
                <img className='ArrowImage' src={step1Arrow} style={{height:"100px"}}/>
                <span className='StepText'  >Choose a file</span>
            </div>           
        </Overlay>
        <Overlay targetId='uploadedImage' direction={OverlayDirection.Right}> 
            <div className='StackPanel PulseGradient' style={{ visibility: showTutorial() && tutorialStep==2 ? "visible" : "hidden" }} >
            <span className='StepText' >Select the point you want to align</span>
            <img className='ArrowImage' src={step2Arrow} style={{height:"100px"}}/>
            </div>
           
        </Overlay>
            <div className='ImageColumn'>
                <div className="StackPanel">
                    <input id="chooseImageButton" className='ImageUploadButton' type="file" accept="image/*" onChange={changeImage} />
                    <img id="uploadedImage" className="PrimaryImage" src={imagePath}  alt="" style={{ visibility: imagePath ? "visible" : "hidden" }}/>
                </div>
            </div>
            <div className='ToolColumn'></div>
        </div>
        
            

    )

};

export default ImageEdit;