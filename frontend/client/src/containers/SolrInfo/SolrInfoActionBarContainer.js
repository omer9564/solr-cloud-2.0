import React, {Component} from 'react';
import Checkbox from "@material-ui/core/Checkbox/index";
import {ExpandLess, ExpandMore} from "@material-ui/icons/index";
import IconButton from "@material-ui/core/IconButton/index";
import LoadingStatus from "../../components/LoadingStatus";

export default class SolrInfoActionBarContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: false,
            isOpen:true,
        };
    }

    checkAll = (newValue) => {
        this.setState({isChecked: newValue});
    };

    expandAll = (newValue) => {
        this.setState({isOpen: newValue})
    };

    render() {
        const {checkAll, expandAll, isLoading, onRefresh, onRefreshArgs} = this.props;
        return (
            <div style={{height: "10%", display: "flex", alignItems: "center"}}>
                <LoadingStatus isLoading={isLoading} onRefresh={onRefresh} onRefreshArgs={onRefreshArgs}/>
                <IconButton onClick={expandAll}>
                    {this.state.isOpen ? <ExpandLess key={`ExpandAllShards`} fontSize="large"/> :
                        <ExpandMore key={`ExpandAllShards`} fontSize="large"/>}
                </IconButton>
                <Checkbox
                    key={`CheckAllShards`}
                    edge="start"
                    color="primary"
                    checked={this.state.isChecked}
                    onClick={checkAll}
                    tabIndex={-1}
                    disableRipple
                />
            </div>
        )
    }
}