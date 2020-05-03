import React, {Component} from 'react';
import ReIndexerForm from "../../components/ReIndexer/ReIndexerForm";
import ReactDOM from "react-dom";
import Root from "../Root";
import SolrInfoWindow from "../SolrInfo/SolrInfoWindow";
import config from "../../Config";
import ReIndexerWindow from "./ReIndexerWindow";


export default class ReIndexer extends Component {
    constructor(props) {
        super(props);
        const type = Object.keys(config.ReIndexer.ComparisonFields)[0];
        this.state = {
            sourceProps: {
                farm: 0,
                collection: 0
            },
            destinationProps: {
                farm: 0,
                collection: 0
            },
            fieldProps: {
                type: type,
                field: config.ReIndexer.ComparisonFields[type].default,
                rangeOption: config.ReIndexer.ComparisonFields[type].rangeOptions[0],
                rangePicker: {}
            },
            submitted: false
        };
    }

//#region StaticComparisonManagement
    onChangeFarm = (type, event) => {
        const newFarmIndex = parseInt(event.currentTarget.id.split('-')[1]);
        const tempState = this.state;
        tempState[`${type}Props`].farm = newFarmIndex;
        this.setState(tempState)
    };

    onChangeCollection = (type, event) => {
        const newCollectionIndex = parseInt(event.currentTarget.id.split('-')[1]);
        const tempState = this.state;
        tempState[`${type}Props`].collection = newCollectionIndex;
        this.setState(tempState)
    };
//#endregion

//#region ComparisonFieldManagement

    onChangeFieldProperties = (newProps) => {
        this.setState({fieldProps: newProps})
    };

    onSubmitComparison = () => {
        if (this.props.farms[this.state.sourceProps.farm].collections.length > 0 &&
            this.props.farms[this.state.destinationProps.farm].collections.length > 0) {
            this.setState({submitted: true})
        } else {
            this.setState({submitted: false});
            alert("Invalid collections")
        }
    };

//#endregion

    render() {
        const {farms, onRefreshCollection} = this.props;
        return (
            <div key="ReIndexer" style={{display: "flex", flexDirection: "row", height: "100%"}}>
                <ReIndexerForm farms={farms} onChangeFarm={this.onChangeFarm}
                               currentSourceProps={this.state.sourceProps}
                               currentDestinationProps={this.state.destinationProps}
                               onChangeCollection={this.onChangeCollection}
                               onRefreshCollection={onRefreshCollection}
                               onChangeFieldProperties={this.onChangeFieldProperties}
                               currentFieldProps={JSON.parse(JSON.stringify(this.state.fieldProps))}
                               onSubmitComparison={this.onSubmitComparison}/>
                {this.state.submitted ?
                    <ReIndexerWindow sourceFarm={this.props.farms[this.state.sourceProps.farm]}
                                     sourceCollection={this.props.farms[this.state.sourceProps.farm].collections[this.state.sourceProps.collection]}
                                     destinationFarm={this.props.farms[this.state.destinationProps.farm]}
                                     destinationCollection={this.props.farms[this.state.destinationProps.farm].collections[this.state.destinationProps.collection]}
                                     fieldProps={this.state.fieldProps}/> :
                    <div id="ReIndexerWindow" className="TabWindow">
                        <img src={require("../../WaitingGif.gif")} width="100%" height="100%"/>
                    </div>}

            </div>
        )
    }
}

