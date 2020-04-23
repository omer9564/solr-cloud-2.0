import React from 'react'
import StaticFilterBox from "../StaticFilterBox";

function ReIndexerFarmForm(props) {
    const {farms, type, currentFarm, currentCollection, onChangeFarm, onChangeCollection, onRefreshCollection} = props;
    const capitalType = type.charAt(0).toUpperCase() + type.slice(1);

    function handleChangeFarm(event) {
        onChangeFarm(type, event)
    }

    function handleChangeCollection(event) {
        onChangeCollection(type, event)
    }

    return (
        <div>
            <fieldset className="FormFieldset">
                <legend>{capitalType} Farm Properties</legend>
                <StaticFilterBox filterName="Farm" filterOptions={farms.map(farm => farm.name)}
                                 currentFilterOption={currentFarm}
                                 isLoading={false}
                                 onChange={handleChangeFarm}/>
                <StaticFilterBox filterName="Collection"
                                 filterOptions={farms[currentFarm].collections}
                                 currentFilterOption={currentCollection}
                                 isLoading={farms[currentFarm].isLoadingCollections}
                                 onChange={handleChangeCollection}
                                 onRefresh={onRefreshCollection}
                                 onRefreshArgs={[currentFarm]}/>
            </fieldset>
        </div>);
}

export default ReIndexerFarmForm