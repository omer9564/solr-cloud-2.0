import React from 'react'
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import Box from "@material-ui/core/Box";
import SolrInfoReplicaContainer from "../containers/SolrInfo/SolrInfoReplicaContainer";

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

function SolrInfoShard(props) {
    const {shard, isOpen, setReplicaRef,isChecked, onClickExpandShard, onClickCheckShard} = props;
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
                <ListItemIcon onClick={() => onClickCheckShard(!isChecked)}>
                    <Checkbox
                        key={`ShardItemCheckBox-${shard.name}`}
                        edge="start"
                        color="primary"
                        checked={isChecked}
                        // checked={shard.replicas.reduce((reps, replica) => reps && !!replica.checked, true)}
                        tabIndex={-1}
                        disableRipple
                    />
                </ListItemIcon>
                <ListItemText key={`ShardItemText-${shard.name}`} primary={shard.name}
                              primaryTypographyProps={itemStyle}
                              onClick={() => onClickCheckShard(!isChecked)}/>
                {isOpen ? <ExpandLess key={`ShardItemExpand-${shard.name}`} onClick={() => onClickExpandShard(!isOpen)}/> :
                    <ExpandMore key={`ShardItemExpand-${shard.name}`} onClick={() => onClickExpandShard(!isOpen)}/>}
            </ListItem>
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List style={{paddingLeft: '20px'}}>
                    {shard.replicas.map((replica, replicaIndex) => {
                        return (
                            <SolrInfoReplicaContainer key={replica.replica}
                                                      ref={setReplicaRef}
                                                      replica={replica}
                                                      replicaIndex={replicaIndex}/>
                        )
                    })}
                </List>
            </Collapse>
        </Box>
    );
}

export default SolrInfoShard