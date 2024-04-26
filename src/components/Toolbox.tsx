import React, { useState} from 'react';


export interface AlignmentSettings
{
    AlignX:boolean;
    AlignY:boolean;
    X:number;
    Y:number;
}

interface IToolboxProperties
{
    alignmentSettingsChanged:(settings:AlignmentSettings)=>void
}


export const Toolbox: React.FC<IToolboxProperties> = ({alignmentSettingsChanged}) => {
    const [alignmentSettings,setAlignmentSettings] = useState<AlignmentSettings>({AlignX:true,AlignY:true,X:0,Y:0})

    function handleXEnableChanged() {
        setAlignmentSettings(oldState=>({...oldState,AlignX:!oldState.AlignX}));
        AlignmentSettingsChanged();
    }

    function handleYEnableChanged() {
        setAlignmentSettings(oldState=>({...oldState,AlignY:!oldState.AlignY}));
        AlignmentSettingsChanged();
    }

    function handleCenterClicked()
    {
        setAlignmentSettings(oldState=>({...oldState,X:50,Y:50}));
        AlignmentSettingsChanged();
    }
    function handleYChanged(event: React.ChangeEvent<HTMLInputElement>)
    {
        const newValue = parseFloat(event.target.value)
        setAlignmentSettings(oldState=>({...oldState,Y:newValue}));
        AlignmentSettingsChanged();
    }
    function handleXChanged(event: React.ChangeEvent<HTMLInputElement>)
    {
        const newValue = parseFloat(event.target.value)
        setAlignmentSettings(oldState=>({...oldState,X:newValue}));
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
                            <input type='checkbox' onChange={handleXEnableChanged} className='CheckBox' checked={alignmentSettings.AlignX}/>
                            <span className='XYTitle'> X:</span>
                            <input type='range' value={alignmentSettings.X} onChange={handleXChanged} className='Slider FillFlex' disabled={!alignmentSettings.AlignX}/>
                            <input className='PercentBox' onChange={handleXChanged} value={alignmentSettings.X} disabled={!alignmentSettings.AlignX}/>
                            <span>%</span>
                        </div>
                        <div className='FlexContainer'>
                            <input type='checkbox' onChange={handleYEnableChanged} className='CheckBox' checked={alignmentSettings.AlignY}/>
                            <span className='XYTitle'> Y:</span>
                            <input type='range' value={alignmentSettings.Y} onChange={handleYChanged} className='Slider VerticalSlider FillFlex' disabled={!alignmentSettings.AlignY}/>
                            <input type='number' value={alignmentSettings.Y} onChange={handleYChanged} className='PercentBox' disabled={!alignmentSettings.AlignY}/>
                            <span>%</span>
                        </div>
                    </div>
                    
                    <div className='Shadow HomebrewButton AlignSelfCenter' onClick={handleCenterClicked}>Center</div>
                </div>
                
   
            

    )

};
