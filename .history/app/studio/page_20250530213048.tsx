export default function StudioPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* New content for the Studio page */}
      <h1 className="text-4xl font-bold mb-4 text-white">Ready to Build Your Vision?</h1>
      <p className="text-xl text-gray-300 mb-8">Explore the tools and resources available through b0ase.com to turn your ideas into reality. Whether you're launching a website, creating an app, or developing a unique digital experience, the journey starts here.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {/* Buttons linking to the new studio sub-pages */}
        <a href="/studio/role" className="block bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-lg text-center transition-colors duration-200">
          Role
        </a>
        <a href="/studio/start-a-project" className="block bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-lg text-center transition-colors duration-200">
          Start a Project
        </a>
        <a href="/studio/build-a-website" className="block bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-lg text-center transition-colors duration-200">
          Build a Website
        </a>
        <a href="/studio/create-a-team" className="block bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-lg text-center transition-colors duration-200">
          Create a Team
        </a>
        <a href="/studio/join-a-project" className="block bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-lg text-center transition-colors duration-200">
          Join a Project
        </a>
        <a href="/studio/join-a-team" className="block bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-lg text-center transition-colors duration-200">
          Join a Team
        </a>
        <a href="/studio/create-an-agent" className="block bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-lg text-center transition-colors duration-200">
          Create an Agent
        </a>
        <a href="/studio/launch-a-token" className="block bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-lg text-center transition-colors duration-200">
          Launch a Token
        </a>
      </div>
    </div>
  );
} 