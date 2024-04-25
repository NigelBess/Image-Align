import React, { useRef, useState} from 'react';
import {OverlayDirection, Overlay} from './Overlay';
import step1Arrow from "../img/step1Arrow.png"
import step2Arrow from '../img/step2arrow.png';
import { PointSelect, Point} from './PointSelect';

const ImageEdit: React.FC = () => {
    let [imagePath, setImagePath] = useState<string >('');
    let [tutorialStep, setTutorialStep] = useState<number>(1);

    const chooseImageButton = useRef(null)
    const firstImage = useRef(null)


    const changeImage= (event: React.ChangeEvent<HTMLInputElement>) => {
        const imageFile = event.target.files ? event.target.files[0] : null;
        if (!imageFile) return

        const url = URL.createObjectURL(imageFile)
        setTutorialStep(2)
        setImagePath(url)        
    }


    function showTutorialStep(step:number):boolean {
        return tutorialStep==step
    }

    function handlePointsChanged(points:Point[])
    {
        setTutorialStep(3)
    }


    return (       
        <div className='OuterContainer Shadow'>
        <Overlay targetRef={chooseImageButton} direction={OverlayDirection.Below}> 
            <div className='HorizontalStackPanel PulseGradient' style={{ visibility: showTutorialStep(1)? "visible" : "hidden" }} >
                <img className='ArrowImage' src={step1Arrow} style={{height:"150px"}}/>
                <span className='StepText'  >Choose a file</span>
            </div>           
        </Overlay>
        <Overlay targetRef={firstImage} direction={OverlayDirection.Right}> 
            <div className='StackPanel PulseGradient' style={{ visibility: showTutorialStep(2) ? "visible" : "hidden" }} >
            <span className='StepText' >Select the point you want to align</span>
            <img className='ArrowImage' src={step2Arrow} style={{height:"70px", width:"auto", float:"left"}} />
            </div>
           
        </Overlay>
            <div id='ImageColumn'>
                <div className="StackPanel">
                <input ref={chooseImageButton} className='ImageUploadButton' type="file" accept="image/*" onChange={changeImage} />
                <span ref={firstImage} id="uploadedImage" className="Wrapper" style={{ visibility: imagePath ? "visible" : "hidden" }} >
                    <PointSelect  src={imagePath} displayX={true} displayY={true} pointsChanged={handlePointsChanged}/>
                </span>
                    
                </div>
            </div>
            <div className='ToolColumn'></div>
        </div>
        
            

    )

};

export default ImageEdit;