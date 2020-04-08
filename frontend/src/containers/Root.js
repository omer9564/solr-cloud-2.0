import React from 'react'
import '../App.css';
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import axios from "axios";
import config from "../Config"
import SolrInfo from "./SolrInfo";
import TabPanel from "../components/TabPanel";

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

    componentDidMount() {
        this.state.farms.map((farm, farmIndex) => this.getCol(farmIndex))
    }


    getCol = async (farmIndex) => {
        const farm = this.state.farms[farmIndex];
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
                headers: {'Access-Control-Allow-Origin': '*'}
            }).then(response => {
            return response.data
        }).catch(error => {
            if (error.response) {
                alert(error.response.data)
            }
            return []
        });
        const tempFarms = this.state.farms;
        tempFarms[farmIndex].collections = collectionsResponse;
        tempFarms[farmIndex].isLoadingCollections = collectionsResponse.length !== 0 ? 0 : -1;
        this.setState({farms: tempFarms});
    };


    handleChange = (event, newValue) => {
        this.setState({currentTab: newValue});
    };


    render() {
        const {classes} = this.props;
        const value = this.state.currentTab;
        return <div className={classes.root}>
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
        </div>;
    }
}

export default withStyles(useStyles)(Root)