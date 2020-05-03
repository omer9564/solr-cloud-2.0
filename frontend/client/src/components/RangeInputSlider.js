import React from 'react'
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import Slider from "@material-ui/core/Slider";

function RangeInputSlider(props) {
    const {startRange,endRange,onChangeRangePicker} = props;
    return (
        <Grid container spacing={2} alignItems="center">
            <Grid item>
                <Input
                    value={startRange}
                    margin="dense"
                    onChange={(event) => onChangeRangePicker("start", event.target.value)}
                    inputProps={{
                        step: 10,
                        min: 0,
                        max: 100,
                        type: 'number',
                        'aria-labelledby': 'input-slider',
                        style:{width: "42px"}
                    }}
                />
            </Grid>
            <Grid item xs>
                <Slider
                    value={[startRange, endRange]}
                    onChange={(event, newValue) => onChangeRangePicker("both", newValue)}
                    aria-labelledby="range-slider"
                />
            </Grid>
            <Grid item>
                <Input
                    value={endRange}
                    margin="dense"
                    onChange={(event) => onChangeRangePicker("end", event.target.value)}
                    inputProps={{
                        min: 0,
                        max: 100,
                        type: 'number',
                        'aria-labelledby': 'input-slider',
                        style:{width: "42px"}
                    }}
                />
            </Grid>
        </Grid>);
}

export default RangeInputSlider