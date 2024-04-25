import React, { useRef, useState} from 'react';
import {OverlayDirection, Overlay} from './Overlay';
import step1Arrow from "../img/step1Arrow.png"
import step2Arrow from '../img/step2arrow.png';
import { PointSelect, Point} from './PointSelect';

interface AdjustmentEnable
{
    EnableX:boolean;
    EnableY:boolean;
}

interface Adjustment
{
    X:number;
    Y:number;
}

const ImageEdit: React.FC = () => {
    const [imagePath, setImagePath] = useState<string >('');
    const [tutorialStep, setTutorialStep] = useState<number>(1);
    const [showTutorial, setShowTutorial] = useState<boolean>(true);
    const [adjustmentEnable,setAdjustmentEnable] = useState<AdjustmentEnable>({EnableX:true, EnableY:true})
    const [adjustment,setAdjustment] = useState<Adjustment>({X:0,Y:0})

    const chooseImageButton = useRef(null)
    const firstImage = useRef(null)


    const changeImage= (event: React.ChangeEvent<HTMLInputElement>) => {
        const imageFile = event.target.files ? event.target.files[0] : null;
        if (!imageFile) return

        const url = URL.createObjectURL(imageFile);
        
        MoveTutorialStep(2)
        setImagePath(url)        
    }

    function MoveTutorialStep(step:number)
    {
        if (tutorialStep<step) setTutorialStep(step);
    }


    function showTutorialStep(step:number):boolean {
        return tutorialStep==step && showTutorial
    }

    function handlePointsChanged(points:Point[])
    {
        MoveTutorialStep(3)
    }

    function showToolBar():boolean
    {
        return !showTutorial || tutorialStep>2
    }

    function handleXEnableChanged() {
        setAdjustmentEnable(oldState=>({...oldState,EnableX:!oldState.EnableX}));
        Recalculate();
    }

    function handleYEnableChanged() {
        setAdjustmentEnable(oldState=>({...oldState,EnableY:!oldState.EnableY}));
        Recalculate();
    }

    function handleCenterClicked()
    {
        setAdjustment({X:50,Y:50});
        Recalculate();
    }
    function handleYChanged(event: React.ChangeEvent<HTMLInputElement>)
    {
        const newValue = parseFloat(event.target.value)
        setAdjustment({...adjustment,Y:newValue})
        Recalculate();
    }
    function handleXChanged(event: React.ChangeEvent<HTMLInputElement>)
    {
        const newValue = parseFloat(event.target.value)
        setAdjustment({...adjustment,X:newValue})
        Recalculate();
    }

    function Recalculate()
    {
        MoveTutorialStep(4)
        console.log("Recalculate Triggered")
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
                    <PointSelect  src={imagePath} displayX={adjustmentEnable.EnableX} displayY={adjustmentEnable.EnableY} pointsChanged={handlePointsChanged}/>
                </span>
                <div className='Stack'>
                    <span className='Wrapper'>
                        <img src={imagePath} className='PrimaryImage2'></img>
                    </span>
                </div>
                
                    
                </div>
            </div>
            <div className='ToolColumn'  style={{ visibility: showToolBar() ? "visible" : "hidden" }}>
                <div className='StackPanel' style={{margin:"20px"}}>
                    <div className='CenterStackItem'>New Position</div>
                    <div className='StackPanel AlignSelfCenter'>
                        <div className='FlexContainer'>
                            <input type='checkbox' onChange={handleXEnableChanged} className='CheckBox' checked={adjustmentEnable.EnableX}/>
                            <span className='XYTitle'> X:</span>
                            <input type='range' value={adjustment.X} onChange={handleXChanged} className='Slider FillFlex' disabled={!adjustmentEnable.EnableX}/>
                            <input className='PercentBox' onChange={handleXChanged} value={adjustment.X} disabled={!adjustmentEnable.EnableX}/>
                            <span>%</span>
                        </div>
                        <div className='FlexContainer'>
                            <input type='checkbox' onChange={handleYEnableChanged} className='CheckBox' checked={adjustmentEnable.EnableY}/>
                            <span className='XYTitle'> Y:</span>
                            <input type='range' value={adjustment.Y} onChange={handleYChanged} className='Slider VerticalSlider FillFlex' disabled={!adjustmentEnable.EnableY}/>
                            <input type='number' value={adjustment.Y} onChange={handleYChanged} className='PercentBox' disabled={!adjustmentEnable.EnableY}/>
                            <span>%</span>
                        </div>
                    </div>
                    
                    <div className='Shadow HomebrewButton AlignSelfCenter' onClick={handleCenterClicked}>Center</div>
                </div>
                
            </div>
        </div>
        
            

    )

};

export default ImageEdit;