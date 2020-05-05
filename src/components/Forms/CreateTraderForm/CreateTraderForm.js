import React, {Component} from 'react';
import './CreateTraderForm.sass';
import {Box, TextField, Select, MenuItem, FormControl} from '@material-ui/core';
import axios from 'axios';
import {GET_CREATE_COPY_TRADER_URL} from '../../../api';
import {connect} from 'react-redux';
import {getExchangeList, alertError, alertSuccess, getQuotesList} from '../../../actions';

class CreateTraderForm extends Component{
    constructor(props){
        super(props)
        this.state = {
            name: "",
            exchange: "default",
            quote: "default",
            exchangeType: "default",
            minAllocatedBalance: "",
            exchangeTypeList: []
        }
    }

    componentDidMount = () => {
        this.props.dispatch(getExchangeList(this.props.token))
        this.props.dispatch(getQuotesList(this.props.token))
    }

    handleExchange = (e) => {
        let data = this.props.settings.exchangeList.find(item => item.name === e.target.value)
        this.setState({exchange: e.target.value, exchangeType: "default", exchangeTypeList: data.type ? data.type : []})
    }

    handleSubmit = () => {
        let params = {
            name: this.state.name,
            quote: this.state.quote,
            exchangeType: this.state.exchangeType,
            exchange: this.state.exchange,
            minAllocatedBalance: this.state.minAllocatedBalance,
            token: this.props.token
        }
        axios.post(GET_CREATE_COPY_TRADER_URL, params)
            .then((resp) => {
                this.props.dispatch(alertSuccess("Trade created successfully"))
                this.props.onClose()
            })
            .catch((error) => {
                this.props.dispatch(alertError("There was an error creating trade"))
            })
    }

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.handleSubmit()
        }
    }

    disabledButton = () => {
        if(this.state.name && this.state.minAllocatedBalance){
            if(this.state.quote && this.state.quote !== "default" && this.state.exchange && this.state.exchange !== "default"){
                if(this.state.exchangeType && this.state.exchangeType !== "default"){
                    return false
                }
                return true
            }
            return true
        }
        return true
    }

    render(){
        return(
            <Box className={"create-trader-form " + (this.props.darkStyle ? "dark" : "")} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                <span className="title">Create a Copy Trading Account</span>
                <span className="tagline">Offer your services as an expert trader user to be copied by our users</span>
                <Box className="form" display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-between" alignItems="center">
                    <Box className="input-box" display="flex" flexDirection="column" justifyContent="start" alignItems="start">
                        <label className="custom-label">Name</label>
                        <TextField
                            className="custom-input"
                            type="text"
                            placeholder="enter the name your trader"
                            fullWidth
                            variant="outlined"
                            value={this.state.name}
                            onChange={(e) => this.setState({name: e.target.value})}
                            onKeyDown={this.handleKeyPress}
                            />
                    </Box>
                    <Box className="input-box" display="flex" flexDirection="column" justifyContent="start" alignItems="start">
                        <label className="custom-label">Minimum Allocated Balance</label>
                        <TextField
                            className="custom-input"
                            type="text"
                            placeholder="specify min allocated balance"
                            fullWidth
                            variant="outlined"
                            value={this.state.minAllocatedBalance}
                            onChange={(e) => this.setState({minAllocatedBalance: e.target.value})}
                            onKeyDown={this.handleKeyPress}
                            />
                    </Box>
                    <Box className="select-box">
                        <label className="custom-label">Quote</label>
                        <FormControl variant="outlined" className="select-input">
                            <Select value={this.state.quote} onChange={(e) => this.setState({quote: e.target.value})}>
                                <MenuItem key={"choose"} value={"default"}> {"Choose Quote"} </MenuItem>
                                {this.props.quotesList && Object.values(this.props.quotesList).map((item, index) =>
                                    <MenuItem key={index} value={item.quote}> {item.quote} </MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box className="select-box">
                        <label className="custom-label">Exchange</label>
                        <FormControl variant="outlined" className="select-input">
                            <Select value={this.state.exchange} onChange={this.handleExchange}>
                                <MenuItem key={"choose"} value={"default"}> {"Choose Exchange"} </MenuItem>
                                {this.props.settings && this.props.settings.exchangeList && this.props.settings.exchangeList.map((item, index) =>
                                  item.enabled && <MenuItem key={index} value={item.name}> {item.name} </MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box className="select-box">
                        <label className="custom-label">Exchange Type</label>
                        <FormControl variant="outlined" className="select-input">
                            <Select value={this.state.exchangeType} onChange={(e) => this.setState({exchangeType: e.target.value})}>
                                <MenuItem key={"choose"} value={"default"}> {"Choose Exchange Type"} </MenuItem>
                                {this.state.exchangeTypeList.map((item, index) =>
                                    <MenuItem key={index} value={item}> {item} </MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                <Box className="button-box">
                    <button
                        type="button"
                        className={"btn btn-primary " + (this.disabledButton() ? "disabled-btn" : "")}
                        disabled={this.disabledButton()}
                        onClick= {this.handleSubmit}>Create Copy Trading</button>
                </Box>
            </Box>
        )
    }
}

function mapStateToProps (state) {
    return {
        token: state.user.token,
        settings: state.settings,
        quotesList: state.quotesList,
        darkStyle: state.darkStyle,
    }
}

export default connect(mapStateToProps)(CreateTraderForm);