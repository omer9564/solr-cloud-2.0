import React from 'react'
import config from "../../Config";
import Button from "@material-ui/core/Button";
import AddFilterDialog from "../AddFilterDialog";
import FormDialog from "../FormDialog";
import DynamicFilterBox from "../../components/DynamicFilterBox";


export default class SolrInfoFilters extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filters: []
        };
    }

    handleAddFilter = (filterProp, filterOperator) => {
        const filterType = config.SolrInfo.filterProps[filterProp].type;
        const defaultFilterInput = config.SolrInfo.filterTypes[filterType].default;
        this.setState({
            filters: [...this.state.filters, {
                filterProp: filterProp,
                filterType: filterType,
                filterOperator: filterOperator,
                filterInput: defaultFilterInput
            }]
        })
    };

    handleDeleteFilter = (filterIndex) => {
        const tempFilters = [].concat(this.state.filters);
        tempFilters.splice(filterIndex, 1);
        this.setState({
            filters: tempFilters
        })
    };

    handleChangeFilter = (filterIndex, e) => {
        const tempFilters = [].concat(this.state.filters);
        tempFilters[filterIndex].filterInput = e.target.value;
        this.setState({filters: tempFilters})
    };

    handleSubmitFilters = () => {
        this.props.onSubmitFilters(JSON.parse(JSON.stringify(this.state.filters)));
    };


    render() {
        return <div>
            {this.state.filters.map((filter, filterIndex) => {
                const filterOptions = config.SolrInfo.filterTypes[filter.filterType].options;
                return (
                    <DynamicFilterBox key={`ReplicaFilter${filterIndex}`}
                                      filterIndex={filterIndex}
                                      filterProp={filter.filterProp}
                                      filterType={filter.filterType}
                                      filterOperator={filter.filterOperator}
                                      filterInput={filter.filterInput}
                                      filterOptions={filterOptions}
                                      onDelete={this.handleDeleteFilter}
                                      onChange={this.handleChangeFilter}/>
                )
            })}
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-evenly"}}>
                <FormDialog buttonTitle="Add Filter" dialogContent="Choose parameters to filter">
                    <AddFilterDialog onAddFilter={this.handleAddFilter}/>
                </FormDialog>
                <Button variant="outlined" color="primary" onClick={this.handleSubmitFilters}>
                    Submit Filters
                </Button>
            </div>
        </div>;
    }
}