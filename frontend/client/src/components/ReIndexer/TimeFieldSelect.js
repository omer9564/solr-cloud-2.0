import React from 'react'
import TextField from "@material-ui/core/TextField";
import RadioButtonsGroup from "../RadioButtonsGroup";
import FormControl from "@material-ui/core/FormControl";
import {KeyboardDatePicker,MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Grid from "@material-ui/core/Grid";


function TimeFieldSelect(props) {
    const {rangeOptions, rangeOption, textPropName, defaultValue, startRange, endRange, onChangeField, onChangeRangeOption, onChangeRangePicker} = props;

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('/');
    }

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
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <div style={{display:"flex",flexDirection:"column",justifyContent:"space-around"}}>
                    <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="dd/MM/yyyy"
                        margin="normal"
                        id="date-picker-start"
                        label="Start date"
                        value={startRange}
                        onChange={(newDate) => onChangeRangePicker("start", formatDate(newDate))}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                    <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="dd/MM/yyyy"
                        margin="normal"
                        id="date-picker-end"
                        label="End Date"
                        value={endRange}
                        onChange={(newDate) => onChangeRangePicker("end", formatDate(newDate))}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                </div>
            </MuiPickersUtilsProvider>}
        </div>);
}

export default TimeFieldSelect