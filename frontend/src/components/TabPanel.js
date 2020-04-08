import React from 'react'
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

function TabPanel (props){
    const {children, value, index, tab, boxClass, ...other} = props;
    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`${tab}-tabpanel`}
            aria-labelledby={`${tab}-tab`}
            {...other}
        >
            {value === index && <Box className={boxClass} p={3}>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

export default TabPanel