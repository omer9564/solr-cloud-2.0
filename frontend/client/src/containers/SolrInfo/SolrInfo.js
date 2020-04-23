import React, {Component} from 'react';
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
    }

//#region StaticFilterManagement
    onChangeFarm = event => {
        const newFarmIndex = parseInt(event.currentTarget.id.split('-')[1]);
        this.setState({currentFarm: newFarmIndex, currentCollection: 0})
    };

    onChangeCollection = event => {
        const newCollectionIndex = parseInt(event.currentTarget.id.split('-')[1]);
        this.setState({currentCollection: newCollectionIndex});
    };
//#endregion

//#region DynamicFilterManagement

    onSubmitFilters = (filters) => {
        this.setState({filters: [].concat(filters)})
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
                    <div id="ReIndexerWindow" className="TabWindow">
                        <img src={require("../../WaitingGif.gif")} width="100%" height="100%"/>
                    </div>}
            </div>
        )
    }
}

