import React, { useState, useEffect } from "react";
import "./LandingPages.css";
import netalogo from "../../assets/images/Neta-Logo.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../config";

const LandingPage = () => {
    const [showNavbar, setShowNavbar] = useState(false);
    const [activeSlide, setActiveSlide] = useState(1);
    const [query, setQuery] = useState("");
    const [placeholder, setPlaceholder] = useState('');

    const [showLimitPopup, setShowLimitPopup] = useState(false);
    const navigate = useNavigate();
    // Sample slides data - replace with your actual content
    const slides = [
        {
            question: "What wire gauge should I use for a 20-amp circuit?",
            content: {
                title: "Wire Gauge for 20-Amp Circuits",
                text: "For a 20-amp circuit, you typically need 12 AWG copper wire. This ensures safe current carrying capacity and compliance with NEC standards.",
                list: [
                    "<strong>12 AWG copper wire</strong> for standard 20-amp circuits",
                    "<strong>THWN-2 or THHN</strong> insulation recommended",
                    "<strong>Check voltage drop</strong> for long runs",
                ],
                references: true,
            },
        },
        {
            question: "How do I troubleshoot a GFCI outlet that keeps tripping?",
            content: {
                title: "GFCI Troubleshooting Steps",
                list: [
                    "<strong>Check for moisture:</strong> Ensure outlet area is completely dry",
                    "<strong>Test the reset button:</strong> Press reset firmly and check for proper operation",
                    "<strong>Inspect connected devices:</strong> Unplug all devices and test",
                ],
                references: true,
            },
        },
        {
            question: "What's the proper height for electrical outlets in a kitchen?",
            content: {
                title: "Kitchen Outlet Height Requirements",
                text: "Kitchen outlets must be installed at specific heights to meet NEC requirements and ensure safety.",
                list: [
                    "<strong>Countertop outlets:</strong> 15-20 inches above counter surface",
                    "<strong>Island outlets:</strong> Below countertop level or pop-up style",
                    "<strong>GFCI protection required</strong> for all kitchen outlets",
                ],
                references: true,
            },
        },
        {
            question: "How many outlets can I put on a 15-amp circuit?",
            content: {
                title: "15-Amp Circuit Outlet Calculations",
                text: "The number of outlets depends on the expected load, but NEC provides general guidelines.",
                list: [
                    "<strong>General rule:</strong> Up to 8 outlets for general use",
                    "<strong>Kitchen/bathroom:</strong> Limited outlets due to high-load appliances",
                    "<strong>Calculate actual load:</strong> Consider connected device amperage",
                ],
                references: true,
            },
        },
        {
            question: "What size conduit do I need for multiple 12 AWG wires?",
            content: {
                title: "Conduit Fill Calculations",
                text: "Proper conduit sizing is crucial for wire protection and heat dissipation.",
                list: [
                    "<strong>3 wires (12 AWG):</strong> 1/2 inch conduit minimum",
                    "<strong>6 wires (12 AWG):</strong> 3/4 inch conduit required",
                    "<strong>9+ wires (12 AWG):</strong> 1 inch conduit recommended",
                ],
                references: true,
            },
        },
    ];

    useEffect(() => {
        const fullText = "Ask Anything Electrical...";
        let index = 0;

        const interval = setInterval(() => {
            if (index >= fullText.length) {
                clearInterval(interval);
                return;
            }
            const nextChar = fullText.charAt(index); // Safely get char
            setPlaceholder(prev => prev + nextChar);
            index++;
        }, 100);

        return () => clearInterval(interval);
    }, []);



    // Hero section scroll effect
    useEffect(() => {
        const heroSection = document.getElementById("hero-section");

        const handleScroll = () => {
            const heroBottom = heroSection?.getBoundingClientRect().bottom || 0;
            setShowNavbar(heroBottom <= 0);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Auto-slide functionality
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide((prev) => (prev === 5 ? 1 : prev + 1));
        }, 3000); // 3 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    const handleSlideChange = (index) => {
        setActiveSlide(index);
    };

    const handleNext = () => {
        setActiveSlide((prev) => (prev === 5 ? 1 : prev + 1));
    };

    const handlePrevious = () => {
        setActiveSlide((prev) => (prev === 1 ? 5 : prev - 1));
    };

    // const handleQuerySubmit = (e) => {
    //     e.preventDefault();

    //     if (!query.trim()) return;
    //     const ip = localStorage.getItem('ip');
    //     const response = axios.post(`${BASE_URL}/check-ip`, ip);

    //     if (!response.body.exists && response.body.chat_count <= 3) {
    //         localStorage.setItem("searchQuery", query.trim());
    //         navigate("/chatbot");
    //         setQuery(""); // clear input
    //     } else {
    //         setShowLimitPopup(true);
    //         setQuery(""); // clear input
    //     }

    // };

    const handleQuerySubmit = async (e) => {
        e.preventDefault();

        if (!query.trim()) return;

        const ip = localStorage.getItem('ip');

        try {
            const response = await axios.post(`${BASE_URL}/ip/check-ip`, { ip });

            const { exists, chat_count } = response.data;

            if (exists || (!exists && chat_count <= 3)) {
                localStorage.setItem("searchQuery", query.trim());
                navigate("/chatbot", { state: { chat_count: chat_count } });
            } else {
                setShowLimitPopup(true);
            }

            setQuery(""); // clear input either way
        } catch (error) {
            console.error("Error checking IP:", error);
            // You can also show an error popup or toast here
        }
    };



    return (
        <>
            <nav
                className={`claude-navbar navbar navbar-expand-lg fixed-top transition-navbar ${showNavbar ? "visible" : "invisible"
                    }`}
            >
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    {/* Logo */}
                    <div className="logo-container my-2">
                        <img
                            src={netalogo}
                            alt="NETA Logo"
                            className="img-fluid"
                            style={{ maxWidth: "100px" }}
                        />
                    </div>

                    {/* Toggle button for mobile */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarContent"
                        aria-controls="navbarContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Collapsible content */}
                    <div
                        className="collapse navbar-collapse justify-content-end"
                        id="navbarContent"
                    >
                        <div className="d-flex align-items-center flex-column flex-lg-row claude-nav-links gap-3">
                            <a href="#AskNeta" className="nav-link">
                                Features
                            </a>
                            <a href="#AskNeta-FAQ" className="nav-link">
                                FAQ
                            </a>
                            <Link
                                to="/signup"
                                className="btn claude-btn-started text-white mt-2 mt-lg-0"
                            >
                                Get started Free
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
            {
                showLimitPopup && (
                    <div className="popup-overlay animated-popup">
                        <div className="popup-content">
                            <h2 className="popup-title">🚀 Message Limit Reached</h2>
                            <p className="popup-subtitle">Get started for free and keep asking <strong>NETA</strong> anything!</p>
                            <button
                                className="popup-button"
                                onClick={() => navigate("/login")}
                            >
                                Get Started Free
                            </button>
                        </div>
                    </div>
                )
            }

            <section id="hero-section">
                {/* Hero content */}
                <div className="neta-main-container">
                    <div className="container">
                        <div className="row">
                            {/* Left Column - Hero Content */}
                            <div className="col-lg-6 col-md-12">
                                <div className="neta-hero-section text-center">
                                    <img src={netalogo} alt="logo" style={{ height: "70px" }} />
                                    <h1 className="neta-tagline text-center mt-3">

                                        Your AI Powered
                                        <br />
                                        Electrical Assistant
                                    </h1>
                                    <p className="neta-subtitle media-subtitle-setting text-center ms-5">
                                        Ask any electrical question and get instant answers with NEC
                                        references, troubleshooting, and more.
                                    </p>

                                    {/* Auth Card */}
                                    <div className="neta-auth-card">
                                        {/* <div className="d-flex gap-2">
                                            
                                            <Link to="/chatbot">
                                                <button className="neta-continue-btn ">
                                                    start Chat
                                                </button>
                                            </Link>
                                        </div> */}
                                        <Link to="/signup">
                                            <button className="neta-continue-btn ">
                                                Get started Free
                                            </button>
                                        </Link>
                                        <div className="neta-divider">
                                            <span>OR</span>
                                        </div>
                                        <form>
                                            {/* <input
                                                type="email"
                                                className="form-control neta-email-input"
                                                placeholder="Enter your personal or work email"
                                            /> */}
                                            <Link to="/login">
                                                <button type="button" className="btn neta-continue-btn">
                                                    Login
                                                </button>
                                            </Link>
                                        </form>
                                    </div>
                                    <div className="text-center media-learn-setting">
                                        <a href="#AskNeta">
                                            <button className="btn neta-learn-more">
                                                Learn more <i className="fas fa-chevron-down ms-1" />
                                            </button>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Carousel */}
                            <div className="col-lg-6 col-md-12">
                                <div className="neta-info-section">
                                    {/* Synchronized Carousel - Questions */}
                                    <div className="position-relative media-setting">
                                        <div className="carousel-inner">
                                            {slides.map((slide, index) => (
                                                <div
                                                    key={index}
                                                    className={`carousel-slide ${activeSlide === index + 1 ? "active" : ""
                                                        }`}
                                                    style={{
                                                        opacity: activeSlide === index + 1 ? 1 : 0,
                                                        position:
                                                            activeSlide === index + 1
                                                                ? "relative"
                                                                : "absolute",
                                                        top: activeSlide === index + 1 ? "auto" : 0,
                                                        width: "100%",
                                                        transition: "opacity 0.5s ease-in-out",
                                                    }}
                                                >
                                                    <div className="neta-question-header rounded-3 p-4 bg-light">
                                                        <h3 className="neta-question-title">
                                                            {slide.question}
                                                        </h3>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Carousel controls */}
                                    </div>

                                    {/* Synchronized Content Slider */}
                                    <div className="neta-slider-wrapper media-wrapper-setting mt-4">
                                        <div
                                            className="neta-slider-container position-relative"
                                            style={{ minHeight: "200px" }}
                                        >
                                            {slides.map((slide, index) => (
                                                <div
                                                    key={index}
                                                    className="content-slide bg-white rounded-3 p-3"
                                                    style={{
                                                        opacity: activeSlide === index + 1 ? 1 : 0,
                                                        position:
                                                            activeSlide === index + 1
                                                                ? "relative"
                                                                : "absolute",
                                                        top: activeSlide === index + 1 ? "auto" : 0,
                                                        width: "100%",
                                                        transition: "opacity 0.5s ease-in-out",
                                                    }}
                                                >
                                                    <h4 className="neta-slide-title mb-3">
                                                        {slide.content.title}
                                                    </h4>

                                                    {slide.content.text && (
                                                        <p className="neta-slide-text">
                                                            {slide.content.text}
                                                        </p>
                                                    )}

                                                    {slide.content.list && (
                                                        <ul className="neta-slide-list">
                                                            {slide.content.list.map((item, itemIndex) => (
                                                                <li key={itemIndex} className="">
                                                                    <span
                                                                        dangerouslySetInnerHTML={{ __html: item }}
                                                                    />
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}

                                                    {/* {slide.content.references && (
                                                        <div className="neta-nec-references mt-3">
                                                            <p className="neta-slide-text">
                                                                <strong>NEC References:</strong>{" "}
                                                                <a href="#" className="neta-reference-link text-primary">
                                                                    📘 NEC 210.8
                                                                </a>{" "}
                                                                |{" "}
                                                                <a href="#" className="neta-reference-link text-primary">
                                                                    📘 NEC 210.12
                                                                </a>
                                                            </p>
                                                        </div>
                                                    )} */}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Slider Navigation Dots */}
                                        <div className="neta-slider-nav media-slider-nav-setting mt-3">
                                            <div className="neta-slider-dots d-flex justify-content-center gap-2">
                                                {[1, 2, 3, 4, 5].map((index) => (
                                                    <span
                                                        key={index}
                                                        className={`neta-dot rounded-circle d-inline-block ${activeSlide === index
                                                            ? "bg-primary"
                                                            : "bg-secondary opacity-50"
                                                            }`}
                                                        onClick={() => handleSlideChange(index)}
                                                        style={{
                                                            cursor: "pointer",
                                                            width: "8px",
                                                            height: "8px",
                                                            transition: "all 0.3s ease",
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* <form
                onSubmit={handleQuerySubmit}
                className="input-group mb-3 neta-chat-input-form"
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80%',
                    maxWidth: '400px',
                    zIndex: 9999,
                }}
            >
                <div style={{ position: 'relative', width: '100%' }}>
                    <input
                        type="text"
                        className="form-control neta-email-input"
                        placeholder={placeholder}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            border: '1px solid #032231', // 🟦 Visible border
                            borderRadius: '30px',
                            paddingRight: '50px', // space for icon
                            paddingLeft: '20px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // 🌟 Raised effect
                            height: '45px',
                            backgroundColor: '#fff',
                            transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                        }}
                        onFocus={(e) => {
                            e.target.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.2)';
                            e.target.style.borderColor = '#007bff'; // 🔵 Highlight on focus
                        }}
                        onBlur={(e) => {
                            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                            e.target.style.borderColor = '#032231'; // Reset border color
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            position: 'absolute',
                            right: '5px',
                            top: '37%',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'grey',
                            border: 'none',
                            borderRadius: '50%',
                            width: '35px',
                            height: '35px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            cursor: 'pointer',
                        }}
                    >
                        <i className="fas fa-arrow-up"></i>
                    </button>
                </div>
            </form> */}

            {/* <form
                onSubmit={handleQuerySubmit}
                className="input-group mb-3 neta-chat-input-form"
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80%',
                    maxWidth: '400px',
                    zIndex: 9999,
                    backgroundColor: "lightgrey",
                    padding: '30px',
                    boxShadow: '2px solid grey'
                }}
            >
                <div style={{ position: 'relative', width: '100%', textAlign: 'center' }}>
                    <h2 style={{ color: '#0070f3', fontWeight: 'bold' }}>Try NETA</h2>
                    <p style={{ color: '#333', marginBottom: '20px' }}>
                        Ask any electrical question—no login required.
                    </p>
                </div>
                <div style={{ position: 'relative', width: '100%' }}>
                    <input
                        type="text"
                        className="form-control neta-new-input"
                        placeholder={placeholder}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            border: '2px solid transparent', // Use transparent for initial state
                            borderRadius: '30px',
                            paddingRight: '50px',
                            paddingLeft: '20px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            height: '45px',
                            backgroundColor: '#fff',
                            transition: 'box-shadow 0.3s ease',
                        }}
                        onFocus={(e) => {
                            e.target.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.2)';
                        }}
                        onBlur={(e) => {
                            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            position: 'absolute',
                            right: '5px',
                            top: '47%',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'grey',
                            border: 'none',
                            borderRadius: '50%',
                            width: '35px',
                            height: '35px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            cursor: 'pointer',
                        }}
                    >
                        <i className="fas fa-arrow-up"></i>
                    </button>
                </div>
            </form> */}

            <form
                onSubmit={handleQuerySubmit}
                className="input-group mb-3 neta-chat-input-form"
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80%',
                    maxWidth: '400px',
                    zIndex: 9999,
                    backgroundColor: '#E7E7E7FF',
                    padding: '30px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
                    textAlign: 'center',
                }}
            >
                <div style={{ position: 'relative', width: '100%', textAlign: 'center' }}>
                    <h2 style={{ color: '#0070f3', fontWeight: 'bold', marginBottom: '10px' }}>Try NETA</h2>
                    <p style={{ color: '#333', marginBottom: '20px' }}>
                        Ask any electrical question—no login required.
                    </p>
                </div>

                <div style={{ position: 'relative', width: '100%' }}>
                    <input
                        type="text"
                        className="form-control neta-new-input"
                        placeholder={placeholder}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            border: '2px solid transparent',
                            borderRadius: '30px',
                            paddingRight: '50px',
                            paddingLeft: '20px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            height: '45px',
                            backgroundColor: '#fff',
                            transition: 'box-shadow 0.3s ease',
                            width: '100%',
                        }}
                        onFocus={(e) => {
                            e.target.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.2)';
                        }}
                        onBlur={(e) => {
                            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            position: 'absolute',
                            right: '5px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: 'grey',
                            border: 'none',
                            borderRadius: '50%',
                            width: '35px',
                            height: '35px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            cursor: 'pointer',
                        }}
                    >
                        <i className="fas fa-arrow-up"></i>
                    </button>
                </div>
            </form>


            <div className="container py-5" id="AskNeta">
                <div className="text-center mb-4">
                    <h1 className="ask-neta-header">Ask Neta</h1>
                    <p className="neta-subheader">
                        The AI Assistant for Electricians – Find NEC Codes in Seconds! Fast
                        Solutions with Our Chatbot!
                    </p>
                </div>
                <div className="row">
                    <div className="col-lg-6 col-md-12 mb-4 mb-lg-0 mt-5">
                        <div className="neta-box mx-auto" style={{ height: "350px" }}>
                            <video
                                className="w-100 h-100"
                                src="https://ik.imagekit.io/8x6rwnonn/Untitled%20video%20-%20Made%20with%20Clipchamp%20(2).mp4?updatedAt=1748007340744"
                                autoPlay
                                muted
                                loop
                                style={{ objectFit: "cover", borderRadius: "8px" }}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        {/* Second box content */}
                        <div className="col-md-12">
                            <div className="faq-container-custom">
                                <div
                                    className="accordion accordion-custom"
                                    id="faqAccordionFeatures"
                                >
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="headingFeatureOne">
                                            <button
                                                className="accordion-button collapsed"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseFeatureOne"
                                                aria-expanded="false"
                                                aria-controls="collapseFeatureOne"
                                            >
                                                Create with AskNeta
                                            </button>
                                        </h2>
                                        <div
                                            id="collapseFeatureOne"
                                            className="accordion-collapse collapse"
                                            aria-labelledby="headingFeatureOne"
                                            data-bs-parent="#faqAccordionFeatures"
                                        >
                                            <div className="accordion-body">
                                                Ask NETA anything about electrical work, inspections, or
                                                troubleshooting. Get instant, accurate answers
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="headingFeatureTwo">
                                            <button
                                                className="accordion-button collapsed"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseFeatureTwo"
                                                aria-expanded="false"
                                                aria-controls="collapseFeatureTwo"
                                            >
                                                Transform Images into Intelligence
                                            </button>
                                        </h2>
                                        <div
                                            id="collapseFeatureTwo"
                                            className="accordion-collapse collapse"
                                            aria-labelledby="headingFeatureTwo"
                                            data-bs-parent="#faqAccordionFeatures"
                                        >
                                            <div className="accordion-body">
                                                Turn images into insights. AskNeta.AI uses advanced
                                                vision models to detect, analyze, and classify image
                                                data instantly — perfect for automation and AI
                                                diagnostics.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="headingFeatureThree">
                                            <button
                                                className="accordion-button collapsed"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseFeatureThree"
                                                aria-expanded="false"
                                                aria-controls="collapseFeatureThree"
                                            >
                                                Real-Time Intelligence with Machine Learning
                                            </button>
                                        </h2>
                                        <div
                                            id="collapseFeatureThree"
                                            className="accordion-collapse collapse"
                                            aria-labelledby="headingFeatureThree"
                                            data-bs-parent="#faqAccordionFeatures"
                                        >
                                            <div className="accordion-body">
                                                Powerful ML models adapt to your data in real-time,
                                                allowing smart predictions, trends analysis, and dynamic
                                                suggestions without manual intervention.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="headingFeatureFour">
                                            <button
                                                className="accordion-button collapsed"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseFeatureFour"
                                                aria-expanded="false"
                                                aria-controls="collapseFeatureFour"
                                            >
                                                Converse Naturally with AskNeta
                                            </button>
                                        </h2>
                                        <div
                                            id="collapseFeatureFour"
                                            className="accordion-collapse collapse"
                                            aria-labelledby="headingFeatureFour"
                                            data-bs-parent="#faqAccordionFeatures"
                                        >
                                            <div className="accordion-body">
                                                Talk to AskNeta. Our smart voice interface understands
                                                natural speech, transcribes accurately, and executes
                                                commands — making interaction seamless.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="headingFeatureFive">
                                            <button
                                                className="accordion-button collapsed"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseFeatureFive"
                                                aria-expanded="false"
                                                aria-controls="collapseFeatureFive"
                                            >
                                                Deploy Smart Chatbots Instantly
                                            </button>
                                        </h2>
                                        <div
                                            id="collapseFeatureFive"
                                            className="accordion-collapse collapse"
                                            aria-labelledby="headingFeatureFive"
                                            data-bs-parent="#faqAccordionFeatures"
                                        >
                                            <div className="accordion-body">
                                                Launch intelligent, human-like chatbots in seconds.
                                                Train them on your data and scale your support or
                                                engagement channels effortlessly.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="faq-container-custom" id="AskNeta-FAQ">
                <div className="container">
                    <h2 className="faq-title-custom">Frequently asked questions</h2>
                    <div className="accordion accordion-custom" id="faqAccordionMain">
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingMainOne">
                                <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseMainOne"
                                    aria-expanded="false"
                                    aria-controls="collapseMainOne"
                                >
                                    What is the AI Assistant for Electricians?
                                </button>
                            </h2>
                            <div
                                id="collapseMainOne"
                                className="accordion-collapse collapse"
                                aria-labelledby="headingMainOne"
                                data-bs-parent="#faqAccordionMain"
                            >
                                <div className="accordion-body">
                                    Our AI assistant is a chatbot designed to help electricians
                                    quickly find relevant NEC (National Electrical Code)
                                    standards, troubleshooting steps, and wiring guidelines.
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingMainTwo">
                                <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseMainTwo"
                                    aria-expanded="false"
                                    aria-controls="collapseMainTwo"
                                >
                                    How does the chatbot find NEC codes so quickly?
                                </button>
                            </h2>
                            <div
                                id="collapseMainTwo"
                                className="accordion-collapse collapse"
                                aria-labelledby="headingMainTwo"
                                data-bs-parent="#faqAccordionMain"
                            >
                                <div className="accordion-body">
                                    It uses advanced natural language processing and a built-in
                                    NEC database to instantly interpret your questions and
                                    retrieve the relevant code section or guidance.
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingMainThree">
                                <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseMainThree"
                                    aria-expanded="false"
                                    aria-controls="collapseMainThree"
                                >
                                    Is the chatbot up to date with the latest NEC editions?
                                </button>
                            </h2>
                            <div
                                id="collapseMainThree"
                                className="accordion-collapse collapse"
                                aria-labelledby="headingMainThree"
                                data-bs-parent="#faqAccordionMain"
                            >
                                <div className="accordion-body">
                                    Yes! Our system is updated regularly to ensure it reflects the
                                    most current NEC guidelines, including any recent revisions or
                                    additions.
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingMainFour">
                                <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseMainFour"
                                    aria-expanded="false"
                                    aria-controls="collapseMainFour"
                                >
                                    Can the assistant help with local code variations?
                                </button>
                            </h2>
                            <div
                                id="collapseMainFour"
                                className="accordion-collapse collapse"
                                aria-labelledby="headingMainFour"
                                data-bs-parent="#faqAccordionMain"
                            >
                                <div className="accordion-body">
                                    While the AI focuses primarily on the NEC, it can also provide
                                    general insights into local code practices. However, we
                                    recommend verifying with your local authority for
                                    region-specific rules.
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingMainFive">
                                <button
                                    className="accordion-button collapsed"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#collapseMainFive"
                                    aria-expanded="false"
                                    aria-controls="collapseMainFive"
                                >
                                    Is this tool suitable for apprentices or only licensed
                                    electricians?
                                </button>
                            </h2>
                            <div
                                id="collapseMainFive"
                                className="accordion-collapse collapse"
                                aria-labelledby="headingMainFive"
                                data-bs-parent="#faqAccordionMain"
                            >
                                <div className="accordion-body">
                                    It's useful for both! Apprentices can use it to study and
                                    understand code references, while professionals save time
                                    during jobs by quickly referencing specific rules.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <footer style={{ backgroundColor: "#112a57", padding: "20px 0", borderTop: "1px solid #ccc" }}>
                <div style={{ textAlign: "center", fontSize: "14px", color: "#2b2b2b" }}>
                    <div style={{ marginBottom: "5px" }}>
                        <Link to="/website/terms" style={{ marginRight: "15px", textDecoration: "none", color: "#fff", fontWeight: "500" }}>
                            Terms Of Use
                        </Link>
                        <a href="/website/privacy" style={{ textDecoration: "none", color: "#fff", fontWeight: "500" }}>
                            Privacy Policy
                        </a>
                    </div>
                    <div style={{ color: "#fff" }}>
                        Copyright © 2025 - All rights reserved by <span style={{ fontWeight: "500" }}>NETA</span>
                    </div>
                </div>
            </footer>

        </>
    );
};

export default LandingPage;
