import React, {Component} from 'react';
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import List from "@material-ui/core/List";
import SolrInfoReplicaContainer from "./SolrInfoReplicaContainer";
import Box from "@material-ui/core/Box";


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

    onClickExpandShard = (newValue) => {
        this.setState({isOpen: newValue})

    };

    onClickCheckShard = (toCheckAll, newValue) => {
        if (newValue !== this.state.isChecked) {
            if (toCheckAll) {
                Object.keys(this.replicasRefs).map((key) => (
                    this.replicasRefs[key].onClickCheck(toCheckAll, newValue)
                ));
                this.checkShard(toCheckAll, newValue)
            }
            else {
                Object.keys(this.replicasRefs).map((key) => (
                    this.replicasRefs[key].onClickCheck(toCheckAll, newValue)
                ));
            }
        }
    };

    checkShard = (toCheckAll, newValue) => {
        if (toCheckAll) {
            this.setState({isChecked: newValue})
        }
        else {
            this.setState({isChecked: newValue}, () => {
                this.props.isAllChecked() ? this.props.actionBarRef.checkAll(true) : this.props.actionBarRef.checkAll(false);
            });
        }
    };

    setReplicaRef = (replica) => {
        if (replica) {
            const replicaName = replica._reactInternalFiber.key;
            this.replicasRefs[replicaName] = replica;
        }
    };

    isAllChecked = () => {
        return Object.keys(this.replicasRefs).reduce((reps, replica) => reps && this.replicasRefs[replica].state.isChecked, true);
    };

    render() {
        const {shard, isAllChecked, actionBarRef} = this.props;
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
                                                     onClick={() => this.onClickExpandShard(!this.state.isOpen)}/> :
                        <ExpandMore key={`ShardItemExpand-${shard.name}`}
                                    onClick={() => this.onClickExpandShard(!this.state.isOpen)}/>}
                </ListItem>
                <List style={{paddingLeft: '20px',display:`${this.state.isOpen ? 'block' : 'none'}`}}>
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