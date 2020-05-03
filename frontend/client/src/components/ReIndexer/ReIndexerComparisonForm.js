import React from 'react'
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Table from "@material-ui/core/Table";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import withStyles from "@material-ui/core/styles/withStyles";
import FormControl from "@material-ui/core/FormControl";

const useStyles = theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        width: "100%"
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
});

function ReIndexerComparisonForm(props) {
    const {classes,currentFieldProps} = props;
    return (
        <fieldset className="FormFieldset">
            <legend>Comparison field properties</legend>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableRow key="type">
                        <TableCell component="th" style={{fontWeight: 'bold'}}>
                            type
                        </TableCell>
                        <TableCell component="td">
                            {currentFieldProps.type}
                        </TableCell>
                    </TableRow>
                    <TableRow key="field">
                        <TableCell component="th" style={{fontWeight: 'bold'}}>
                            field
                        </TableCell>
                        <TableCell component="td">
                            {currentFieldProps.field}
                        </TableCell>
                    </TableRow>
                    <TableRow key="results">
                        <TableCell component="th" style={{fontWeight: 'bold'}}>
                            results
                        </TableCell>
                        <TableCell component="td">
                            {currentFieldProps.rangeOption === "All Results" ?
                                currentFieldProps.rangeOption :
                                `${currentFieldProps.rangePicker.start}-${currentFieldProps.rangePicker.end}`}
                        </TableCell>
                    </TableRow>
                </Table>
            </TableContainer>
            <Box border={1} margin="5px" style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                height: "70px"
            }}>
                <FormControl className={classes.formControl}>
                    <TextField
                        id={`fqs`}
                        label={`fqs`}
                        InputLabelProps={{shrink: true}}
                        fullWidth
                    />
                </FormControl>
            </Box>
        </fieldset>);
}

export default withStyles(useStyles)(ReIndexerComparisonForm)