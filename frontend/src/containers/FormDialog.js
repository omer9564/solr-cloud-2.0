import React from 'react'
import Button from '@material-ui/core/Button'
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import Dialog from "@material-ui/core/Dialog/Dialog";

class FormDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        }
    }

    componentDidMount()
    {
        console.log(this.ref)
    }

    handleClickOpen = () => {
        this.setState({isOpen: true});
    };

    handleClose = () => {
        this.setState({isOpen: false});
    };

    handleSubmit = () => {
        this.handleClose();
        this.ref.onSubmit();
    };



    render() {
        const {buttonTitle, dialogContent} = this.props;
        const childElement = React.Children.only(this.props.children);
        return (
            <div style={{display: "flex", justifyContent: "center"}}>
                <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
                    {buttonTitle}
                </Button>
                <Dialog open={this.state.isOpen} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">{buttonTitle} Form</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {dialogContent}
                        </DialogContentText>
                        {React.cloneElement(childElement, {ref: el => this.ref = el})}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleSubmit} color="primary">
                            Submit
                        </Button>
                    </DialogActions>

                </Dialog>
            </div>
        )
    }
}

//     const [open, setOpen] = React.useState(false);
//     const {children, buttonTitle, dialogContent} = props;
//     const childElement = React.Children.only(props.children)
//     let childRef = null;
//
//     const handleClickOpen = () => {
//         setOpen(true);
//     };
//
//     const handleClose = () => {
//         setOpen(false);
//     };
//
//     const handleSubmit = () => {
//         debugger
//         childRef.onSubmit();
//         handleClose()
//     };
//
//     return (
//         <div style={{display: "flex", justifyContent: "center"}}>
//             <Button variant="outlined" color="primary" onClick={handleClickOpen}>
//                 {buttonTitle}
//             </Button>
//             <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
//                 <DialogTitle id="form-dialog-title">{buttonTitle} Form</DialogTitle>
//                 <DialogContent>
//                     <DialogContentText>
//                         {dialogContent}
//                     </DialogContentText>
//                     {React.cloneElement(childElement, {ref: el => childRef = el})}
//                     {/*{children}*/}
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleClose} color="primary">
//                         Cancel
//                     </Button>
//                     <Button onClick={handleSubmit} color="primary">
//                         Submit
//                     </Button>
//                 </DialogActions>
//
//             </Dialog>
//         </div>
//     );
// }

export default FormDialog


//
// import React from 'react'
// import Button from '@material-ui/core/Button'
// import TextField from '@material-ui/core/TextField'
// import DialogActions from "@material-ui/core/DialogActions/DialogActions";
// import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
// import DialogContent from "@material-ui/core/DialogContent/DialogContent";
// import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
// import Dialog from "@material-ui/core/Dialog/Dialog";
//
// function FormDialog(props) {
//     const [open, setOpen] = React.useState(false);
//     const {children, buttonTitle, dialogContent} = props;
//     const childElement = React.Children.only(props.children)
//     let childRef = null;
//
//     const handleClickOpen = () => {
//         setOpen(true);
//     };
//
//     const handleClose = () => {
//         setOpen(false);
//     };
//
//     const handleSubmit = () => {
//         debugger
//         childRef.onSubmit();
//         handleClose()
//     };
//
//     return (
//         <div style={{display: "flex", justifyContent: "center"}}>
//             <Button variant="outlined" color="primary" onClick={handleClickOpen}>
//                 {buttonTitle}
//             </Button>
//             <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
//                 <DialogTitle id="form-dialog-title">{buttonTitle} Form</DialogTitle>
//                 <DialogContent>
//                     <DialogContentText>
//                         {dialogContent}
//                     </DialogContentText>
//                     {React.cloneElement(childElement, {ref: el => childRef = el})}
//                     {/*{children}*/}
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleClose} color="primary">
//                         Cancel
//                     </Button>
//                     <Button onClick={handleSubmit} color="primary">
//                         Submit
//                     </Button>
//                 </DialogActions>
//
//             </Dialog>
//         </div>
//     );
// }
//
// export default FormDialog