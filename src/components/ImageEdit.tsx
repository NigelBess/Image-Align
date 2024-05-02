import React, { useRef, useState, useEffect} from 'react';
import {OverlayDirection, Overlay} from './Overlay';
import step1Arrow from "../img/step1Arrow.png"
import step2Arrow from '../img/step2Arrow.png';
import step3Arrow from '../img/step3Arrow.png';
import { PointSelect} from './PointSelect';
import { Toolbox, AlignmentSettings } from './Toolbox';
import {Round, PixelToPercent,PercentToRatio} from '../Helpers'
import  {Point,Size,Rectangle,DefaultCrop,DefaultSize} from '../DataObjects'
import {ConvertToDims,CalculateNewDim} from '../Dimension'


export const ImageEdit: React.FC = () => {
    const [tutorialStep, setTutorialStep] = useState<number>(1);
    const [showTutorial, setShowTutorial] = useState<boolean>(true);
    const [isToolboxSticky, setToolboxSticky] = useState<boolean>(false);
    const [writeOnlyAlignmentSettings,setWOAlignmentSettings] = useState<AlignmentSettings>({alignX:true,alignY:true,xPercent:0,yPercent:0,useSize:false,size:DefaultSize()});
    const [readonlyAlignmentSettings,setROAlignmentSettings] = useState<AlignmentSettings>({alignX:true,alignY:true,xPercent:0,yPercent:0,useSize:false,size:DefaultSize()});
    const [crop,setCrop] = useState<Rectangle>(DefaultCrop())
    const [loadedImage,setLoadedImage] = useState<HTMLImageElement>(document.createElement('img'))
    const [isImageLoaded,setImageLoaded] = useState<boolean>(false)


    const chooseImageButton = useRef(null)
    const iamgeContainer = useRef(null)
    const toolBox = useRef<HTMLElement>(null)
    const toolboxTopOffset = useRef(0); // To store the initial top offset of the toolbox
    const focalPoint = useRef<Point>()


    useEffect(() => {
    window.addEventListener('scroll', handleScroll);


    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
    }, []);


    async function changeImage(event: React.ChangeEvent<HTMLInputElement>) {
        const imageFile = event.target.files ? event.target.files[0] : null;
        if (!imageFile) return

        const url = URL.createObjectURL(imageFile);
        LoadImage(url,handleImageLoaded)
        MoveTutorialStep(2)    
    }

    function LoadImage(url:string,callback:(img:HTMLImageElement)=> void)
    {
        const img = document.createElement('img')
        img.src = url
        img.onload = ()=>callback(img)
    }

    function handleImageLoaded(img: HTMLImageElement)
    {
        setImageLoaded(true)
        console.log("image loaded")
        setLoadedImage(img)
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
        
        const show = tutorialStep==step && showTutorial
        return show
    }

    function handlePointChanged(point:Point|null)
    {
        if(!point) return;
        focalPoint.current = point
        if(loadedImage) InitializeAlignmentSettings(point,loadedImage);
        MoveTutorialStep(3)
    }

    function InitializeAlignmentSettings(point:Point, image:HTMLImageElement)
    {
        const size:Size = {width:image.width, height:image.height}
        point = PixelToPercent(point,size)
        const x = Round(point.x)
        const y =  Round(point.y)
        setWOAlignmentSettings(old=>({...old,xPercent:x,yPercent:y}))
    }

    function showToolBar():boolean
    {
        return !showTutorial || tutorialStep>2
    }



    function handleAlignmentSettingsChanged(newSettings:AlignmentSettings)
    {
        RecalculateCrop(newSettings)
        setROAlignmentSettings(newSettings)
    }

    function handleClickedToolColumn()
    {
        if(tutorialStep==3) MoveTutorialStep(4)
    }

    //updates the crop info from the user selected alignment settings
    function RecalculateCrop(alignment:AlignmentSettings)
    {
        if(!focalPoint.current) return;

        const pointPixel = focalPoint.current
        const img = loadedImage;
        const imgSizePixels:Size = {width:img.width,height:img.height}         

        let [xDim,yDim] = ConvertToDims(pointPixel,imgSizePixels)
        if(alignment.alignX) xDim = CalculateNewDim(xDim,PercentToRatio(alignment.xPercent));
        if(alignment.alignY) yDim = CalculateNewDim(yDim,PercentToRatio(alignment.yPercent));
        
        const offsetX = pointPixel.x - xDim.x
        const offsetY = pointPixel.y - yDim.x
        const newCrop:Rectangle = {point:{x:offsetX,y:offsetY},size:{width:xDim.length,height:yDim.length}}
        setCrop(newCrop)

    }

    function handleSave()
    {

    }

    function CanSave():boolean
    {
        return isImageLoaded && crop !=null && focalPoint.current !=null
    }

    

    return (       
        <div className='OuterContainer Shadow'>
        <Overlay targetRef={chooseImageButton} direction={OverlayDirection.Below}> 
            <div className='HorizontalStackPanel PulseGradient' style={{ visibility: showTutorialStep(1)? "visible" : "hidden" }} >
                <img className='ArrowImage' src={step1Arrow} style={{height:"150px"}}/>
                <span className='StepText'  >Choose an image you want to align</span>
            </div>           
        </Overlay>
        <Overlay targetRef={iamgeContainer} direction={OverlayDirection.Right}> 
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
                    <span ref={iamgeContainer} id="uploadedImage" className="FillHorizontal" style={{ visibility: isImageLoaded ? "visible" : "hidden" }} >
                        <PointSelect crop={crop} src={loadedImage} displayX={readonlyAlignmentSettings.alignX} displayY={readonlyAlignmentSettings.alignY} pointChanged={handlePointChanged}/>
                    </span>
                    
                    
                </div>
            </div>
            <div className='ToolColumn StackPanel' onMouseDown={handleClickedToolColumn} style={{ visibility: showToolBar() ? "visible" : "hidden" }}>
                <div className='AlignSelfCenter'>
                    <span className={isToolboxSticky ? 'sticky' : ''} ref={toolBox}>
                        <Toolbox alignmentSettings={writeOnlyAlignmentSettings}  alignmentSettingsChanged={handleAlignmentSettingsChanged}/>                    
                    </span>
                </div>
                <div style={{height:'60px'}}></div>
                <div className='HomebrewButton Shadow SaveButton AlignSelfCenter' onClick={handleSave} style={{ visibility: CanSave() ? "visible" : "hidden" }}>Save</div>
                
            </div>
        </div>
        
            

    )

};
