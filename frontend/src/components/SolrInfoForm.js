import React, {useRef} from 'react';
import FilterBox from "./FilterBox";
import Box from "@material-ui/core/Box";
import FormDialog from "../containers/FormDialog";
import StatsFilterBox from "./StatsFilterBox"
import AddFilterDialog from "../containers/AddFilterDialog";

function SolrInfoForm(props) {
    const {farms, currentFarm, onChangeFarm, currentCollection, onChangeCollection, onRefreshCollection, filters, onAddFilter, onDeleteFilter} = props;
    return (
        <Box display="flex" flexDirection="column" padding="3px"
             borderRight={2}
             style={{
                 boxSizing: "border-box", width: "20%",
                 height: "100%",
                 maxHeight: "100%",
                 overflow: "auto"
             }}>
            <FilterBox filterName="Farm" filterOptions={farms.map(farm => farm.name)}
                       currentFilterOption={currentFarm}
                       isLoading={false}
                       onChange={onChangeFarm}/>
            <FilterBox filterName="Collection"
                       filterOptions={farms[currentFarm].collections}
                       currentFilterOption={currentCollection}
                       isLoading={farms[currentFarm].isLoadingCollections}
                       onChange={onChangeCollection}
                       onRefresh={onRefreshCollection}
                       onRefreshArgs={[currentFarm]}/>

            {filters.map((filter, filterIndex) => {
                return (
                    <StatsFilterBox key={`ReplicaFilter${filterIndex}`}
                                    filterIndex={filterIndex}
                                    filterProp={filter.filterProp}
                                    filterType={filter.filterType}
                                    filterOperator={filter.filterOperator}
                                    onDelete={onDeleteFilter}/>
                )
            })}
            <FormDialog buttonTitle="Add Filter" dialogContent="Choose parameters to filter">
                <AddFilterDialog onAddFilter={onAddFilter}/>
            </FormDialog>

        </Box>
    )
}

export default SolrInfoForm