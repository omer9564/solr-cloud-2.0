import React, {Component} from 'react';
import SolrInfoReplica from "../../components/SolrInfo/SolrInfoReplica";

export default class SolrInfoReplicaContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isChecked: false
        };
        this.checkAll = false;
    }

    onClickExpand = () => {
        this.setState({isOpen: !this.state.isOpen})

    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const oldActionOnAll = this.checkAll;
        this.checkAll = false;
        return !oldActionOnAll && (this.state !== nextState || this.props !== nextProps);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    onClickCheck = async (toCheckAll, newValue) => {
        if (newValue !== this.state.isChecked) {
            if (toCheckAll) {
                this.checkAll = toCheckAll;
                this.setState({isChecked: newValue});
                console.log(this.props.replica.replica + 'finished');
                this.checkAll = !toCheckAll;
            } else {
                this.setState({isChecked: newValue}, () => {
                    this.props.isAllChecked() ? this.props.checkShard(toCheckAll, true) : this.props.checkShard(toCheckAll, false);
                })
            }
        }
    };

    getState = (key) => {
        return this.state[key]
    };

    render() {
        const {replica} = this.props;
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