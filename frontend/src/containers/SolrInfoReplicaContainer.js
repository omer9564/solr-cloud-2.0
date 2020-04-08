import React, {Component} from 'react';
import SolrInfoReplica from "../components/SolrInfoReplica";

export default class SolrInfoReplicaContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isChecked: false
        }
    }

    onClickExpand = () => {
        this.setState({isOpen: !this.state.isOpen})

    };

    onClickCheck = (toCheckAll,newValue) => {
        if (newValue !== this.state.isChecked) {
            if (toCheckAll) {
                this.setState({isChecked: newValue})
            }
            else {
                this.setState({isChecked: newValue}, () => {
                    this.props.isAllChecked() ? this.props.checkShard(toCheckAll,true) : this.props.checkShard(toCheckAll,false);
                })
            }
        }
    };


    render() {
        const {replica,checkShard} = this.props;
        return (
            <div>
                <SolrInfoReplica key={replica.replica}
                                 isOpen={this.state.isOpen}
                                 isChecked={this.state.isChecked}
                                 replica={replica}
                                 onClickExpandReplica={this.onClickExpand}
                                 onClickCheckReplica={this.onClickCheck}/>

            </div>
        )
    }
}