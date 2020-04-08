import React from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import RefreshIcon from "@material-ui/icons/Refresh";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import WarningIcon from "@material-ui/icons/Warning";
import axios from "axios";
import config from "../Config";
import List from "@material-ui/core/List";
import SolrInfoShardContainer from "./SolrInfoShardContainer";
import SolrInfoActionBarContainer from "./SolrInfoActionBarContainer";


const useStyles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
});


class SolrInfoWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shards: [],
            isLoadingShards: 1
        };
        this.shardsRefs = {};
        this.actionBarRef = React.createRef();
        this.CancelToken = axios.CancelToken;
        this.source = this.CancelToken.source()
    }

    componentDidMount() {
        this.refreshSolrInfoWindow()
    }

    componentDidUpdate(prevProp) {
        if (prevProp.farm.name !== this.props.farm.name || prevProp.collection !== this.props.collection) {
            this.refreshSolrInfoWindow()
        }
    }

    shouldComponentUpdate(nextProps,nextState){
        var shallowCompare = require('react-addons-shallow-compare');
        return shallowCompare(this,nextProps,nextState);
    }

    isLoadingStatusComponent = () => {
        switch (this.state.isLoadingShards) {
            case 1:
                return (
                    <IconButton>
                        <CircularProgress color="primary" fontSize="large"/>
                        <RefreshIcon fontSize="large"/>
                    </IconButton>);
            case -1:
                return (
                    <IconButton onClick={() => this.refreshSolrInfoWindow()}>
                        <WarningIcon color="secondary" fontSize="large"/>
                        <RefreshIcon fontSize="large"/>
                    </IconButton>);
            case 0:
                return (
                    <IconButton onClick={() => this.refreshSolrInfoWindow()}>
                        <RefreshIcon fontSize="large"/>
                    </IconButton>)
        }
    };

    refreshSolrInfoWindow = async () => {
        this.shardsRefs = {};
        this.actionBarRef.checkAll(false);
        if (this.state.isLoadingShards !== 1) {
            this.setState({isLoadingShards: 1}, async () => {
                const shardsResponse = await this.getCollectionShards();
                const responseLoadingStatus = shardsResponse.length !== 0 ? 0 : -1;
                this.setState({
                    shards: shardsResponse.sort((this.sortByProperty("name"))),
                    isLoadingShards: responseLoadingStatus
                });
            })
        }
        else {
            this.source.cancel('Operation canceled by user');
            await this.sleep(100);
            this.setState({isLoadingShards: 1}, async () => {
                const shardsResponse = await this.getCollectionShards();
                const responseLoadingStatus = shardsResponse.length !== 0 ? 0 : -1;
                this.setState({
                    shards: shardsResponse.sort((this.sortByProperty("name"))),
                    isLoadingShards: responseLoadingStatus
                });
            })
        }
    };

    sleep = (time) => {
        return new Promise((resolve => setTimeout(resolve, time)))

    };

    sortByProperty = function (property) {
        return function (x, y) {
            return (x[property].length - y[property].length || (x[property].localeCompare(y[property])))
        }
    };

    getCollectionShards = async () => {
        this.source = this.CancelToken.source();
        console.log("Starting request");
        return await axios.get(config.serverURL + "/shards",
            {
                cancelToken: this.source.token,
                params: {
                    farm: this.props.farm.name,
                    zkHost: this.props.farm.zkHost,
                    collection: this.props.collection
                },
                headers: {'Access-Control-Allow-Origin': '*'}
            }).then(response => {
            return response.data
        }).catch(error => {
            if (axios.isCancel(error)) {
                console.log("Request canceled", error.message);
            }
            else if (error.response) {
                alert(error.response.data)
            }
            return [];
        })
    };


    setShardRef = (shard) => {
        if (shard) {
            const shardName = shard._reactInternalFiber.key;
            this.shardsRefs[shardName] = shard;
        }
    };

    checkAll = () => {
        const isAllChecked = this.isAllChecked();
        Object.keys(this.shardsRefs).map((key) => (
            this.shardsRefs[key].onClickCheckShard(true, !isAllChecked)
        ));
        this.actionBarRef.checkAll(!isAllChecked)
    };

    isAllChecked = () => {
        return Object.keys(this.shardsRefs).reduce((shards, shard) => shards && this.shardsRefs[shard].state.isChecked, true);
    };

    render() {
        const {farm, collection} = this.props;
        console.log('render');
        return (
            <div key="SolrInfoWindow"
                 style={{width: "80%", height: "100%", display: "flex", flexDirection: "column", position: "relative"}}>
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
                    {this.state.isLoadingShards === 0 ? this.state.shards.map((shard, shardIndex) => {
                        return (
                            <SolrInfoShardContainer key={shard.name}
                                                    ref={this.setShardRef}
                                                    isAllChecked={this.isAllChecked}
                                                    actionBarRef={this.actionBarRef}
                                                    shard={shard}/>
                        )
                    }) : <div></div>}
                    {/*<div></div>*/}
                </List>
                {/*<div style={{height: "10%", display: "flex",alignItems:"center"}}>*/}
                    <SolrInfoActionBarContainer key="SolrInfoActionBarC" ref={(node) => {
                        this.actionBarRef = node
                    }} isLoading={this.state.isLoadingShards} onRefresh={this.refreshSolrInfoWindow} checkAll={this.checkAll}/>
                {/*</div>*/}
            </div>
        )
    }
}

export default SolrInfoWindow