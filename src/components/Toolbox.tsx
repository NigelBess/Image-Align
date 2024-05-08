import React, { useEffect, useState} from 'react';
import { ClampPercent } from '../Helpers';
import { Size } from '../DataObjects';


export interface AlignmentSettings
{
    alignX:boolean
    xPercent:number

    alignY:boolean
    yPercent:number

    useSize:boolean
    size:Size
}

interface IToolboxProperties
{
    alignmentSettings:AlignmentSettings
    alignmentSettingsChanged:(settings:AlignmentSettings)=>void
}


export const Toolbox: React.FC<IToolboxProperties> = ({alignmentSettings,alignmentSettingsChanged}) => {

    const [currentSettings,setCurrentSettings] = useState<AlignmentSettings>(alignmentSettings)
    useEffect(()=>{
        setCurrentSettings(alignmentSettings)
    },[alignmentSettings])

    useEffect(()=>{
        alignmentSettingsChanged(currentSettings)
    },[currentSettings])

    function handleXEnableChanged() {
        setCurrentSettings(old=>Clean({...old,alignX:!old.alignX}))
    }

    function handleYEnableChanged() {
        setCurrentSettings(oldState=>Clean({...oldState,alignY:!oldState.alignY}));
    }

    function handleCenterClicked()
    {
        setCurrentSettings(oldState=>Clean({...oldState,xPercent:50,yPercent:50}));
    }
    function handleYChanged(event: React.ChangeEvent<HTMLInputElement>)
    {
        const newValue = parseFloat(event.target.value)
        setCurrentSettings(oldState=>Clean({...oldState,yPercent:newValue}));
    }
    function handleXChanged(event: React.ChangeEvent<HTMLInputElement>)
    {
        const newValue = parseFloat(event.target.value)
        setCurrentSettings(oldState=>Clean({...oldState,xPercent:newValue}));
    }

    function Clean(settings:AlignmentSettings):AlignmentSettings
    {   
        return {...settings,xPercent:CleanNumber(settings.xPercent), yPercent:CleanNumber(settings.yPercent)}
        function CleanNumber(f:number):number
        {
            f = EnforceNumber(f)
            f = ClampPercent(f)
            return f
        }
        function EnforceNumber(f:number):number
        {
            if(!isFinite(f)) return 0
            return f
        }
    }
    



    return (       
            

                <div className='StackPanel' style={{margin:"20px"}}>
                    <div className='CenterStackItem'>New Position</div>
                    <div className='StackPanel AlignSelfCenter'>
                        <div className='FlexContainer'>
                            <input type='checkbox' onChange={handleXEnableChanged} className='CheckBox' checked={currentSettings.alignX}/>
                            <span className='XYTitle'> X:</span>
                            <input type='range' value={currentSettings.xPercent} onChange={handleXChanged} className='Slider FillFlex' disabled={!currentSettings.alignX}/>
                            <input type='number' className='PercentBox' onChange={handleXChanged} value={currentSettings.xPercent} disabled={!currentSettings.alignX}/>
                            <span>%</span>
                        </div>
                        <div className='FlexContainer'>
                            <input type='checkbox' onChange={handleYEnableChanged} className='CheckBox' checked={currentSettings.alignY}/>
                            <span className='XYTitle'> Y:</span>
                            <input type='range' value={currentSettings.yPercent} onChange={handleYChanged} className='Slider VerticalSlider FillFlex' disabled={!currentSettings.alignY}/>
                            <input type='number' value={(currentSettings.yPercent).toString()} onChange={handleYChanged} className='PercentBox' disabled={!currentSettings.alignY}/>
                            <span>%</span>
                        </div>
                    </div>
                    
                    <div className='Shadow HomebrewButton AlignSelfCenter' onClick={handleCenterClicked}>Center</div>
                </div>
                
   
            

    )

};
