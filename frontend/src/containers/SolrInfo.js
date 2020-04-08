import React, {Component} from 'react';
import config from "../Config"
import SolrInfoForm from "../components/SolrInfoForm";
import SolrInfoWindow from "./SolrInfoWindow";


export default class SolrInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentFarm: 0,
            currentCollection: 0,
            filters: []
        }
    }


    onChangeFarm = event => {
        const newFarmIndex = event.currentTarget.id.split('-')[1];
        this.setState({currentFarm: newFarmIndex, currentCollection: 0})
    };

    onChangeCollection = event => {
        const newCollectionIndex = event.currentTarget.id.split('-')[1];
        this.setState({currentCollection: newCollectionIndex});
    };

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

    render() {
        const {farms, onRefreshCollection} = this.props;
        return (
            <div key="SolrInfo" style={{display: "flex", flexDirection: "row", height: "100%"}}>
                <SolrInfoForm farms={farms} currentFarm={this.state.currentFarm} onChangeFarm={this.onChangeFarm}
                              currentCollection={this.state.currentCollection}
                              onChangeCollection={this.onChangeCollection}
                              onRefreshCollection={onRefreshCollection}
                              filters={this.state.filters}
                              onAddFilter={this.onAddFilter}
                              onDeleteFilter={this.onDeleteFilter}/>
                {farms[this.state.currentFarm].collections.length !== 0 ?
                    <SolrInfoWindow farm={farms[this.state.currentFarm]}
                                    collection={farms[this.state.currentFarm].collections[this.state.currentCollection]}/> :
                    'Waiting for input'}
                {/*<SolrInfoWindow farm={farms[this.state.currentFarm]} collectionIndex={this.state.currentCollection}/>*/}

            </div>
        )
    }
}

