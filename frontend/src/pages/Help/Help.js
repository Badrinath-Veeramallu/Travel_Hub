import React, { useState } from 'react';
import './Help.css';

const FAQs = [
  {
    category: 'Bookings & Cancellations',
    questions: [
      {
        id: 1,
        question: 'How can I cancel my booking?',
        answer: 'You can cancel your booking from your Trips page. Go to My Trips, select the booking you want to cancel, and click the Cancel Trip button. Depending on the cancellation policy, you may receive a refund.'
      },
      {
        id: 2,
        question: 'What is the cancellation policy?',
        answer: 'Cancellation policies vary by provider. Most bookings offer free cancellation up to 24-48 hours before your travel date. Check your booking details for specific policy information.'
      },
      {
        id: 3,
        question: 'Can I modify my booking?',
        answer: 'You can view your booking details from the Trips page. For modifications, you may need to cancel and rebook. Contact our support team for assistance with complex changes.'
      }
    ]
  },
  {
    category: 'Payments & Refunds',
    questions: [
      {
        id: 4,
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, MasterCard, American Express), debit cards, net banking, digital wallets, and UPI payments.'
      },
      {
        id: 5,
        question: 'When will I receive my refund?',
        answer: 'Refunds are typically processed within 5-7 business days after cancellation. Some banks may take additional time to reflect the amount in your account.'
      },
      {
        id: 6,
        question: 'Is my payment information secure?',
        answer: 'Yes! We use industry-standard SSL encryption and PCI DSS compliance to protect all payment information. Your data is never stored on our servers.'
      }
    ]
  },
  {
    category: 'Flights',
    questions: [
      {
        id: 7,
        question: 'Can I select my seat during booking?',
        answer: 'Seat selection depends on the airline. Some flights allow seat selection during checkout, while others may require you to select seats at the airline\'s website.'
      },
      {
        id: 8,
        question: 'What is baggage allowance?',
        answer: 'Baggage allowance varies by airline and ticket type. Check your flight details for specific baggage information. Additional baggage can usually be purchased for an extra fee.'
      },
      {
        id: 9,
        question: 'Can I book a round trip flight?',
        answer: 'Yes! You can select "Round Trip" when searching for flights. You\'ll choose both outbound and return flights during the booking process.'
      }
    ]
  },
  {
    category: 'Hotels',
    questions: [
      {
        id: 10,
        question: 'Can I modify my hotel check-in date?',
        answer: 'You can modify check-in dates if your booking has a free cancellation policy. For paid cancellations, follow the cancellation process and rebook with new dates.'
      },
      {
        id: 11,
        question: 'What amenities are included?',
        answer: 'Amenities vary by hotel. Check the specific hotel details page to see included amenities like WiFi, breakfast, parking, pool access, gym, etc.'
      },
      {
        id: 12,
        question: 'What time is check-in and check-out?',
        answer: 'Standard check-in is 2 PM and check-out is 11 AM. Many hotels offer early check-in or late check-out for an additional fee. Contact the hotel directly for availability.'
      }
    ]
  },
  {
    category: 'Car Rentals',
    questions: [
      {
        id: 13,
        question: 'What documents do I need for car rental?',
        answer: 'You\'ll need a valid driver\'s license, ID proof, and payment method. International travelers should carry an International Driving Permit. Age restrictions may apply.'
      },
      {
        id: 14,
        question: 'Is insurance included?',
        answer: 'Basic insurance is typically included. Coverage details are shown in your booking. You can opt for additional insurance for comprehensive coverage.'
      },
      {
        id: 15,
        question: 'What is the fuel policy?',
        answer: 'Most rentals use a "full to full" policy - you pick up a full tank and return it full. Check your booking details for specific fuel policies.'
      }
    ]
  },
  {
    category: 'Account & Profile',
    questions: [
      {
        id: 16,
        question: 'How do I reset my password?',
        answer: 'Click on "Forgot Password" on the login page. Enter your email and follow the instructions to reset your password.'
      },
      {
        id: 17,
        question: 'How can I update my profile information?',
        answer: 'Log in to your account, go to Profile, and click Edit. Update your information and save the changes.'
      },
      {
        id: 18,
        question: 'Can I delete my account?',
        answer: 'Yes. Go to Settings and select "Delete Account". Please note that this action is permanent and will delete all your booking history.'
      }
    ]
  }
];

export default function Help() {
  const [expandedId, setExpandedId] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleFAQ = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <div className="help-page">
      <div className="help-hero">
        <div className="container">
          <h1>How Can We Help?</h1>
          <p>Find answers to common questions about bookings, payments, and more</p>
        </div>
      </div>

      <div className="container">
        <div className="help-content">
          {/* Quick Links */}
          <div className="quick-links">
            <h2>Support Resources</h2>
            <div className="links-grid">
              <div className="quick-link" onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}>
                <span className="icon">💬</span>
                <span>Contact Support</span>
              </div>
              <div className="quick-link" onClick={() => alert('TravelHub mobile app is launching soon on iOS and Android!')}>
                <span className="icon">📱</span>
                <span>Download App</span>
              </div>
              <div className="quick-link" onClick={() => alert('Privacy Policy: We never sell your personal or payment data. All transactions are SSL encrypted.')}>
                <span className="icon">🔒</span>
                <span>Privacy & Security</span>
              </div>
              <div className="quick-link" onClick={() => alert('Terms: Bookings are subject to provider availability and cancellation terms indicated on your confirmation.')}>
                <span className="icon">📋</span>
                <span>Terms of Service</span>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="faqs-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faqs-container">
              {FAQs.map(category => (
                <div key={category.category} className="faq-category">
                  <button 
                    className={`category-header ${expandedCategory === category.category ? 'expanded' : ''}`}
                    onClick={() => toggleCategory(category.category)}
                  >
                    <span className="category-title">{category.category}</span>
                    <span className="expand-icon">▼</span>
                  </button>

                  {expandedCategory === category.category && (
                    <div className="category-content">
                      {category.questions.map(faq => (
                        <div key={faq.id} className="faq-item">
                          <button 
                            className={`faq-question ${expandedId === faq.id ? 'active' : ''}`}
                            onClick={() => toggleFAQ(faq.id)}
                          >
                            <span>{faq.question}</span>
                            <span className="faq-icon">+</span>
                          </button>
                          {expandedId === faq.id && (
                            <div className="faq-answer">
                              <p>{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Support Contact */}
          <div className="support-section">
            <h2>Still Need Help?</h2>
            <div className="support-cards">
              <div className="support-card">
                <div className="card-icon">📧</div>
                <h3>Email Support</h3>
                <p>support@travelbooking.com</p>
                <p className="response-time">Response within 24 hours</p>
              </div>
              <div className="support-card">
                <div className="card-icon">💬</div>
                <h3>Live Chat</h3>
                <p>Available 24/7</p>
                <p className="response-time">Chat with our team instantly</p>
              </div>
              <div className="support-card">
                <div className="card-icon">📞</div>
                <h3>Phone Support</h3>
                <p>+1-800-123-4567</p>
                <p className="response-time">Mon-Fri 9 AM - 6 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
