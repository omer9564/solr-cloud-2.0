import React from 'react';
import FormControl from "@material-ui/core/FormControl";
import Box from "@material-ui/core/Box";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import CloseIcon from '@material-ui/icons/Close'
import IconButton from "@material-ui/core/IconButton";

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


function StatsFilterBox(props) {
    const {classes,filterIndex, filterProp, filterType, filterOperator, onChange,onDelete} = props;
    return (
        <Box border={1} margin="5px" style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            height: "70px"
        }}>
            <FormControl className={classes.formControl}>
                <TextField
                    id={`${filterProp}-${filterOperator}`}
                    label={filterProp}
                    placeholder={`${filterOperator} Filter on '${filterProp}'`}
                    InputLabelProps={{shrink: true}}
                    type={filterType}
                    fullWidth
                />
            </FormControl>
            <div style={{width: "30%", display: "flex", justifyContent: "flex-end"}}>
                <IconButton onClick={()=>onDelete(filterIndex)}>
                    <CloseIcon fontSize="large"/>
                </IconButton>
            </div>
        </Box>
    )
}

export default withStyles(useStyles)(StatsFilterBox)