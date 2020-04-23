import React from 'react'
import axios from "axios";
import log from "loglevel"
import remote from "loglevel-plugin-remote"
import config from "../Config"
import '../App.css';
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SolrInfo from "./SolrInfo/SolrInfo";
import TabPanel from "../components/TabPanel";
import ReIndexer from "./ReIndexer/ReIndexer";

const customJSON = log => ({
    msg: log.message,
    level: log.level.label,
    stacktrace: log.stacktrace ? log.stacktrace : null,
    timestamp: log.timestamp,
});

const defaults = {
    url: '/logger',
    method: 'POST',
    headers: {},
    token: '',
    onUnauthorized: failedToken => {},
    timeout: 0,
    interval: 10000,
    level: 'trace',
    backoff: {
        multiplier: 2,
        jitter: 0.1,
        limit: 30000,
    },
    capacity: 500,
    stacktrace: {
        levels: ['trace', 'warn', 'error'],
        depth: 3,
        excess: 0,
    },
    timestamp: () => new Date().toISOString(),
    format: customJSON,
};

remote.apply(log, defaults);

log.enableAll();

const useStyles = theme => ({
    root: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        height: "100vh",
        maxHeight: "100%",
        maxWidth: "100%"
    },
    tab: {
        textTransform: 'none',
        height: "5vh"
    },
    tabPanel: {
        height: '100%',
        overflow:"auto"
    },
    tabPanelBox: {
        height: '100%',
        boxSizing: "border-box",
        paddingRight: "0px",
        paddingLeft: "0px"
    }
});

class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab: 0,
            farms: config.farms.map(farm => {
                return {...farm, isLoadingCollections: 1, collections: []}
            })
        };
    }

//#region LifeCycle Methods
    componentDidMount() {
        this.state.farms.map((farm, farmIndex) => this.getCol(farmIndex))
    }
//#endregion

//#region getCollectionsFromServer
    getCol = async (farmIndex) => {
        const farm = this.state.farms[farmIndex];
        log.info(`Sending GET request to ${config.serverURL}/info?farm?=${farm.name}&solrFarm=${farm.solrFarm}`);
        if (farm.isLoadingCollections !== 1) {
            const currentFarms = this.state.farms;
            currentFarms[farmIndex].isLoadingCollections = 1;
            this.setState({farms: currentFarms})
        }
        const collectionsResponse = await axios.get(config.serverURL + "/collections",
            {
                params: {
                    farm: farm.name,
                    zkHost: farm.zkHost
                },
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                timeout: 5000
            }).then(response => {
                log.info(`Received OK response from server:${JSON.stringify(response.data)}`);
            return response.data
        }).catch(error => {
            console.log(error.code);
            console.log(error.message);
            console.log(error.stack);
            if (error.response) {
                alert(error.response.data);
                log.error(`Received error response from server:${JSON.stringify(error.response.data)}`);
            } else {
                log.error(`Received error response from server:${JSON.stringify(error.response)}`);
            }
            return []
        });
        const tempFarms = this.state.farms;
        tempFarms[farmIndex].collections = collectionsResponse;
        tempFarms[farmIndex].isLoadingCollections = collectionsResponse.length !== 0 ? 0 : -1;
        this.setState({farms: tempFarms});
    };
//#endregion

    handleChange = (event, newValue) => {
        this.setState({currentTab: newValue});
    };
    render() {
        const {classes} = this.props;
        const value = this.state.currentTab;
        return <div className="Root">
            <AppBar position="static" color="default" style={{height: "5vh", minHeight: "48px"}}>
                <Tabs key={`Tab-${value}`}
                      value={value}
                      onChange={this.handleChange}
                      indicatorColor="primary"
                      textColor="primary"
                      variant="fullWidth"
                      className={classes.tab}>
                    <Tab className={classes.tab} label="SolrInfo"/>
                    <Tab className={classes.tab} label="ReIndexer"/>
                </Tabs>
            </AppBar>
            <TabPanel className={classes.tabPanel} boxClass={classes.tabPanelBox} value={value} index={0}
                      tab="SolrInfo">
                <SolrInfo value={value} farms={this.state.farms} onRefreshCollection={this.getCol}/>
            </TabPanel>
            <TabPanel className={classes.tabPanel} boxClass={classes.tabPanelBox} value={value} index={1}
                      tab="SolrInfo">
                <ReIndexer value={value} farms={this.state.farms} onRefreshCollection={this.getCol}/>
            </TabPanel>
        </div>;
    }
}

export default withStyles(useStyles)(Root)