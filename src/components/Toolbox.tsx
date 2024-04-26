import React, { useEffect, useState} from 'react';


export interface AlignmentSettings
{
    AlignX:boolean
    AlignY:boolean
    X:number
    Y:number
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

    function handleXEnableChanged() {
        setCurrentSettings(old=>({...old,AlignX:!old.AlignX}))
    }

    function handleYEnableChanged() {
        setCurrentSettings(oldState=>({...oldState,AlignY:!oldState.AlignY}));
        AlignmentSettingsChanged();
    }

    function handleCenterClicked()
    {
        setCurrentSettings(oldState=>({...oldState,X:50,Y:50}));
        AlignmentSettingsChanged();
    }
    function handleYChanged(event: React.ChangeEvent<HTMLInputElement>)
    {
        const newValue = parseFloat(event.target.value)
        setCurrentSettings(oldState=>({...oldState,Y:newValue}));
        AlignmentSettingsChanged();
    }
    function handleXChanged(event: React.ChangeEvent<HTMLInputElement>)
    {
        const newValue = parseFloat(event.target.value)
        setCurrentSettings(oldState=>({...oldState,X:newValue}));
        AlignmentSettingsChanged();
    }

    function AlignmentSettingsChanged()
    {
        alignmentSettingsChanged(alignmentSettings)
    }

    return (       

                <div className='StackPanel' style={{margin:"20px"}}>
                    <div className='CenterStackItem'>New Position</div>
                    <div className='StackPanel AlignSelfCenter'>
                        <div className='FlexContainer'>
                            <input type='checkbox' onChange={handleXEnableChanged} className='CheckBox' checked={currentSettings.AlignX}/>
                            <span className='XYTitle'> X:</span>
                            <input type='range' value={currentSettings.X} onChange={handleXChanged} className='Slider FillFlex' disabled={!currentSettings.AlignX}/>
                            <input className='PercentBox' onChange={handleXChanged} value={currentSettings.X} disabled={!currentSettings.AlignX}/>
                            <span>%</span>
                        </div>
                        <div className='FlexContainer'>
                            <input type='checkbox' onChange={handleYEnableChanged} className='CheckBox' checked={currentSettings.AlignY}/>
                            <span className='XYTitle'> Y:</span>
                            <input type='range' value={currentSettings.Y} onChange={handleYChanged} className='Slider VerticalSlider FillFlex' disabled={!currentSettings.AlignY}/>
                            <input type='number' value={currentSettings.Y} onChange={handleYChanged} className='PercentBox' disabled={!currentSettings.AlignY}/>
                            <span>%</span>
                        </div>
                    </div>
                    
                    <div className='Shadow HomebrewButton AlignSelfCenter' onClick={handleCenterClicked}>Center</div>
                </div>
                
   
            

    )

};
