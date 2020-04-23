import React from 'react'
import config from "../../Config"
import RadioButtonsGroup from "../../components/RadioButtonsGroup";
import DynamicFieldSelectDialog from "../../components/ReIndexer/DynamicFieldSelectDialog";

export default class ChangeComparisionFieldDialog extends React.Component {
    constructor(props) {
        super(props);
        const type = Object.keys(config.ReIndexer.ComparisionFields)[0];
        this.state = {
            type: type,
            field: config.ReIndexer.ComparisionFields[type].default,
            rangeOption: config.ReIndexer.ComparisionFields[type].rangeOptions[0],
            rangePicker: {
                start: config.ReIndexer.ComparisionFields[type].defaultRangeInput.start,
                end: config.ReIndexer.ComparisionFields[type].defaultRangeInput.end
            }
        };
    }

    handleChangeRadio = (event) => {
        const type = event.target.value;
        this.setState({
            type: type,
            field: config.ReIndexer.ComparisionFields[type].default,
            rangeOption: config.ReIndexer.ComparisionFields[type].rangeOptions[0],
            rangePicker: config.ReIndexer.ComparisionFields[type].defaultRangeInput
        })
    };

    handleChangeField = (event) => {
        this.setState({field: event.target.value})
    };

    handleChangeRangeOption = (event) => {
        this.setState({rangeOption: event.target.value})
    };

    handleChangeRangePicker = (rangeType, newValue) => {
        const tempRangePicker = JSON.parse(JSON.stringify(this.state.rangePicker));
        console.log(newValue.toString("dd/MM/yyyy"));
        debugger;
        tempRangePicker[rangeType] = newValue;
        this.setState({rangePicker: tempRangePicker})
    };

    onSubmit = () => {
        const fieldProps = JSON.parse(JSON.stringify((this.state)));
        if (fieldProps.rangeOption === "All Results") {
            fieldProps.rangePicker = {};
        }
        this.props.onChangeFieldProperties(fieldProps);
        return {isFinished: true, message: "Comaprision field propterties changed successfully"}
    };

    render() {
        const {onChangeField} = this.props;
        const fieldTypes = Object.keys(config.ReIndexer.ComparisionFields);
        const rangeOptions = config.ReIndexer.ComparisionFields[this.state.type].rangeOptions;
        return (
            <div>
                <RadioButtonsGroup labelPlacement="top"
                                   options={fieldTypes} groupName="FieldType" value={this.state.type}
                                   handleChangeRadio={this.handleChangeRadio}/>
                <DynamicFieldSelectDialog type={this.state.type} field={this.state.field}
                                          onChangeField={this.handleChangeField}
                                          onChangeRangeOption={this.handleChangeRangeOption}
                                          onChangeRangePicker={this.handleChangeRangePicker}
                                          rangeOptions={rangeOptions} rangeOption={this.state.rangeOption}
                                          startRange={this.state.rangePicker.start}
                                          endRange={this.state.rangePicker.end}/>
            </div>
        );
    }
}