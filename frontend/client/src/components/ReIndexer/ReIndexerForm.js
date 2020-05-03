import React from 'react';
import ReIndexerFarmForm from "./ReIndexerFarmForm";
import FormDialog from "../../containers/FormDialog";
import ChangeComparisonFieldDialog from "../../containers/ReIndexer/ChangeComparisonFieldDialog";
import ReIndexerComparisonForm from "./ReIndexerComparisonForm";
import Button from "@material-ui/core/Button";

function ReIndexerForm(props) {
    const {farms, currentSourceProps, currentDestinationProps, onChangeFarm, onChangeCollection, currentFieldProps, onRefreshCollection, onChangeFieldProperties, onSubmitComparison} = props;
    return (
        <div className="TabForm">
            <ReIndexerFarmForm farms={farms} type="source" currentFarm={currentSourceProps.farm}
                               currentCollection={currentSourceProps.collection} onChangeFarm={onChangeFarm}
                               onChangeCollection={onChangeCollection} onRefreshCollection={onRefreshCollection}/>
            <ReIndexerFarmForm farms={farms} type="destination" currentFarm={currentDestinationProps.farm}
                               currentCollection={currentDestinationProps.collection} onChangeFarm={onChangeFarm}
                               onChangeCollection={onChangeCollection} onRefreshCollection={onRefreshCollection}/>
            <ReIndexerComparisonForm currentFieldProps={currentFieldProps}/>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-evenly"}}>
                <FormDialog buttonTitle="Edit props" dialogContent="Choose Comparison properties">
                    <ChangeComparisonFieldDialog onChangeFieldProperties={onChangeFieldProperties}/>
                </FormDialog>
                <Button variant="outlined" color="primary" onClick={onSubmitComparison}>
                    Submit
                </Button>
            </div>
        </div>
    )
}

export default ReIndexerForm