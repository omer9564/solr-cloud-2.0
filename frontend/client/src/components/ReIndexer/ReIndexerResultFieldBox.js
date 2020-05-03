import React, {Component} from 'react'
import Box from "@material-ui/core/Box/index";
import Paper from "@material-ui/core/Paper/index";
import TableContainer from "@material-ui/core/TableContainer/index";
import TableRow from "@material-ui/core/TableRow/index";
import TableCell from "@material-ui/core/TableCell/index";
import Table from "@material-ui/core/Table/index";
import ListItem from "@material-ui/core/ListItem/index";
import ListItemIcon from "@material-ui/core/ListItemIcon/index";
import Checkbox from "@material-ui/core/Checkbox/index";
import ListItemText from "@material-ui/core/ListItemText/index";
import Collapse from "@material-ui/core/Collapse/Collapse";
import {ExpandLess, ExpandMore} from "@material-ui/icons";

class ReIndexerResultFieldBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: false,
            isOpen: true
        }
    }


    getPrepositionWord = () => {
        if (this.props.diff > 0) {
            return "more docs than";
        } else if (this.props.diff < 0) {
            return "less docs than";
        } else {
            return "same docs as"
        }
    };

    handleCheck = () => {
        this.setState({isChecked: !this.state.isChecked})
    };

    handleExpand = () => {
        this.setState({isOpen: !this.state.isOpen})
    };

    render() {
        const {field, src, dst, diff} = this.props;
        return (
            <Box borderRadius={16} border={1} m={1} boxShadow={5} height="fit-content" overflow="hidden">
                <ListItem role={undefined} dense button
                          style={{
                              width: "300px",
                              maxWidth: "300px",
                              height: "fit-content"
                          }}>
                    <ListItemIcon onClick={this.handleCheck}>
                        <Checkbox
                            edge="start"
                            color="primary"
                            checked={this.state.isChecked}
                            tabIndex={-1}
                            disableRipple
                        />
                    </ListItemIcon>
                    <ListItemText primary={field} secondary={`source has ${this.getPrepositionWord()} destination`}
                                  onClick={this.handleCheck}/>
                    {this.state.isOpen ? <ExpandLess onClick={this.handleExpand}/> :
                        <ExpandMore onClick={this.handleExpand}/>}
                </ListItem>
                <Collapse in={this.state.isOpen} timeout="auto" unmountOnExit>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableRow>
                                <TableCell component="th" style={{fontWeight: 'bold'}}>
                                    source
                                </TableCell>
                                <TableCell component="td">
                                    {src}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" style={{fontWeight: 'bold'}}>
                                    destination
                                </TableCell>
                                <TableCell component="td">
                                    {dst}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" style={{fontWeight: 'bold'}}>
                                    diff
                                </TableCell>
                                <TableCell component="td">
                                    {diff}
                                </TableCell>
                            </TableRow>
                        </Table>
                    </TableContainer>
                </Collapse>
            </Box>);
    }
}

export default ReIndexerResultFieldBox