import React from 'react';
import StaticFilterBox from "../StaticFilterBox";
import SolrInfoFilters from "../../containers/SolrInfo/SolrInfoFilters";

function SolrInfoForm(props) {
    const {
        farms, currentFarm, onChangeFarm, currentCollection, onChangeCollection,
        onRefreshCollection, onSubmitFilters} = props;
    return (
        <div className="TabForm">
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
            <SolrInfoFilters onSubmitFilters={onSubmitFilters}/>
        </div>
    )
}

export default SolrInfoForm