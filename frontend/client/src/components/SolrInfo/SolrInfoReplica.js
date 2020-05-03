import React from 'react'
import ListItem from "@material-ui/core/ListItem/index";
import ListItemIcon from "@material-ui/core/ListItemIcon/index";
import Checkbox from "@material-ui/core/Checkbox/index";
import ListItemText from "@material-ui/core/ListItemText/index";
import {ExpandLess, ExpandMore} from "@material-ui/icons/index";
import Collapse from "@material-ui/core/Collapse/index";
import Box from "@material-ui/core/Box/index";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Table from "@material-ui/core/Table";

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
    const {replica, isOpen, isChecked, onClickExpandReplica, onClickCheckReplica} = props;
    const itemStyle = replica.leader==="true" ? stateColor[`${replica.state}_leader`] : stateColor[`${replica.state}_replica`];
    return (
        <Box key={`ReplicaBox-${replica.replica}`}>
            <ListItem role={undefined} dense button>
                <ListItemIcon onClick={() => onClickCheckReplica(false, !isChecked)}>
                    <Checkbox
                        key={`ReplicaItemCheckBox-${replica.replica}`}
                        edge="start"
                        color="primary"
                        checked={isChecked}
                        tabIndex={-1}
                        disableRipple
                    />
                </ListItemIcon>
                <ListItemText key={`ReplicaItemText-${replica.replica}`} primary={replica.node_name}
                              secondary={replica.state} primaryTypographyProps={itemStyle}
                              onClick={() => onClickCheckReplica(false, !isChecked)}/>
                {isOpen ? <ExpandLess key={`ReplicaItemExpand-${replica.replica}`}
                                      onClick={() => onClickExpandReplica()}/> :
                    <ExpandMore key={`ReplicaItemExpand-${replica.replica}`}
                                onClick={() => onClickExpandReplica()}/>}
            </ListItem>
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <TableContainer component={Paper}>
                    <Table size="small">
                        {Object.keys(replica).filter(key => typeof replica[key] !== "boolean" && typeof replica[key] !== "object").map(key => {
                            return (
                                <TableRow key={`${replica.replica}-${key}`}>
                                    <TableCell component="th" style={{fontWeight:'bold'}}>
                                        {key}
                                    </TableCell>
                                    <TableCell component="td">
                                        {replica[key]}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </Table>
                </TableContainer>
            </Collapse>
        </Box>
    );
}

export default SolrInfoReplica