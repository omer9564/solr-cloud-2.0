import React, {Component} from 'react';
import Checkbox from "@material-ui/core/Checkbox/index";
import {ExpandLess, ExpandMore} from "@material-ui/icons/index";
import IconButton from "@material-ui/core/IconButton/index";
import Button from "@material-ui/core/Button";
import LoadingStatus from "../../components/LoadingStatus";
import {Box} from "@material-ui/core";

export default class SolrInfoActionBarContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: false,
            isOpen: true,
        };
    }

    checkAll = (newValue) => {
        this.setState({isChecked: newValue});
    };

    expandAll = (newValue) => {
        this.setState({isOpen: newValue})
    };

    render() {
        const {checkAll, expandAll, isLoading, onRefresh, onRefreshArgs, onClickButton} = this.props;
        return (
            <div className="WindowActions">
                <div style={{display:"flex"}}>
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
                <Button onClick={onClickButton}>
                    Alert Checked Replicas
                </Button>
            </div>
        )
    }
}