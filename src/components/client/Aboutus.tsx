import { useNavigate } from "react-router-dom";
import UserHeader from "./header/Header";
import Footer from "./footer/Footer";

const About = () => {
    const navigate=useNavigate()

    return (
        <>
        <UserHeader/>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-5xl w-full">
          <h2 className="text-3xl font-bold text-gray-800 text-center">About Retro Service</h2>
          <p className="text-gray-600 text-center mt-2">Connecting you with trusted mechanics anytime, anywhere.</p>
  
          {/* Our Story */}
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-700">Our Story</h3>
            <p className="text-gray-600 mt-2 leading-relaxed">
              Retro Service was founded with a vision to revolutionize the way vehicle repairs and servicing are done. 
              We understand the hassle of finding reliable mechanics, especially in emergencies. That’s why we built a 
              **location-based mechanic booking system** that connects users with skilled professionals instantly.
            </p>
          </div>
  
          {/* Why Choose Us */}
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-700">Why Choose Us?</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700">🚀 Quick & Easy Booking</h4>
                <p className="text-sm text-gray-600">Book a mechanic in just a few clicks.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700">🔍 Verified Professionals</h4>
                <p className="text-sm text-gray-600">We ensure quality service with experienced mechanics.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700">💰 Transparent Pricing</h4>
                <p className="text-sm text-gray-600">No hidden charges, pay for what you get.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700">🛠️ Auto Parts Store</h4>
                <p className="text-sm text-gray-600">Buy quality spare parts directly from our platform.</p>
              </div>
            </div>
          </div>
  
         {/* Meet Our Team */}
<div className="mt-12 text-center">
  <h3 className="text-3xl font-bold text-gray-800">Meet Our Team</h3>
  <p className="text-gray-600 mt-2 max-w-xl mx-auto">
    A passionate team dedicated to making vehicle maintenance hassle-free.
  </p>

  <div className="mt-8 flex flex-wrap justify-center gap-8">
    {/* Team Member Card */}
    <div className="flex flex-col items-center bg-white shadow-md p-6 rounded-lg w-64">
      <img 
        src="https://res.cloudinary.com/ded1lrbaz/image/upload/v1740765152/linkdindp_qzccet.jpg"
        alt="Sujith C"
        className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
      />
      <h4 className="text-lg font-semibold mt-4">Sujith C</h4>
      <p className="text-sm text-gray-600">Founder & Developer</p>
    </div>
  </div>
</div>
c
  
          {/* Call to Action */}
          <div className="mt-10 text-center">
            <h3 className="text-xl font-semibold text-gray-700">Join us on our journey!</h3>
            <p className="text-gray-600 mt-2">Experience a smarter way to service your vehicle.</p>
            <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition" onClick={()=>navigate('/home')}>
              Get Started
            </button>
          </div>
        </div>
      </div>
      <Footer/>
      </>
    );
  };
  
  export default About;
  