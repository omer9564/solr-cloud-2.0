import React, {Component} from 'react';
import ListItem from "@material-ui/core/ListItem/index";
import ListItemIcon from "@material-ui/core/ListItemIcon/index";
import Checkbox from "@material-ui/core/Checkbox/index";
import ListItemText from "@material-ui/core/ListItemText/index";
import {ExpandLess, ExpandMore} from "@material-ui/icons/index";
import List from "@material-ui/core/List/index";
import SolrInfoReplicaContainer from "./SolrInfoReplicaContainer";
import Box from "@material-ui/core/Box/index";


const stateColor = {
    active_leader: {
        style: {
            color: "#008000",
            fontWeight: 'bold'
        }
    },
    active_replica: {
        style: {
            color: "#008000",
        }
    },
    down_leader: {
        style: {
            color: "#808080",
            fontWeight: 'bold'
        }
    },
    down_replica: {
        style: {
            color: "#808080",
        }
    },
    recovering_leader: {
        style: {
            color: "#CCCC00",
            fontWeight: 'bold'
        }
    },
    recovering_replica: {
        style: {
            color: "#CCCC00",
        }
    },
};

export default class SolrInfoShardContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: true,
            isChecked: false
        };
        this.replicasRefs = []
    }

    sleep = (time) => {
        return new Promise((resolve => setTimeout(resolve, time)))

    };


//#region checkShardManagement
    onClickCheckShard = async (toCheckAll, newValue) => {
        console.log(this.props.shard.name);
        if (newValue !== this.state.isChecked) {
            let results;
            if (toCheckAll) {
                this.checkAll = toCheckAll;
                results = Object.keys(this.replicasRefs).map(async (key) => (
                    this.replicasRefs[key].onClickCheck(toCheckAll, newValue)
                ));
                this.checkShard(toCheckAll, newValue)
            } else {
                results = Object.keys(this.replicasRefs).map(async (key) => (
                    this.replicasRefs[key].onClickCheck(toCheckAll, newValue)
                ));
            }
            Promise.all(results).then(()=> console.log(this.props.shard.name + "Finished replicas"))
        }
    };

    checkShard = (toCheckAll, newValue) => {
        if (toCheckAll) {
            this.setState({isChecked: newValue});
            console.log(this.props.shard.name + " render")
        } else {
            this.setState({isChecked: newValue}, () => {
                this.props.isAllChecked() ? this.props.actionBarRef.checkAll(true) : this.props.actionBarRef.checkAll(false);
            });
        }
    };

    isAllChecked = () => {
        return Object.keys(this.replicasRefs).reduce((reps, replica) => reps && this.replicasRefs[replica].state.isChecked, true);
    };
//#endregion

//#region expandShardManagement
    onClickExpandShard = (toExpandAll, newValue) => {
        if (newValue !== this.state.isOpen) {
            this.expandShard(toExpandAll,newValue)
        }
    };

    expandShard = (toExpandAll, newValue) => {
        if (toExpandAll) {
            this.setState({isOpen: newValue});
        } else {
            this.setState({isOpen: newValue}, () => {
                this.props.isAllExpanded() ? this.props.actionBarRef.expandAll(true) : this.props.actionBarRef.expandAll(false);
            })
        }
    };
//#endregion

    setReplicaRef = (replica) => {
        if (replica) {
            const replicaName = replica._reactInternalFiber.key;
            this.replicasRefs[replicaName] = replica;
        }
    };

    render() {
        const {shard} = this.props;
        const leaderInfo = shard.replicas.filter(replica => replica.leader === true);
        const itemStyle = leaderInfo.length > 0 ? stateColor[`${leaderInfo[0].state}_leader`] : stateColor[`down_leader`];
        return (
            <Box key={`ShardBox-${shard.name}`} borderRadius={16} border={1} m={1} boxShadow={5} height="fit-content"
                 overflow="hidden">
                <ListItem key={`ShardItem-${shard.name}`} role={undefined} dense button
                          style={{
                              width: "350px",
                              maxWidth: "350px",
                              height: "fit-content"
                          }}>
                    <ListItemIcon onClick={() => this.onClickCheckShard(false, !this.state.isChecked)}>
                        <Checkbox
                            key={`ShardItemCheckBox-${shard.name}`}
                            edge="start"
                            color="primary"
                            checked={this.state.isChecked}
                            // checked={shard.replicas.reduce((reps, replica) => reps && !!replica.checked, true)}
                            tabIndex={-1}
                            disableRipple
                        />
                    </ListItemIcon>
                    <ListItemText key={`ShardItemText-${shard.name}`} primary={shard.name}
                                  primaryTypographyProps={itemStyle}
                                  onClick={() => this.onClickCheckShard(false, !this.state.isChecked)}/>
                    {this.state.isOpen ? <ExpandLess key={`ShardItemExpand-${shard.name}`}
                                                     onClick={() => this.onClickExpandShard(false,!this.state.isOpen)}/> :
                        <ExpandMore key={`ShardItemExpand-${shard.name}`}
                                    onClick={() => this.onClickExpandShard(false,!this.state.isOpen)}/>}
                </ListItem>
                <List style={{paddingLeft: '20px', display: `${this.state.isOpen ? 'block' : 'none'}`}}>
                    {shard.replicas.map((replica) => {
                        return (
                            <SolrInfoReplicaContainer key={replica.replica}
                                                      ref={this.setReplicaRef}
                                                      checkShard={this.checkShard}
                                                      isAllChecked={this.isAllChecked}
                                                      replica={replica}/>
                        )
                    })}
                </List>
            </Box>
        )
    }
}