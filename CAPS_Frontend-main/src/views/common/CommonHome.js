import React from 'react'

import {
    CCard,
    CCardBody, CCardHeader,
    CCarousel, CCarouselItem,
    CImage,
} from '@coreui/react'

import * as PropTypes from "prop-types";

CCarousel.propTypes = {
    controls: PropTypes.bool,
    indicators: PropTypes.bool,
    children: PropTypes.node
};

const CommonHome = () => {
    return (
        <>
            <CCard className="mb-4">
                <CCardBody>
                    <CCardHeader>
                        <h3 style={{marginTop: 10 + 'px'}}>Welcome to CAPS</h3>
                    </CCardHeader>
                    <CCardBody>
                        <p>
                            Course Application Processing Systems (CAPS for short) is used by academic institutions to
                            cover business processes such as student course applications, grading and course list
                            development. Currently these are completed manually by course administrators and
                            lecturers, which may cause overheads on resources, time and cost
                        </p>
                        <CCarousel controls indicators>
                            <CCarouselItem>
                                <CImage className="d-block w-100"
                                        src="https://cdn.pixabay.com/photo/2016/03/09/09/43/bag-1245954_1280.jpg"
                                        alt="slide 1"/>
                            </CCarouselItem>
                            <CCarouselItem>
                                <CImage className="d-block w-100"
                                        src="https://cdn.pixabay.com/photo/2016/11/27/21/42/stock-1863880_1280.jpg"
                                        alt="slide 2"/>
                            </CCarouselItem>
                            <CCarouselItem>
                                <CImage className="d-block w-100"
                                        src="https://cdn.pixabay.com/photo/2018/03/10/12/00/teamwork-3213924_1280.jpg"
                                        alt="slide 3"/>
                            </CCarouselItem>
                        </CCarousel>
                    </CCardBody>
                </CCardBody>
            </CCard>
        </>
    )
}

export default CommonHome
