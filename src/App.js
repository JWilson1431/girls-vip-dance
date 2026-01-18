import './App.css';
import React, { useState } from 'react';
import { Sparkles, Calendar, MapPin, Music, Camera, Cake, Clock, DollarSign } from 'lucide-react';

export default function DaddyDaughterDance() {
  const [formData, setFormData] = useState({
    children: [{ name: '', grade: '' }],
    vipGuest: '',
    email: '',
    phone: '',
    paymentMethod: '',
    songRequest: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [animatedText, setAnimatedText] = useState('');
  
  const fullText = "Welcome to the Enchanted Girls VIP Dance";
  
  React.useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setAnimatedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const handleChildChange = (index, field, value) => {
    const newChildren = [...formData.children];
    newChildren[index][field] = value;
    setFormData({ ...formData, children: newChildren });
  };

  const addChild = () => {
    setFormData({
      ...formData,
      children: [...formData.children, { name: '', grade: '' }]
    });
  };

  const removeChild = (index) => {
    const newChildren = formData.children.filter((_, i) => i !== index);
    setFormData({ ...formData, children: newChildren });
  };

  //Submit button handling
  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    //Ensure child information is filled out
    if (formData.children.some(child => !child.name || !child.grade)) {
      setError('Please fill in all child names and grades');
      setLoading(false);
      return;
    }

    //Ensure required fields are filled out
    if (!formData.vipGuest || !formData.email || !formData.phone || !formData.paymentMethod) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    const timestamp = new Date().toISOString();
    const numberOfParticipants = formData.children.length;
    const childNames = formData.children.map(c => c.name).join(', ');
    const grades = formData.children.map(c => c.grade).join(', ');

    try {
      const googleSheetUrl = process.env.REACT_APP_GOOGLE_SHEET_URL;
      await fetch(googleSheetUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp,
          childNames,
          grades,
          vipGuest: formData.vipGuest,
          email: formData.email,
          phone: formData.phone,
          numberOfParticipants,
          paymentMethod: formData.paymentMethod,
          songRequest: formData.songRequest
        })
      });

      await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp,
          childNames,
          grades,
          vipGuest: formData.vipGuest,
          email: formData.email,
          phone: formData.phone,
          numberOfParticipants,
          paymentMethod: formData.paymentMethod,
          songRequest: formData.songRequest
        })
      });

      setSubmitted(true);
      setLoading(false);
    } catch (err) {
      setError('There was an error submitting your registration. Please try again or contact us directly.');
      setLoading(false);
      console.error('Submission error:', err);
    }
  };

  //Ticket price
  const ticketPrice = formData.children.length === 1 ? '$20' : '$25';

  return (
    <div className="app-container">
      <div className="floating-elements">
        <div className="float-item mushroom-1">🍄</div>
        <div className="float-item sparkle-1">✨</div>
        <div className="float-item mushroom-2">🍄</div>
        <div className="float-item sparkle-2">✨</div>
      </div>

      <header className="hero-header">
        <div className="forest-background">
          <div className="gradient-overlay"></div>
          <div className="tree-layer"></div>
          
          <div className="flowers-layer">
            <div className="flower flower-1">🌸</div>
            <div className="flower flower-2">🌺</div>
            <div className="flower flower-3">🌸</div>
            <div className="flower flower-4">🌷</div>
            <div className="flower flower-5">🌺</div>
            <div className="flower flower-6">🌸</div>
          </div>
          
          <div className="creatures-layer">
            <div className="creature butterfly-1">🦋</div>
            <div className="creature butterfly-2">🦋</div>
            <div className="creature fairy-1">🧚</div>
            <div className="creature fairy-2">🧚</div>
            <div className="creature butterfly-3">🦋</div>
          </div>
          
          <div className="mushrooms-layer">
            <div className="mushroom mush-1">🍄</div>
            <div className="mushroom mush-2">🍄</div>
            <div className="mushroom mush-3">🍄</div>
          </div>
          
          <div className="river-effect"></div>
          <div className="light-ray ray-1"></div>
          <div className="light-ray ray-2"></div>
          
          <div className="firefly firefly-1"></div>
          <div className="firefly firefly-2"></div>
          <div className="firefly firefly-3"></div>
          
          <div className="glow-orb orb-1"></div>
          <div className="glow-orb orb-2"></div>
        </div>

        <div className="dark-overlay"></div>

        <div className="hero-content">
          <div className="sparkle-icon">
            <Sparkles size={80} />
          </div>
          
          <div className="title-container">
            <h1 className="animated-title">
              {animatedText.split(' ').map((word, i) => (
                <span key={i} className="word">
                  {word.split('').map((letter, j) => (
                    <span
                      key={j}
                      className="letter"
                      style={{
                        animationDelay: `${(i * 5 + j) * 0.08}s`
                      }}
                    >
                      {letter}
                    </span>
                  ))}
                </span>
              ))}
              <span className="sparkle-end">✨</span>
            </h1>
          </div>

          <div className="hero-details">
            <h2 className="event-date">February 20th, 2025 • 6:30 PM - 8:30 PM</h2>
            <p className="event-location">Amosland Elementary School</p>
          </div>

          <div className="scroll-indicator">
            <div className="scroll-border">
              <div className="scroll-dot"></div>
            </div>
          </div>
        </div>
      </header>

      <section className="event-details-section">
        <div className="details-card">
          <div className="details-grid">
            <div className="detail-item">
              <Calendar className="detail-icon" size={32} />
              <div>
                <h3>Date & Time</h3>
                <p>Thursday, February 20th, 2025</p>
                <p>6:30 PM - 8:30 PM</p>
              </div>
            </div>

            <div className="detail-item">
              <MapPin className="detail-icon" size={32} />
              <div>
                <h3>Location</h3>
                <p>Amosland Elementary School</p>
                <p>Grades K-5</p>
              </div>
            </div>

            <div className="detail-item">
              <DollarSign className="detail-icon" size={32} />
              <div>
                <h3>Ticket Price</h3>
                <p>$20 per girl</p>
                <p>$25 for multiple girls</p>
                <p className="small-text">(Includes special guest)</p>
              </div>
            </div>

            <div className="detail-item">
              <Clock className="detail-icon" size={32} />
              <div>
                <h3>Registration Deadline</h3>
                <p className="deadline">February 13th, 2025</p>
              </div>
            </div>
          </div>

          <div className="what-to-expect">
            <h3 className="section-title">
              <Sparkles className="title-icon" size={24} />
              What to Expect
            </h3>
            <div className="features-grid">
              <div className="feature">
                <Music className="feature-icon" size={48} />
                <h4>DJ & Dancing</h4>
                <p>Dance the night away with your special guest!</p>
              </div>
              <div className="feature">
                <Camera className="feature-icon" size={48} />
                <h4>Photo Opportunities</h4>
                <p>Capture magical memories together</p>
              </div>
              <div className="feature">
                <Cake className="feature-icon" size={48} />
                <h4>Refreshments</h4>
                <p>Cupcakes, pretzels, and drinks</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="registration-section">
        <div className="registration-card">
          <h2 className="registration-title">Register for the Dance</h2>

          {submitted ? (
            <div className="success-message">
              <Sparkles className="success-icon" size={64} />
              <h3>Registration Complete! 🎉</h3>
              <p>Thank you for registering! We can't wait to see you at the Enchanted Forest dance.</p>
              <p className="small-text">You should receive a confirmation email shortly.</p>
              <p className="ticket-price-display">Your ticket price: {ticketPrice}</p>
              <p className="small-text">Please bring payment on the day of the event</p>
            </div>
          ) : (
            <div className="registration-form">
              <div className="form-group">
                <label>Child/Children Attending *</label>
                {formData.children.map((child, index) => (
                  <div key={index} className="child-input-group">
                    <div className="child-inputs">
                      <input
                        type="text"
                        placeholder="Child's Name"
                        value={child.name}
                        onChange={(e) => handleChildChange(index, 'name', e.target.value)}
                        className="form-input"
                      />
                      <div className="grade-remove">
                        <select
                          value={child.grade}
                          onChange={(e) => handleChildChange(index, 'grade', e.target.value)}
                          className="form-select"
                        >
                          <option value="">Select Grade</option>
                          <option value="K">Kindergarten</option>
                          <option value="1">1st Grade</option>
                          <option value="2">2nd Grade</option>
                          <option value="3">3rd Grade</option>
                          <option value="4">4th Grade</option>
                          <option value="5">5th Grade</option>
                        </select>
                        {formData.children.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeChild(index)}
                            className="remove-btn"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addChild} className="add-child-btn">
                  + Add Another Child
                </button>
              </div>

              <div className="form-group">
                <label>VIP Guest Name *</label>
                <input
                  type="text"
                  value={formData.vipGuest}
                  onChange={(e) => setFormData({ ...formData, vipGuest: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Payment Method *</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="form-select"
                >
                  <option value="">Select Payment Method</option>
                  <option value="Venmo">Venmo</option>
                  <option value="Cash">Cash</option>
                  <option value="Check">Check</option>
                </select>
              </div>

              <div className="price-display">
                <p className="price-label">
                  Your Ticket Price: <span className="price-amount">{ticketPrice}</span>
                </p>
                <p className="price-note">
                  {formData.paymentMethod === "Cash" || formData.paymentMethod === "Check" ? (
                    <>
                      Please send {formData.paymentMethod} to the teacher with your child's name, "VIP Dance" notation, and parent phone number.
                    </>
                  ) : formData.paymentMethod === "Venmo" ? (
                    <>
                      Please pay via <a href="https://venmo.com/Amosland-HomeandSchool" target="_blank" rel="noopener noreferrer">Venmo</a>.
                    </>
                  ) : (
                    "Please select a payment method."
                  )}
                </p>
              </div>

              <div className="form-group">
                <label>Song Request (Optional)</label>
                <div className="song-notice">
                  <Music className="notice-icon" size={16} />
                  <p>
                    <strong>Important:</strong> We are collecting ONE song request per family ahead of time. 
                    Song requests will NOT be accepted during the dance. Please choose your favorite song now!
                  </p>
                </div>
                <input
                  type="text"
                  value={formData.songRequest}
                  onChange={(e) => setFormData({ ...formData, songRequest: e.target.value })}
                  placeholder="Your favorite song for the DJ"
                  className="form-input"
                />
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="submit-btn"
              >
                {loading ? 'Submitting...' : 'Register Now ✨'}
              </button>
            </div>
          )}
        </div>
      </section>

      <footer className="footer">
        <p>
          Questions? Contact us at{" "}
          <a href="mailto:Amoslandhands@gmail.com" className="footer-email">
            Amoslandhands@gmail.com
          </a>
        </p>
        <p className="footer-tagline">
          We can't wait to see you at the Enchanted Forest! 🍄✨
        </p>
      </footer>
    </div>
  );
}