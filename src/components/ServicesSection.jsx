import React from 'react';
import './ServicesSection.css'; // Import the updated CSS file

// Import images
import websiteDevelopmentImg from '../assets/03-small.jpg';
import logoDesignImg from '../assets/06-small.jpg';
import seoImg from '../assets/03-small.jpg';
import architectureInteriorDesignImg from '../assets/09-small.jpg';
import socialMediaMarketingImg from '../assets/06-small.jpg';
import voiceOverImg from '../assets/03-small.jpg';

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
      img: architectureInteriorDesignImg,
      title: 'Architecture & Interior Design',
      description: 'Design and plan architectural and interior spaces.',
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
  ];

  return (
    <div className="services-container" id="services">
      <h2 className="services-title">Our Services</h2>
      <div className="services-grid">
        {services.map((service, index) => (
          <div key={index} className="service-card">
            <div className="service-image">
              <img src={service.img} alt={service.title} />
            </div>
            <h3 className="service-title">{service.title}</h3>
            <p className="service-description">{service.description}</p>
            <button className="service-btn">
              <span className="text-container">
                <span className="text">Learn More</span>
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesSection;
