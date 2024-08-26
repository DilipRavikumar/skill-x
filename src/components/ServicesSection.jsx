import React, { useState } from 'react';
import './ServicesSection.css'; // Import the updated CSS file

// Import images
import websiteDevelopmentImg from '../assets/web.gif';
import logoDesignImg from '../assets/logo.gif';
import seoImg from '../assets/SEO.gif';
import socialMediaMarketingImg from '../assets/Social.gif';
import voiceOverImg from '../assets/Voicet.gif';
import softwareDevelopmentImg from '../assets/Software.gif'; // Add new image paths
import dataScienceImg from '../assets/Data.gif';
import uiUxDesignImg from '../assets/UI-UX design.gif'; // New image path
import eCommerceMarketingImg from '../assets/Ecommerce.gif';
import videoEditingImg from '../assets/video.gif';

const ServicesSection = () => {
  const services = [
    {
      img: websiteDevelopmentImg,
      title: 'Website Development',
      description: 'Develop and design fully functional websites tailored to your needs.',
    },
    {
      img: logoDesignImg,
      title: 'Logo Design',
      description: 'Create unique and professional logos to represent your brand.',
    },
    {
      img: seoImg,
      title: 'SEO',
      description: 'Optimize your website to improve its search engine ranking.',
    },
    {
      img: socialMediaMarketingImg,
      title: 'Social Media Marketing',
      description: 'Enhance your brand’s presence and engagement on social media.',
    },
    {
      img: voiceOverImg,
      title: 'Voice Over',
      description: 'Professional voice-over services for various media needs.',
    },
    {
      img: softwareDevelopmentImg,
      title: 'Software Development',
      description: 'Build custom software solutions tailored to your business needs.',
    },
    {
      img: dataScienceImg,
      title: 'Data Science & ML',
      description: 'Utilize data science and machine learning to drive business insights.',
    },
    {
      img: uiUxDesignImg,
      title: 'UI/UX Design',
      description: 'Design intuitive and user-friendly interfaces and experiences.',
    },
    {
      img: eCommerceMarketingImg,
      title: 'E-Commerce Marketing',
      description: 'Enhance your online store’s visibility and sales through effective marketing strategies.',
    },
    {
      img: videoEditingImg,
      title: 'Video Editing',
      description: 'Edit and produce professional-quality videos for your brand or business.',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex + 5 < services.length) {
      setCurrentIndex(currentIndex + 5);
    }
  };

  const handlePrev = () => {
    if (currentIndex - 5 >= 0) {
      setCurrentIndex(currentIndex - 5);
    }
  };

  return (
    <div className="services-container" id="services">
      <h2 className="services-title">Popular Services</h2>
      <div className="services-wrapper">
        <button className="nav-button prev" onClick={handlePrev} disabled={currentIndex === 0}>
          &lt;
        </button>
        <div className="services-grid">
          {services.slice(currentIndex, currentIndex + 5).map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-image">
                <img src={service.img} alt={service.title} />
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
            </div>
          ))}
        </div>
        <button className="nav-button next" onClick={handleNext} disabled={currentIndex + 5 >= services.length}>
          &gt;
        </button>
      </div>
    </div>
  );
};

export default ServicesSection;
