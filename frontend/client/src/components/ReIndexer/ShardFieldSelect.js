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


function ShardFieldSelect(props) {
    const {rangeOptions, rangeOption, startRange, endRange, onChangeRangeOption, onChangeRangePicker} = props;

    return (
        <div>
            <RadioButtonsGroup labelPlacement="top" options={rangeOptions} value={rangeOption}
                               handleChangeRadio={onChangeRangeOption}/>
            {rangeOption !== "All Results" &&
            <RangeInputSlider startRange={startRange} endRange={endRange} onChangeRangePicker={onChangeRangePicker}/>}
        </div>);
}

export default ShardFieldSelect