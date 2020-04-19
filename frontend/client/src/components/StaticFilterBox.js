import React from 'react';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import withStyles from "@material-ui/core/styles/withStyles";
import LoadingStatus from "./LoadingStatus";


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


function StaticFilterBox(props) {
    const {classes, filterName, filterOptions, currentFilterOption, isLoading, onChange, onRefresh, onRefreshArgs} = props;
    return (
        <Box border={1} margin="5px" style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            height: "70px"
        }}>
            <FormControl className={classes.formControl}>
                <InputLabel shrink id={"filter-" + {filterName}}>
                    {filterName}
                </InputLabel>
                <Select
                    labelId={"filter-" + {filterName}}
                    id={"filter-" + {filterName}}
                    value={filterOptions.length === 0 ? "" : filterOptions[currentFilterOption]}
                    onChange={onChange}
                    displayEmpty
                    className={classes.selectEmpty}
                >
                    {filterOptions.length === 0 ?
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem> : filterOptions.map((option, index) => {
                            const optionFixed = typeof option === "boolean" ? (option ? "true" : "false") : option;
                            return (
                                <MenuItem key={`${filterName}-${optionFixed}`} id={filterName + "-" + index.toString()}
                                          value={optionFixed}>{optionFixed}</MenuItem>
                            )
                        })}
                </Select>
            </FormControl>
            {onRefresh && <LoadingStatus isLoading={isLoading} onRefresh={onRefresh} onRefreshArgs={onRefreshArgs}
                                        componentStyle={{width: "30%", display: "flex", justifyContent: "flex-end"}}/>}

        </Box>
    )
}

export default withStyles(useStyles)(StaticFilterBox)