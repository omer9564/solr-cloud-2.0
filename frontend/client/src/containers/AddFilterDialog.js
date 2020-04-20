import React from 'react'
import config from "../Config"
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";

class AddFilterDialog extends React.Component {
    constructor(props) {
        super(props);
        const property = Object.keys(config.SolrInfo.filterProps)[0];
        const operator = config.SolrInfo.filterProps[property].allowedOperators[0];
        this.state = {
            property: property,
            operator: operator
        }
    }

    handleChangeProperty = event => {
        const newProperty = event.target.value;
        this.setState({
            property: newProperty,
            operator: config.SolrInfo.filterProps[newProperty].allowedOperators[0]
        });
    };

    handleChangeOperator = event => {
        const newOperator = event.target.value;
        this.setState({operator: newOperator})
    };

    onSubmit = () => {
        this.props.onAddFilter(this.state.property, this.state.operator)
    };

    render() {
        return (
            <div>
                <form style={{display: "flex", flexDirection: "column"}}>
                    <InputLabel>Filter Property</InputLabel>
                    <Select value={this.state.property}
                            onChange={this.handleChangeProperty}
                            style={{margin: "5px"}}
                    >
                        {Object.keys(config.SolrInfo.filterProps).map(prop => {
                            return (
                                <MenuItem key={prop} value={prop}>{prop}</MenuItem>
                            )
                        })}
                    </Select>
                    <InputLabel>Filter Operator</InputLabel>
                    <Select value={this.state.operator}
                            onChange={this.handleChangeOperator}
                            style={{margin: "5px"}}
                    >
                        {config.SolrInfo.filterProps[this.state.property].allowedOperators.map(operator => {
                            return (
                                <MenuItem key={operator} value={operator}>{operator}</MenuItem>
                            )
                        })}
                    </Select>
                </form>
            </div>
        );
    }
}

export default AddFilterDialog