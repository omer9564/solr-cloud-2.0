import React from 'react'
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import RefreshIcon from "@material-ui/icons/Refresh";
import WarningIcon from "@material-ui/icons/Warning";

function LoadingStatus(props) {
    const {isLoading,onRefresh,onRefreshArgs,componentStyle} = props;
    const onRefreshArgsFixed = onRefreshArgs ? onRefreshArgs : [];
    switch(isLoading){
        case 1:
            return (<div style={componentStyle}>
                <IconButton>
                    <CircularProgress color="primary" fontSize="large" />
                    <RefreshIcon fontSize="large"/>
                </IconButton>
            </div>);
        case -1:
            return (<div style={componentStyle}>
                <IconButton onClick={()=>onRefresh(...onRefreshArgsFixed)}>
                    <WarningIcon color="secondary" fontSize="large" />
                    <RefreshIcon fontSize="large"/>
                </IconButton>
            </div>);
        case 0:
            return (<div style={componentStyle}>
                <IconButton onClick={()=>onRefresh(...onRefreshArgsFixed)}>
                    <RefreshIcon fontSize="large"/>
                </IconButton>
            </div>);
        default:
            return (<div style={componentStyle}>
                <IconButton onClick={()=>onRefresh(...onRefreshArgsFixed)}>
                    <RefreshIcon fontSize="large"/>
                </IconButton>
            </div>);
    }
}

export default LoadingStatus