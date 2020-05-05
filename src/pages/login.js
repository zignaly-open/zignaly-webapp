import React, { useState, useEffect } from 'react';
// import Helmet from 'react-helmet';
import { Box, Tab, Tabs } from '@material-ui/core';
import '../styles/LoginPage.sass';
import Testimonial from '../components/Testimonial';
import CustomButton from '../components/CustomButton';
import testominalFeed from '../helpers/testimonialFeed.json';
import LoginForm from '../components/Forms/LoginForm';
import SignupForm from '../components/Forms/SignupForm'
import TwoFAForm from '../components/Forms/TwoFAForm';
import Modal from '../components/Modal';

const LoginPage = () => {
    const [tabValue, setTabValue] = useState(0)
    const [data, setData] = useState([])
    const [pageSize, setPageSize] = useState(0)

    useEffect(() => {
        const feedData = (size) => {
            let arr = []
            for(let a=0; a<size; a++){
              arr.push(testominalFeed[a])
            }
            setData(arr)
        }

        feedData(pageSize)
    }, [pageSize])

    const loadMoreData = () => {
        let size = (this.state.pageSize + 6) > testominalFeed.length ? testominalFeed.length : (this.state.pageSize + 6)
        setPageSize(size)
    };

    changeTab = (event, newValue) => {
        setTabValue(newValue)
    };

    return(
        <Box className="loginPage">
            <Modal state={show2FA} persist={true}>
                <TwoFAForm />
            </Modal>
            <Box className="login-header" display="flex" flexDirection="row" justifyContent="space-around">
                <Box className="header-image"></Box>
                <Box className="tagline-box" display="flex" flexDirection="column" justifyContent="start" alignItems="start">
                    {/* <img className="logo" src={Logo} alt="Zignaly" /> */}
                    <span className="tagline">What could a pro trader do with your crypto?</span>
                    <span className="slogan"><b>Copy pro traders </b>and earn same profits as they do. </span>
                </Box>
                <Box className="tabs-box">
                    <Tabs value={tabValue} onChange={changeTab} classes={{indicator: 'indicator', flexContainer: 'container'}} className="tabs-menu">
                    <Tab label="Sign in" classes={{selected: 'selected'}} />
                    <Tab label="Register" classes={{selected: 'selected'}} />
                    </Tabs>
                    {tabValue === 0 &&
                        <Box className="section">
                            <LoginForm />
                        </Box>
                    }
                    {tabValue === 1 &&
                        <Box className="section">
                            <SignupForm />
                        </Box>
                    }
                </Box>
            </Box>
            <Box className="testimonials">
                <span className="title">Testimonials</span>
                <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-between">
                    {this.state.data.map((item) =>
                        <Testimonial key={item.id} data={item} />
                    )}
                </Box>
                <Box display="flex" flexDirection="row" justifyContent="center">
                    <CustomButton disabled={pageSize === testominalFeed.length} className="load-more-btn" onClick={loadMoreData}>Load More</CustomButton>
                </Box>
            </Box>
        </Box>
    )
}

export default LoginPage;