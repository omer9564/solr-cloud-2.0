import React from 'react'
import ReIndexerResultFieldBox from "../../components/ReIndexer/ReIndexerResultFieldBox";
import axios from "axios";
import config from "../../Config";
import List from "@material-ui/core/List";

export default class ReIndexerWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comparisonResults: [],
            isLoading: 1
        };
        this.CancelToken = axios.CancelToken;
        this.source = this.CancelToken.source()
    }

    componentDidMount() {
        this.refreshReIndexerWindow()
    }

    componentWillUnmount() {
        this.source.cancel('Operation canceled by user');
    }

    refreshReIndexerWindow = async () => {
        // this.shardsRefs = {};
        // this.actionBarRef.checkAll(false);
        if (this.state.isLoadingShards === 1) {
            this.source.cancel('Operation canceled by user');
            await this.sleep(100);
        }
        this.setState({isLoadingShards: 1}, async () => {
            const comparisonResponse = await this.getComparisonResult();
            const responseLoadingStatus = comparisonResponse.length !== 0 ? 0 : -1;
            // const sortedShardsResponse = shardsResponse.sort((this.sortByProperty("name")));
            // const filteredShards = this.getFilteredShards(sortedShardsResponse);
            this.setState({
                comparisonResults: comparisonResponse,
                isLoadingShards: responseLoadingStatus
            });
        })

    };

    getComparisonResult = async () => {
        this.source = this.CancelToken.source();
        console.log("Starting request");
        return await axios.get(config.serverURL + "/compare",
            {
                cancelToken: this.source.token,

                headers: {'Access-Control-Allow-Origin': '*'}
            }).then(response => {
            return response.data
        }).catch(error => {
            if (axios.isCancel(error)) {
                console.log("Request canceled", error.message);
            } else if (error.response) {
                alert(error.response.data)
            }
            return [];
        })
    };

    render() {
        const {sourceFarm, sourceCollection, destinationFarm, destinationCollection} = this.props;
        return (
            <div className="TabWindow">
                <List style={{
                    overflowX: "overlay",
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-around",
                    width: "100%",
                    height: "90%",
                    placeContent: "flex-start"
                }}>
                    {this.state.comparisonResults.map((result) => {
                        return (
                            <ReIndexerResultFieldBox field={result.field} src={result.src} dst={result.dst}
                                                     diff={result.diff}/>
                        )
                    })}
                </List>
            </div>);
    }
}