import React, { useEffect, useState, useRef } from 'react';
import AOS from 'aos';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 50;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: "ease-in-out",
            once: true,
            mirror: false
        });
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <>
            <header>
                <nav className={`nav-section ${scrolled ? 'scrolled' : ''}`}>
                    <div className="container-md">
                        <div className="row">
                            <div className="col-12">
                                <div className="nav-container">
                                    <a href="/" className='nav-logo-link'>
                                        <img src="assets/images/logo.png" className='nav-logo' alt="Logo" />
                                        <img src="assets/images/logo-light.png" className='scrolled-logo' alt="Logo" />
                                    </a>
                                    <ul className="nav-link-area">
                                        <li className='nav-link-item'>
                                            <a href="#about-us" className="nav-link">
                                                About
                                            </a>
                                        </li>

                                        <li className='nav-link-item'>
                                            <a href="#contribute" className="nav-link">
                                                Contribute
                                            </a>
                                        </li>

                                        <li className='nav-link-item'>
                                            <a href="#contact" className="nav-link">
                                                Contact
                                            </a>
                                        </li>
                                    </ul>

                                    <ul className='nav-button-grp'>
                                        <li className='nav-button-grp-item'>
                                            <a href="#sign-up" className='nav-link-button with-outline text-uppercase letter-spaced'>Sign up</a>
                                        </li>
                                        <li className='nav-button-grp-item'>
                                            <a href="#sign-in" className='nav-link-button with-bg text-uppercase letter-spaced'>Sign in</a>
                                        </li>
                                    </ul>

                                    <ul className='menu-toggle-btn-area'>
                                        <li className='nav-button-grp-item'>
                                            <button className='menu-toggle-button' onClick={toggleMenu}>
                                                <i class="bi bi-list"></i>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

            </header>
        </>
    )
}

export default Header;