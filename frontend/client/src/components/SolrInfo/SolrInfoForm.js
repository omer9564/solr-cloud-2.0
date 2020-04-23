import React from 'react';
import StaticFilterBox from "../StaticFilterBox";
import SolrInfoFilters from "../../containers/SolrInfo/SolrInfoFilters";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

function SolrInfoForm(props) {
    const {
        farms, currentFarm, onChangeFarm, currentCollection, onChangeCollection,
        onRefreshCollection, onSubmitFilters
    } = props;
    return (
        <div className="TabForm">
            <fieldset className="FormFieldset">
                <legend>Farm Properties</legend>
                <StaticFilterBox filterName="Farm" filterOptions={farms.map(farm => farm.name)}
                                 currentFilterOption={currentFarm}
                                 isLoading={false}
                                 onChange={onChangeFarm}/>
                <StaticFilterBox filterName="Collection"
                                 filterOptions={farms[currentFarm].collections}
                                 currentFilterOption={currentCollection}
                                 isLoading={farms[currentFarm].isLoadingCollections}
                                 onChange={onChangeCollection}
                                 onRefresh={onRefreshCollection}
                                 onRefreshArgs={[currentFarm]}/>
            </fieldset>
            <SolrInfoFilters onSubmitFilters={onSubmitFilters}/>
        </div>
    )
}

export default SolrInfoForm