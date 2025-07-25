import React, { useEffect, useState } from 'react';
import netalogo from '../../assets/images/Neta-Logo.png';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import BASE_URL from '../../../config';

const stripePromise = loadStripe('pk_test_51QjO3HAkiLZQygvDSwucdMyDyPbxIHJBq2OUFL9cYV3OhWbxcIy3Zn84pjzC0r4CYvHQwvklMJmkxYFOLhGj1OBU00cL8KKeIN');

const PaymentForm = ({ selectedPlan, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const res = await fetch('https://netaai-backend-production.up.railway.app/api/stripe/createStripePayment', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         amount: parseInt(selectedPlan.price * 100),
  //         currency: 'usd',
  //         description: `Payment for ${selectedPlan.plan_name} (${selectedPlan.duration})`,
  //         metadata: { order_id: `ORD_${selectedPlan.id}_${Date.now()}` }
  //       }),
  //     });

  //     const data = await res.json();

  //     if (!data.clientSecret) {
  //       alert('Payment session failed');
  //       return;
  //     }

  //     const result = await stripe.confirmCardPayment(data.clientSecret, {
  //       payment_method: {
  //         card: elements.getElement(CardElement),
  //         billing_details: { name: 'Test User' },
  //       },
  //     });

  //     if (result.error) {
  //       alert(result.error.message);
  //     } else if (result.paymentIntent.status === 'succeeded') {
  //       alert('✅ Payment Successful!');
  //       onClose();
  //     }
  //   } catch (error) {
  //     alert('Payment failed. Try again later.');
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/stripe/createStripePayment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseInt(selectedPlan.price * 100),
          currency: 'usd',
          userId: localStorage.getItem("user_id"),
          planId: selectedPlan.id,
          description: `Payment for ${selectedPlan.plan_name} (${selectedPlan.duration})`,
          metadata: { order_id: `ORD_${selectedPlan.id}_${Date.now()}` }
        }),
      });

      const data = await res.json();

      if (!data.clientSecret) {
        alert('Payment session failed');
        return;
      }

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: 'Test User' },
        },
      });



      if (result.error) {
        alert(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        alert('✅ Payment Successful!');

        // 🔄 UPDATE TIER
        const userId = localStorage.getItem("user_id");
        const updateRes = await axios.patch(`${BASE_URL}/user/editProfile/${userId}`, {
          plan: 7
        });

        if (updateRes.data.status === "true") {
          alert(`Tier updated to ${selectedPlan.plan_name}`);
          localStorage.setItem("plan_id", 7);
        } else {
          alert("Payment successful, but failed to update tier.");
        }

        onClose(); // Close payment form
      }
    } catch (error) {
      alert('Payment failed. Try again later.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="bg-white rounded shadow p-4" style={{ maxWidth: 500, margin: 'auto' }}>
      <h4 className="mb-3 text-primary">Pay for {selectedPlan.plan_name}</h4>
      <div className="mb-3 border rounded p-2">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#32325d',
                '::placeholder': { color: '#aab7c4' },
              },
              invalid: { color: '#fa755a', iconColor: '#fa755a' },
            },
            hidePostalCode: false,
          }}
        />
      </div>
      <button className="btn btn-success w-100" type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : `Pay $${selectedPlan.price}`}
      </button>
      <button className="btn btn-outline-secondary w-100 mt-2" onClick={onClose} type="button">
        Cancel
      </button>
    </form>
  );
};

const PricingPlans = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);


  const fetchPlans = async () => {
    try {
      const response = await fetch(`${BASE_URL}/plan/subscription-plans`);
      const data = await response.json();
      const filteredPlans = data.filter(plan => [5, 6, 7].includes(plan.id));
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
      <button onClick={handleBack} className="btn btn-link position-absolute top-0 start-0 m-3" style={{ zIndex: 1 }}>
        <FaArrowLeft className="fs-4" />
      </button>

      <div className="logo-container my-5">
        <img src={netalogo} alt="NETA Logo" className="img-fluid" style={{ maxWidth: '200px' }} />
      </div>

      <h2 className="fw-bold mb-4">Get Started With NETA AI Today</h2>
      <h6>
        NETA is <span className="text-primary">free for life</span> with limited chats per month.
        Unlock more power with our affordable plans.
      </h6>

      {selectedPlan ? (
        <Elements stripe={stripePromise}>
          <PaymentForm selectedPlan={selectedPlan} onClose={() => setSelectedPlan(null)} />
        </Elements>
      ) : (
        <div className="row justify-content-center mt-4 g-4">
          {plans.length === 0 ? (
            <p>Loading plans...</p>
          ) : (
            plans.map((plan, index) => {
              const planClass = plan.id === 5 ? 'plan-5' : plan.id === 6 ? 'plan-6' : 'plan-7';

              return (
                <div className="col-lg-4 col-md-6" key={plan.id}>
                  <div
                    className={`card h-100 shadow-sm transition-all ${planClass}`}
                    style={{ transition: 'transform 0.2s ease-in-out', transform: 'scale(1)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    {plan.plan_name === "Student Electrician" && (
                      <span className="badge" style={{
                        backgroundColor: 'yellow',
                        color: 'blue',
                        position: 'absolute',
                        top: '25px',
                        right: '0px',
                        zIndex: 1,
                        transform: 'rotate(45deg)',
                        padding: '5px 10px',
                        fontSize: '1rem',
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
                        <button
                          className="plan-btn w-100 py-3 fs-5 rounded-3"
                          onClick={() => {
                            if (index === 0) {
                              alert('You are already on the free plan.');
                            } else {
                              setSelectedPlan(plan);
                            }
                          }}
                        >
                          {index === 0 ? 'Stay on Free Plan' : `Get ${plan.plan_name}`}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default PricingPlans;
