import React from 'react';
import Radio from '@material-ui/core/Radio/index';
import RadioGroup from '@material-ui/core/RadioGroup/index';
import FormControlLabel from '@material-ui/core/FormControlLabel/index';
import FormControl from '@material-ui/core/FormControl/index';
import FormLabel from '@material-ui/core/FormLabel/index';

function RadioButtonsGroup(props) {
    const {labelPlacement, options, value, handleChangeRadio} = props;
    const isRow = (labelPlacement === "top" || labelPlacement === "bottom");
    return (
            <RadioGroup row={isRow} aria-label="position" name="position" value={value} onChange={handleChangeRadio}>
                {options.map((option) => {
                    return (
                        <FormControlLabel
                            value={option}
                            control={<Radio color="primary"/>}
                            label={option}
                            labelPlacement={labelPlacement}
                        />
                    )
                })}
            </RadioGroup>
    );
}

export default RadioButtonsGroup