import React from 'react'
import Checkbox from "@material-ui/core/Checkbox";

function SolrInfoActionBar(props) {
    const {isLoadingStatusComponent,isChecked,checkAll} = props;
    return (
        <div>
            {isLoadingStatusComponent()}
            <Checkbox
                key={`CheckAllShards`}
                edge="start"
                color="primary"
                checked={isChecked}
                onClick={checkAll}
                tabIndex={-1}
                disableRipple
            />
        </div>
    );
}

export default SolrInfoActionBar