import React from 'react'
import config from "../../Config"
import TimeFieldSelect from "./TimeFieldSelect";
import GenericFieldSelect from "./GenericFieldSelect";
import ShardFieldSelect from "./ShardFieldSelect";

function DynamicFieldSelectDialog(props) {
    const {type, field, rangeOptions, rangeOption, startRange, endRange, onChangeField, onChangeRangeOption, onChangeRangePicker} = props;
    switch (type) {
        case "GenericField":
            return (
                <GenericFieldSelect type={type} defaultValue={field} rangeOptions={rangeOptions}
                                    rangeOption={rangeOption}
                                    textPropName="Field" startRange={startRange} endRange={endRange}
                                    onChangeField={onChangeField}
                                    onChangeRangeOption={onChangeRangeOption}
                                    onChangeRangePicker={onChangeRangePicker}/>);
        case "TimeField":
            return (
                <TimeFieldSelect type={type} defaultValue={field} rangeOptions={rangeOptions} rangeOption={rangeOption}
                                 textPropName="Field" startRange={startRange} endRange={endRange}
                                 onChangeField={onChangeField}
                                 onChangeRangeOption={onChangeRangeOption}
                                 onChangeRangePicker={onChangeRangePicker}/>);
        case "Shards":
            return (<ShardFieldSelect type={type} rangeOptions={rangeOptions} rangeOption={rangeOption}
                                      startRange={startRange} endRange={endRange}
                                      onChangeRangeOption={onChangeRangeOption}
                                      onChangeRangePicker={onChangeRangePicker}/>);
        default:
            return (
                <div></div>
            );
    }
}

export default DynamicFieldSelectDialog