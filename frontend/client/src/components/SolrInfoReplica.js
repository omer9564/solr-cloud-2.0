import React from 'react'
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
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
            // fontWeight: 'bold'
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

function SolrInfoReplica(props) {
    const {replica,isOpen,isChecked, onClickExpandReplica, onClickCheckReplica} = props;
    const itemStyle = replica.leader ? stateColor[`${replica.state}_leader`] : stateColor[`${replica.state}_replica`];
    return (
        <Box key={`ReplicaBox-${replica.replica}`}>
            <ListItem role={undefined} dense button>
                <ListItemIcon onClick={() => onClickCheckReplica(false,!isChecked)}>
                    <Checkbox
                        key={`ReplicaItemCheckBox-${replica.replica}`}
                        edge="start"
                        color="primary"
                        checked={isChecked}
                        tabIndex={-1}
                        disableRipple
                    />
                </ListItemIcon>
                <ListItemText key={`ReplicaItemText-${replica.replica}`} primary={replica.host} secondary={replica.state} primaryTypographyProps={itemStyle}
                              onClick={() => onClickCheckReplica(false,!isChecked)}/>
                {isOpen ? <ExpandLess key={`ReplicaItemExpand-${replica.replica}`}
                        onClick={() => onClickExpandReplica()}/> :
                    <ExpandMore key={`ReplicaItemExpand-${replica.replica}`}
                        onClick={() => onClickExpandReplica()}/>}
            </ListItem>
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List style={{paddingLeft: '20px'}}>
                    {Object.keys(replica).filter(key => typeof replica[key] !== "boolean" && typeof replica[key] !== "object").map(key => {
                        return (
                            <ListItem key={`${replica.replica}-${key}`}>
                                <ListItemText style={{width: "30%"}}
                                              primaryTypographyProps={{
                                                  style: {
                                                      fontWeight: 'bold',
                                                      paddingRight: '2px'
                                                  }
                                              }}
                                              primary={key}/>
                                <ListItemText style={{width: "80%"}} primary={replica[key]}/>
                            </ListItem>
                        )
                    })}
                </List>
            </Collapse>
        </Box>
    );
}

export default SolrInfoReplica