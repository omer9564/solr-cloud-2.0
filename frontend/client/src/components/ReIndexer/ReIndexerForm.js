import React from 'react';
import ReIndexerFarmForm from "./ReIndexerFarmForm";
import Button from "@material-ui/core/Button";
import FormDialog from "../../containers/FormDialog";
import radioButtonsGroup from "../RadioButtonsGroup"
import ChangeComparisionFieldDialog from "../../containers/ReIndexer/ChangeComparisionFieldDialog";
import Paper from "@material-ui/core/Paper/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableRow from "@material-ui/core/TableRow";

function ReIndexerForm(props) {
    const {farms, currentSourceProps, currentDestinationProps, onChangeFarm, onChangeCollection, currentFieldProps, onRefreshCollection, onChangeFieldProperties, onSubmitComparision} = props;
    return (
        <div className="TabForm">
            <ReIndexerFarmForm farms={farms} type="source" currentFarm={currentSourceProps.farm}
                               currentCollection={currentSourceProps.collection} onChangeFarm={onChangeFarm}
                               onChangeCollection={onChangeCollection} onRefreshCollection={onRefreshCollection}/>
            <ReIndexerFarmForm farms={farms} type="destination" currentFarm={currentDestinationProps.farm}
                               currentCollection={currentDestinationProps.collection} onChangeFarm={onChangeFarm}
                               onChangeCollection={onChangeCollection} onRefreshCollection={onRefreshCollection}/>
            {/*<fieldset>*/}
            {/*    <legend>Comparision field properties</legend>*/}
            {/*    <TableContainer component={Paper}>*/}
            {/*        <Table size="small">*/}
            {/*            <TableRow key="type">*/}
            {/*                <TableCell component="th" style={{fontWeight: 'bold'}}>*/}
            {/*                    type*/}
            {/*                </TableCell>*/}
            {/*                <TableCell component="td">*/}
            {/*                    {currentFieldProps.type}*/}
            {/*                </TableCell>*/}
            {/*            </TableRow>*/}
            {/*            <TableRow key="field">*/}
            {/*                <TableCell component="th" style={{fontWeight: 'bold'}}>*/}
            {/*                    field*/}
            {/*                </TableCell>*/}
            {/*                <TableCell component="td">*/}
            {/*                    {currentFieldProps.field}*/}
            {/*                </TableCell>*/}
            {/*            </TableRow>*/}
            {/*            <TableRow key="results">*/}
            {/*                <TableCell component="th" style={{fontWeight: 'bold'}}>*/}
            {/*                    results*/}
            {/*                </TableCell>*/}
            {/*                <TableCell component="td">*/}
            {/*                    {currentFieldProps.rangeOption}*/}
            {/*                </TableCell>*/}
            {/*            </TableRow>*/}
            {/*        </Table>*/}
            {/*    </TableContainer>*/}
            {/*</fieldset>*/}
            {/*<FormDialog buttonTitle="Change Comparision Field" dialogContent="Choose comparision properties">*/}
            {/*    <ChangeComparisionFieldDialog onChangeFieldProperties={onChangeFieldProperties}/>*/}
            {/*</FormDialog>*/}
        </div>
    )
}

export default ReIndexerForm