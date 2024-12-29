
const Footer = () => {
  return (
    <>
    <footer className="bg-gray-800 text-gray-300 py-8">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* About Section */}
    <div>
      <h4 className="text-lg font-semibold text-white mb-4">About Us</h4>
      <p>
        We are dedicated to providing top-notch repair services with a team of experienced and certified mechanics. Your satisfaction is our priority.
      </p>
    </div>

    {/* Navigation Section */}
    <div>
      <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
      <ul className="space-y-2">
        <li>
          <button className="text-gray-300 hover:underline focus:outline-none">
            Our Services
          </button>
        </li>
        <li>
          <button className="text-gray-300 hover:underline focus:outline-none">
            About Us
          </button>
        </li>
        <li>
          <button className="text-gray-300 hover:underline focus:outline-none">
            Contact
          </button>
        </li>
        <li>
          <button className="text-gray-300 hover:underline focus:outline-none">
            FAQs
          </button>
        </li>
      </ul>
    </div>

    {/* Contact Section */}
    <div>
      <h4 className="text-lg font-semibold text-white mb-4">Get in Touch</h4>
      <ul className="space-y-2">
        <li>
          <span className="font-semibold">Email:</span> support@retroservice.com
        </li>
        <li>
          <span className="font-semibold">Phone:</span> +1 (555) 123-4567
        </li>
        <li>
          <span className="font-semibold">Address:</span> 123 Mechanic St, Your City
        </li>
      </ul>
      <div className="mt-4 flex space-x-4">
        <button className="text-gray-300 hover:text-white focus:outline-none">
          <i className="fab fa-facebook fa-lg"></i>
        </button>
        <button className="text-gray-300 hover:text-white focus:outline-none">
          <i className="fab fa-twitter fa-lg"></i>
        </button>
        <button className="text-gray-300 hover:text-white focus:outline-none">
          <i className="fab fa-instagram fa-lg"></i>
        </button>
      </div>
    </div>
  </div>

  <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
    © 2024 Retro Service. All rights reserved.
  </div>
</footer>
</>
  )
}

export default Footer
