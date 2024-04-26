import React, { useRef, useState, useEffect} from 'react';
import {OverlayDirection, Overlay} from './Overlay';
import step1Arrow from "../img/step1Arrow.png"
import step2Arrow from '../img/step2Arrow.png';
import step3Arrow from '../img/step3Arrow.png';
import { PointSelect, Point} from './PointSelect';
import { Toolbox, AlignmentSettings } from './Toolbox';



export const ImageEdit: React.FC = () => {
    const [imagePath, setImagePath] = useState<string >('');
    const [tutorialStep, setTutorialStep] = useState<number>(1);
    const [showTutorial, setShowTutorial] = useState<boolean>(true);
    const [isToolboxSticky, setToolboxSticky] = useState<boolean>(false);
    const [alignmentSettings,setAlignmentSettings] = useState<AlignmentSettings>({AlignX:true,AlignY:true,X:0,Y:0});


    const chooseImageButton = useRef(null)
    const firstImage = useRef(null)
    const toolBox = useRef<HTMLElement>(null)
    const toolboxTopOffset = useRef(0); // To store the initial top offset of the toolbox


    useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
    }, []);


    const changeImage= (event: React.ChangeEvent<HTMLInputElement>) => {
        const imageFile = event.target.files ? event.target.files[0] : null;
        if (!imageFile) return

        const url = URL.createObjectURL(imageFile);
        
        MoveTutorialStep(2)
        setImagePath(url)        
    }

    const handleScroll = () => {
        const currentScrollPos = window.scrollY;
        if (!toolBox.current) return
        if (!toolboxTopOffset.current)  toolboxTopOffset.current = toolBox.current.offsetTop;// Set initial top offset if it hasn't been set               

        setToolboxSticky(currentScrollPos >= toolboxTopOffset.current);

      };
    
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



    function handleAlignmentSettingsChanged(newSettings:AlignmentSettings)
    {
        setAlignmentSettings(newSettings)
        MoveTutorialStep(4)
        console.log("Recalculate Triggered")
    }

    return (       
        <div className='OuterContainer Shadow'>
        <Overlay targetRef={chooseImageButton} direction={OverlayDirection.Below}> 
            <div className='HorizontalStackPanel PulseGradient' style={{ visibility: showTutorialStep(1)? "visible" : "hidden" }} >
                <img className='ArrowImage' src={step1Arrow} style={{height:"150px"}}/>
                <span className='StepText'  >Choose an image you want to align</span>
            </div>           
        </Overlay>
        <Overlay targetRef={firstImage} direction={OverlayDirection.Right}> 
            <div className='StackPanel PulseGradient' style={{ visibility: showTutorialStep(2) ? "visible" : "hidden" }} >
                <span className='StepText' >Select the point you want to align</span>
                <img className='ArrowImage' src={step2Arrow} style={{height:"70px", width:"auto", float:"left"}} />
            </div>           
        </Overlay>
        <Overlay targetRef={toolBox} direction={OverlayDirection.Below}> 
                        <div className='HorizontalStackPanel PulseGradient' style={{ visibility: showTutorialStep(3)? "visible" : "hidden" }} >
                            <img className='ArrowImage' src={step3Arrow} style={{height:"150px"}}/>
                            <span className='StepText'>Adjust the alignment settings here</span>
                        </div>        
        </Overlay>
        
            <div id='ImageColumn'>
                <div className="StackPanel ">
                    <input ref={chooseImageButton} className='ImageUploadButton' type="file" accept="image/*" onChange={changeImage} />
                    <span ref={firstImage} id="uploadedImage" className="FillHorizontal" style={{ visibility: imagePath ? "visible" : "hidden" }} >
                        <PointSelect  src={imagePath} displayX={alignmentSettings.AlignX} displayY={alignmentSettings.AlignY} pointsChanged={handlePointsChanged}/>
                    </span>
                    <div className='Stack FillHorizontal'>
                            <img src={imagePath} className='PrimaryImage2'></img>
                    </div>
                    
                    
                </div>
            </div>
            <div className='ToolColumn'  style={{ visibility: showToolBar() ? "visible" : "hidden" }}>
                <span className={isToolboxSticky ? 'sticky' : ''} ref={toolBox}>
                    <Toolbox  alignmentSettingsChanged={handleAlignmentSettingsChanged}/>                    
                </span>
                
            </div>
        </div>
        
            

    )

};
