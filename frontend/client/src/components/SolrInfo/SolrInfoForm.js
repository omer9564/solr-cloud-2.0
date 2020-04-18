import React from 'react';
import StaticFilterBox from "../StaticFilterBox";
import Box from "@material-ui/core/Box/index";
import SolrInfoFilters from "../../containers/SolrInfo/SolrInfoFilters";

function SolrInfoForm(props) {
    const {
        farms, currentFarm, onChangeFarm, currentCollection, onChangeCollection,
        onRefreshCollection, onSubmitFilters
    } = props;
    return (
        <Box class="TabForm">
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

            {/*{filters.map((filter, filterIndex) => {*/}
            {/*    return (*/}
            {/*        <DynamicFilterBox key={`ReplicaFilter${filterIndex}`}*/}
            {/*                          filterIndex={filterIndex}*/}
            {/*                          filterProp={filter.filterProp}*/}
            {/*                          filterType={filter.filterType}*/}
            {/*                          filterOperator={filter.filterOperator}*/}
            {/*                          onDelete={onDeleteFilter}*/}
            {/*                          onChange={onChangeFilter}/>*/}
            {/*    )*/}
            {/*})}*/}
            <SolrInfoFilters onSubmitFilters={onSubmitFilters}/>
            {/*<FormDialog buttonTitle="Add Filter" dialogContent="Choose parameters to filter">*/}
            {/*    <AddFilterDialog onAddFilter={onAddFilter}/>*/}
            {/*</FormDialog>*/}
        </Box>
    )
}

export default SolrInfoForm