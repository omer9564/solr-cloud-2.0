import React from 'react'
import TextField from "@material-ui/core/TextField";
import RadioButtonsGroup from "../RadioButtonsGroup";
import FormControl from "@material-ui/core/FormControl";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";
import RangeInputSlider from "../RangeInputSlider";


function GenericFieldSelect(props) {
    const {rangeOptions, rangeOption, textPropName, defaultValue, startRange, endRange, onChangeField, onChangeRangeOption, onChangeRangePicker} = props;

    return (
        <div>
            <FormControl style={{padding: "10px",width:"100%"}}>
                <TextField
                    id={`${textPropName}`}
                    label={textPropName}
                    placeholder={defaultValue}
                    InputLabelProps={{shrink: true}}
                    onChange={onChangeField}
                    fullWidth
                />
            </FormControl>
            <RadioButtonsGroup labelPlacement="top" options={rangeOptions} value={rangeOption}
                               handleChangeRadio={onChangeRangeOption}/>
            {rangeOption !== "All Results" &&
            <RangeInputSlider startRange={startRange} endRange={endRange} onChangeRangePicker={onChangeRangePicker}/>}
        </div>);
}

export default GenericFieldSelect