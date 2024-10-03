import React, { useEffect, useState, useRef } from 'react';

const Footer = () => {

    return (
        <>
            <footer className='footer-section overflow-hidden'>
                <img src="assets/images/clouds-img.svg" className='hero-dec-img' alt="" />
                <img src="assets/images/footer-bg.svg" className='footer-bg-img' data-aos="fade-up" alt="" />
                <div className="container-md">
                    <div className="row">
                        <div className="col-12 col-md-6 offset-md-6 my-auto">
                            <a href="#" className='footer-logo-link'>
                                <img src="assets/images/logo.png" alt="" />
                            </a>
                            <p className='footer-para'>
                                Thank you for visiting Go Green. Together, we can make a significant impact on our planet’s health and well-being. Stay connected with us for the latest updates on our projects, events, and ways you can contribute to a more sustainable future. Follow us on social media and join our community in taking actionable steps towards a greener world. Every effort counts, and your support makes all the difference. Let's work together to ensure a thriving planet for generations to come.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer;