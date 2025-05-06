import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import background from "../assets/mk.jpg"; // Import the background image

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  // Handle form data changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simple validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Simulating form submission
    try {
      // Simulate API call (replace with actual API call)
      setTimeout(() => {
        setLoading(false);
        toast.success('Your message has been sent successfully!');
        setFormData({ name: '', email: '', message: '' }); // Reset form
      }, 2000);
    } catch (error) {
      setLoading(false);
      toast.error('Something went wrong. Please try again later.');
    }
  };

  return (
    <>
      <div 
        className="min-h-screen min-w-screen bg-cover bg-center p-6" 
        style={{ backgroundImage: `url(${background})` }} // Set the background image
      >
        <div className="max-w-4xl mx-auto bg-white p-8 mt-14 rounded-xl shadow-xl bg-opacity-90">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-1">
            Contact Us
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-gray-700 font-medium text-lg mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-gray-700 font-medium text-lg mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-gray-700 font-medium text-lg mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Write your message"
                  rows="6"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Toast Notifications */}
        <ToastContainer position="top-center" autoClose={2000} />
      </div>
    </>
  );
};

export default ContactUs;
