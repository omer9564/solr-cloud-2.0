import React from 'react';
import FormControl from "@material-ui/core/FormControl";
import Box from "@material-ui/core/Box";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import CloseIcon from '@material-ui/icons/Close'
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        width: "65%"
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
});


function DynamicFilterBox(props) {
    const {classes, filterIndex, filterProp, filterType, filterOperator, filterInput, filterOptions, onChange, onDelete} = props;
    return (
        <Box border={1} margin="5px" style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            height: "70px"
        }}>
            {filterType !== "boolSelect" ? (
                <FormControl className={classes.formControl}>
                    <TextField
                        id={`${filterProp}-${filterOperator}`}
                        label={filterProp}
                        placeholder={`${filterOperator} Filter on '${filterProp}'`}
                        InputLabelProps={{shrink: true}}
                        type={filterType}
                        onChange={(event) => onChange(filterIndex, event)}
                        fullWidth
                    />
                </FormControl>) : (
                <FormControl className={classes.formControl}>
                    <InputLabel shrink id={`${filterProp}-${filterOperator}`}>
                        {filterProp}
                    </InputLabel>
                    <Select
                        labelId={`${filterProp}-${filterOperator}`}
                        id={`${filterProp}-${filterOperator}`}
                        value={filterInput}
                        onChange={(event) => onChange(filterIndex, event)}
                        displayEmpty
                        className={classes.selectEmpty}
                    >
                        {filterOptions.map((option, index) => {
                            const optionFixed = typeof option === "boolean" ? (option ? "true" : "false") : option;
                            return (
                                <MenuItem key={`${filterProp}-${optionFixed}`}
                                          id={`${filterProp}-${index.toString()}`}
                                          value={optionFixed}>{optionFixed}</MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>)}
            <div style={{width: "30%", display: "flex", justifyContent: "flex-end"}}>
                <IconButton onClick={() => onDelete(filterIndex)}>
                    <CloseIcon fontSize="large"/>
                </IconButton>
            </div>
        </Box>
    )
}

export default withStyles(useStyles)(DynamicFilterBox)