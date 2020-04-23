import React from 'react'
import axios from "axios/index";
import config from "../../Config";
import List from "@material-ui/core/List/index";
import SolrInfoShardContainer from "./SolrInfoShardContainer";
import SolrInfoActionBarContainer from "./SolrInfoActionBarContainer";
import {Box} from "@material-ui/core";


const operators = {
    "+": function (a, b) {
        return a + b
    },
    ">": function (a, b) {
        return a > b
    },
    ">=": function (a, b) {
        return a >= b
    },
    "<": function (a, b) {
        return a < b
    },
    "<=": function (a, b) {
        return a <= b
    },
    "=": function (a, b) {
        return a === b
    },
    "!=": function (a, b) {
        return a !== b
    },
    "bool": function (a, b) {
        return a === b
    }
};

class SolrInfoWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shards: [],
            filteredShards: [],
            isLoadingShards: 1
        };
        this.shardsRefs = {};
        this.actionBarRef = React.createRef();
        this.CancelToken = axios.CancelToken;
        this.source = this.CancelToken.source()
    }

    setShardRef = (shard) => {
        if (shard) {
            const shardName = shard._reactInternalFiber.key;
            this.shardsRefs[shardName] = shard;
        }
    };

//#region LifeCycle Methods
    componentDidMount() {
        this.refreshSolrInfoWindow()
    }

    componentDidUpdate(prevProp) {
        const lastFilters = JSON.stringify(prevProp.filters);
        const newFilters = JSON.stringify(this.props.filters);
        if (prevProp.farm.name !== this.props.farm.name || prevProp.collection !== this.props.collection || lastFilters !== newFilters) {
            this.refreshSolrInfoWindow()
        }
    }

    componentWillUnmount() {
        this.source.cancel('Operation canceled by user');
    }


    // shouldComponentUpdate(nextProps, nextState) {
    //     var shallowCompare = require('react-addons-shallow-compare');
    //     return shallowCompare(this, nextProps, nextState);
    // }
//#endregion

//#region getShardsFromServer
    refreshSolrInfoWindow = async () => {
        this.shardsRefs = {};
        this.actionBarRef.checkAll(false);
        if (this.state.isLoadingShards === 1) {
            this.source.cancel('Operation canceled by user');
            await this.sleep(100);
        }
        this.setState({isLoadingShards: 1}, async () => {
            const shardsResponse = await this.getCollectionShards();
            const responseLoadingStatus = shardsResponse.length !== 0 ? 0 : -1;
            const sortedShardsResponse = shardsResponse.sort((this.sortByProperty("name")));
            const filteredShards = this.getFilteredShards(sortedShardsResponse);
            this.setState({
                shards: sortedShardsResponse,
                filteredShards: filteredShards,
                isLoadingShards: responseLoadingStatus
            });
        })

    };

    getCollectionShards = async () => {
        this.source = this.CancelToken.source();
        console.log("Starting request");
        return await axios.get(config.serverURL + "/shards",
            {
                cancelToken: this.source.token,
                params: {
                    farm: this.props.farm.name,
                    solrFarm: this.props.farm.solrFarm,
                    collection: this.props.collection
                },
                headers: {'Access-Control-Allow-Origin': '*'}
            }).then(response => {
            return response.data
        }).catch(error => {
            if (axios.isCancel(error)) {
                console.log("Request canceled", error.message);
            } else if (error.response) {
                alert(error.response.data)
            }
            return [];
        })
    };

    sortByProperty = function (property) {
        return function (x, y) {
            return (x[property].length - y[property].length || (x[property].localeCompare(y[property])))
        }
    };

    sleep = (time) => {
        return new Promise((resolve => setTimeout(resolve, time)))

    };
//#endregion

//#region checkALL
    checkAll = () => {
        const isAllChecked = this.isAllChecked();
        // async.map(Object.keys(this.shardsRefs), (key) => (
        //     this.shardsRefs[key].onClickCheckShard(true, !isAllChecked)));
        const results = Object.keys(this.shardsRefs).map(async (key) => (
            this.shardsRefs[key].onClickCheckShard(true, !isAllChecked)));
        Promise.all(results).then(() => {
            this.actionBarRef.checkAll(!isAllChecked)
        });


    };

    isAllChecked = () => {
        return Object.keys(this.shardsRefs).reduce((shards, shard) => shards && this.shardsRefs[shard].state.isChecked, true);
    };

    getCheckedShardsReplicas = () => {
        const checkedReplicas = Object.keys(this.shardsRefs).map((shard) => this.shardsRefs[shard].getCheckedReplicas()).flat();
        console.log(checkedReplicas);
        alert(JSON.stringify(checkedReplicas));
    };
//#endregion

//#region expandAll
    expandAll = () => {
        const isAllExpanded = this.isAllExpanded();
        Object.keys(this.shardsRefs).map(key => (
            this.shardsRefs[key].onClickExpandShard(true, !isAllExpanded)));
        this.actionBarRef.expandAll(!isAllExpanded)
    };

    isAllExpanded = () => {
        return Object.keys(this.shardsRefs).reduce((shards, shard) => shards && this.shardsRefs[shard].state.isOpen, true);
    };
//#endregion

//#region FilterManagement
    checkIsFilteredReplica = (replica) => {
        let isFilteredReplica = true;
        this.props.filters.forEach((filter) => {
            const {filterProp, filterOperator, filterInput} = filter;
            if (filterInput !== "" && !(operators[filterOperator](replica[filterProp].toString(), filterInput.toString()))) {
                isFilteredReplica = false;
                return isFilteredReplica;
            }
        });
        return isFilteredReplica;
    };

    getFilteredShards = (shards) => {
        const filteredShards = [];
        shards.forEach((shard) => {
            const filteredShard = {name: shard.name, replicas: []};
            shard.replicas.forEach((replica) => {
                const isFilteredReplica = this.checkIsFilteredReplica(replica);
                if (isFilteredReplica) {
                    filteredShard.replicas.push(replica);
                }
            });
            if (filteredShard.replicas.length > 0) {
                filteredShards.push(filteredShard)
            }
        });
        return filteredShards
    };

//#endregion

    render() {
        return (
            <div className="TabWindow">
                <List style={{
                    overflowX: "overlay",
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-around",
                    width: "100%",
                    height: "90%",
                    placeContent: "flex-start"
                }}>
                    {this.state.isLoadingShards === 0 && this.state.filteredShards.map((shard) => {
                        return (
                            <SolrInfoShardContainer key={shard.name}
                                                    ref={this.setShardRef}
                                                    isAllChecked={this.isAllChecked}
                                                    isAllExpanded={this.isAllExpanded}
                                                    actionBarRef={this.actionBarRef}
                                                    shard={shard}/>
                        )
                    })}
                </List>
                <SolrInfoActionBarContainer key="SolrInfoActionBarC" ref={(node) => {
                    this.actionBarRef = node
                }} isLoading={this.state.isLoadingShards} onRefresh={this.refreshSolrInfoWindow}
                                            checkAll={this.checkAll} expandAll={this.expandAll}
                                            onClickButton={this.getCheckedShardsReplicas}/>
            </div>
        )
    }
}

export default SolrInfoWindow