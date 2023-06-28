import React from 'react';
import '../../css/cards.css'
import image1 from '../../assets/images/project/1.png';
import image2 from '../../assets/images/project/2.png';
import image3 from '../../assets/images/project/3.png';
import image4 from '../../assets/images/project/4.png';


const OurFaculties = () => {
    return (
        <div>
            <h2>Latest News</h2>
            <div className="card-container">
                <div className="card">
                    <img src={image1} className="card-img-top" alt="..."/>
                    <div className="card-body">
                        <p className="card-text">“In my class, doing ‘wrong’ is right,” said Tan, lead instructor of the course Brand Image Strategy & Design. Cultivating students’ innovative spirit is a critical part of this course, which has been recognized university-wide as an exceptional course from 2016 to 2022 and has received both national and international recognition. </p>
                    </div>
                </div>

                <div className="card">
                    <img src={image2} className="card-img-top" alt="..."/>
                    <div className="card-body">
                        <p className="card-text">Forum on addressing the climate & energy challenge to be held.
                            With a view to focusing on solutions to common challenges faced by mankind, forum will be held from October to November 2023 on a hybrid format. The theme of this year's forum is "Addressing the Climate and Energy Challenge".
                        </p>
                    </div>
                </div>

                <div className="card">
                    <img src={image3} className="card-img-top" alt="..."/>
                    <div className="card-body">
                        <p className="card-text">Researchers have discovered a new approach to folding double-strand DNA (dsDNA) with triplex elements that shows promises in DNA conformational modulation and its regulatory function. In the study, rational engineering of triplex-forming oligos (TFO) lead to the folding of dsDNA into higher-order nanostructures with designer geometric features.</p>
                    </div>
                </div>

                <div className="card">
                    <img src={image4} className="card-img-top" alt="..."/>
                    <div className="card-body">
                        <p className="card-text">We recently held the "South Gate Photo Studio" event on the special occasion of the "World Smile Day" as part of the University’s "Global Engagement Year" celebration.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OurFaculties;