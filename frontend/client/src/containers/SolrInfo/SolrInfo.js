import React, {Component} from 'react';
import config from "../../Config"
import SolrInfoForm from "../../components/SolrInfo/SolrInfoForm";
import SolrInfoWindow from "./SolrInfoWindow";


export default class SolrInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentFarm: 0,
            currentCollection: 0,
            filters: []
        };
        this.windowRef = React.createRef()
    }

//#region StaticFilterManagement
    onChangeFarm = event => {
        const newFarmIndex = event.currentTarget.id.split('-')[1];
        this.setState({currentFarm: newFarmIndex, currentCollection: 0})
    };

    onChangeCollection = event => {
        const newCollectionIndex = event.currentTarget.id.split('-')[1];
        this.setState({currentCollection: newCollectionIndex});
    };
//#endregion

//#region DynamicFilterManagement
    onAddFilter = (filterProp, filterOperator) => {
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

    onDeleteFilter = (filterIndex) => {
        const tempFilters = this.state.filters;
        tempFilters.splice(filterIndex, 1);
        this.setState({
            filters: tempFilters
        })
    };

    onChangeFilter = (filterIndex, e) => {
        const tempFilters = this.state.filters;
        tempFilters[filterIndex].filterInput = e.target.value;
        this.setState({filters: tempFilters})
    };

    onSubmitFilters = (filters) =>{
        this.setState({filters:[].concat(filters)})
    };

//#endregion

    render() {
        const {farms, onRefreshCollection} = this.props;
        console.log(this.state.filters);
        return (
            <div key="SolrInfo" style={{display: "flex", flexDirection: "row", height: "100%"}}>
                <SolrInfoForm farms={farms} currentFarm={this.state.currentFarm} onChangeFarm={this.onChangeFarm}
                              currentCollection={this.state.currentCollection}
                              onChangeCollection={this.onChangeCollection}
                              onRefreshCollection={onRefreshCollection}
                              onSubmitFilters={this.onSubmitFilters}/>
                {farms[this.state.currentFarm].collections.length !== 0 ?
                    <SolrInfoWindow farm={farms[this.state.currentFarm]}
                                    collection={farms[this.state.currentFarm].collections[this.state.currentCollection]}
                                    filters={this.state.filters}/> :
                    'Waiting for input'}
            </div>
        )
    }
}

