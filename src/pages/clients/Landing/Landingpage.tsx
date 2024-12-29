import { useNavigate } from "react-router-dom"

const Landingpage = () => {
  const navigate=useNavigate()
  return (
    <div>
        {/* Hero Section */}
        <section
          className="bg-cover bg-center h-screen flex items-center justify-center"
          style={{
            backgroundImage: "url('/male-mechanic-working-shop-car.jpg')",
          }}        >
          <div className="text-center text-white max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">EXPERT VEHICLE REPAIR SERVICES</h1>
            <p className="text-lg mb-6">Reliable, trusted, and certified service for your vehicle.</p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition" onClick={()=>navigate('/login')}>
              Join Now
            </button>
          </div>
        </section>
  
        {/* Services Section */}
        <section className="bg-blue-100 py-12">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
    <div className="p-4">
      <img 
        src="/eduardo-cabrera-HT8hCl-SVoQ-unsplash.jpg" 
        alt="Quality Repairs" 
        className="mx-auto mb-4 h-50 w-50" 
      />
      <h3 className="font-bold text-lg">Quality Repairs</h3>
      <p>We provide high-quality, long-lasting repair services.</p>
    </div>
    <div className="p-4">
      <img 
        src="/big-dodzy-HD51lES61c8-unsplash.jpg" 
        alt="Certified Mechanics" 
        className="mx-auto mb-4 h-50 w-50" 
      />
      <h3 className="font-bold text-lg">Certified Mechanics</h3>
      <p>Our team is certified and experienced in handling all car models.</p>
    </div>
    <div className="p-4">
      <img 
        src="/St Paul's - Year 9 - Would you find this useful when looking for ideas_.jpeg" 
        alt="Quick Service" 
        className="mx-auto mb-4 h-50 w-50" 
      />
      <h3 className="font-bold text-lg">Quick Service</h3>
      <p>We value your time and provide on-time delivery.</p>
    </div>
  </div>
</section>

  
        {/* About Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
            <img
              src="/Auto Body Shops Metal Buildings, Auto Repair Shop Steel Buildings.jpeg"
              alt="About Us"
              className="w-full md:w-1/2 rounded-lg shadow-lg mb-6 md:mb-0 md:mr-6"
            />
            <div>
              <h2 className="text-3xl font-bold mb-4">Car Service Repair and Maintenance Certified</h2>
              <p className="text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.
              </p>
            </div>
          </div>
        </section>
  
        {/* Gallery Section */}
        <section className="bg-gray-100 py-12">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <img
              src="/5 FAQs to Expect From New Customers Throughout Your Auto Repair Career.jpeg"
              alt="Gallery 1"
              className="w-full rounded-lg shadow-lg"
            />
            <img
              src="/Per direct starten in de autobranche_ Wij hebben….jpeg"
              alt="Gallery 2"
              className="w-full rounded-lg shadow-lg"
            />
            <img
              src="/Top 10 Best Design – Trends Mechanic Uniform_ Styles & Ideas - Dony Garment.jpeg"
              alt="Gallery 3"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </section>
  
        {/* Testimonials Section */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">What Our Clients Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-gray-600 italic mb-4">"Great service! Highly recommend."</p>
                <h4 className="font-bold">John Doe</h4>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-gray-600 italic mb-4">"Quick and reliable repair services."</p>
                <h4 className="font-bold">Jane Smith</h4>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-gray-600 italic mb-4">"Affordable and trustworthy mechanics."</p>
                <h4 className="font-bold">Emily Wilson</h4>
              </div>
            </div>
          </div>
        </section>
  
        {/* Footer */}
        <footer className="bg-blue-900 text-white py-8">
          <div className="max-w-6xl mx-auto text-center">
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p>Phone: 123-456-7890</p>
            <p>Email: support@example.com</p>
            <div className="mt-6">
              <a href="#" className="text-white px-4">Facebook</a>
              <a href="#" className="text-white px-4">Twitter</a>
              <a href="#" className="text-white px-4">Instagram</a>
            </div>
          </div>
        </footer>
      </div>
  )
}

export default Landingpage
