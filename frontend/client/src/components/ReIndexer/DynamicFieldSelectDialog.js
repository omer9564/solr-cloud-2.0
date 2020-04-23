import React from 'react'
import config from "../../Config"
import TimeFieldSelect from "./TimeFieldSelect";

function DynamicFieldSelectDialog(props) {
    const {type, field, rangeOptions, rangeOption, startRange, endRange, onChangeField, onChangeRangeOption,onChangeRangePicker} = props;
    switch (type) {
        case "GenericField":
            return (<div></div>);
        case "TimeField":
            return (
                <TimeFieldSelect type={type} defaultValue={field} rangeOptions={rangeOptions} rangeOption={rangeOption}
                                 textPropName="Field" startRange={startRange} endRange={endRange}
                                 onChangeField={onChangeField}
                                 onChangeRangeOption={onChangeRangeOption}
                                 onChangeRangePicker={onChangeRangePicker}/>);
        case "shards":
            return (<div></div>);
        default:
            return (<div></div>);
    }
}

export default DynamicFieldSelectDialog