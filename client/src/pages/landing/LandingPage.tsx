import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center px-6">
      <div className="max-w-3xl text-center bg-white p-10 rounded-2xl shadow-xl border border-gray-200">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          Welcome to <span className="text-primary">RateHub</span>
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Discover top-rated stores. Rate your experiences. Administer with ease.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/auth">
            <button className="bg-primary hover:bg-primary-dark text-white font-medium px-6 py-3 rounded-full shadow">
              Get Started
            </button>
          </Link>
          <a href="#features">
            <button className="border border-primary text-primary hover:bg-purple-50 font-medium px-6 py-3 rounded-full">
              Learn More
            </button>
          </a>
        </div>
        <p className="text-center py-6">
          an assignment from Roxiller by Kritika Rajput
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
