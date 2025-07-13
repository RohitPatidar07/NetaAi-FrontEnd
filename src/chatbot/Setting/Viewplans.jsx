 import React, { useEffect, useState } from 'react';
import netalogo from '../../assets/images/Neta-Logo.png';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import BASE_URL from '../../../config';
import './Setting.css';

const PricingPlans = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch(`${BASE_URL}/plan/subscription-plans`);
      const data = await response.json();

      // Filter plans with id 5, 6, and 7
      const filteredPlans = data.filter(plan => [5, 6, 7].includes(plan.id));

      // Sort the filtered plans by id in ascending order
      const sortedPlans = filteredPlans.sort((a, b) => a.id - b.id);
      
      setPlans(sortedPlans);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="container py-1 text-center position-relative">
      {/* Back Button - Top Left */}
      <button
        onClick={handleBack}
        className="btn btn-link position-absolute top-0 start-0 m-3"
        style={{ zIndex: 1 }}
      >
        <FaArrowLeft className="fs-4" />
      </button>

      {/* Logo Area */}
      <div className="logo-container my-5">
        <img src={netalogo} alt="NETA Logo" className="img-fluid" style={{ maxWidth: '200px' }} />
      </div>

      <h2 className="fw-bold mb-4">Get Started With NETA AI Today</h2>
      <h6>NETA is <span className='text-primary'>free for life</span> with limited chats per month. Unlock more power with our affordable plans.</h6>

      {/* Cards Section */}
      <div className="row justify-content-center mt-4 g-4">
        {plans.length === 0 ? (
          <p>Loading plans...</p>
        ) : (
          <>
            {plans.map((plan, index) => {
              // Assign a different class for each plan to style them differently
              let planClass = '';
              if (plan.id === 5) {
                planClass = 'plan-5';
              } else if (plan.id === 6) {
                planClass = 'plan-6';
              } else if (plan.id === 7) {
                planClass = 'plan-7';
              }

              return (
                <div className="col-lg-4 col-md-6" key={plan.id}>
                  <div
                    className={`card h-100 shadow-sm transition-all ${planClass}`}
                    style={{
                      transition: 'transform 0.2s ease-in-out',
                      transform: 'scale(1)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {/* Popular Tag */}
                    {plan.plan_name === "Student Electrician" && (
                      <span className="badge" style={{
                        backgroundColor: 'yellow',
                        color: 'blue',
                        position: 'absolute',
                        top: '25px',
                        right: '0px',
                        zIndex: 1,
                        transform: 'rotate(45deg)', // Rotate the tag
                        padding: '5px 10px', // Adjust padding for better appearance
                        fontSize: '1rem', // Adjust font size
                      }}>
                        Popular
                      </span>
                    )}
                    <div className="card-body d-flex flex-column p-4">
                      <h5 className="card-title fs-2">{plan.plan_name}</h5>
                      <h3 className="my-3">${parseFloat(plan.price).toFixed(2)}/<span className="month-heading">{plan.duration}</span></h3>
                      <div className="text-start mb-3">
                        {plan.description?.split('\n').map((line, i) => (
                          <div key={i}><FaCheck className="me-2 text-success" />{line}</div>
                        ))}
                      </div>
                      <div className="mt-auto">
                        <button className="plan-btn w-100 py-3 fs-5 rounded-3">
                          {index === 0 ? 'Stay on Free Plan' : `Get ${plan.plan_name}`}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

    </div>
  );
};

export default PricingPlans;