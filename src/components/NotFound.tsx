import React from "react";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      {/* Robot Illustration */}
      <img
        src="https://cdn-icons-png.flaticon.com/512/2793/2793702.png"
        alt="Robot Error"
        className="w-48 h-auto mb-6"
      />

      {/* Error Message */}
      <h1 className="text-6xl font-bold text-purple-700">404</h1>
      <p className="text-xl text-gray-600 mt-2">Sorry! We couldn't find that page.</p>

      {/* Back to Home Button */}
      <a
        href="/"
        className="mt-5 px-6 py-3 bg-purple-700 text-white text-lg rounded-lg shadow-lg hover:bg-purple-800 transition"
      >
        Go Home
      </a>
    </div>
  );
};

export default NotFoundPage;
