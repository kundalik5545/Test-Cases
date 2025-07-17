export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-sans">
      <div className="container mx-auto px-5 md:px-10 lg:px-20">
        {/* Hero Section */}
        <header className="flex flex-col items-center justify-center py-16 md:py-24 border-b border-gray-200">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold   mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Test Cases Management Suite
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl text-center mb-8">
            Transform your testing process with AI-powered assistance and
            intelligent automation
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg text-lg transition-colors duration-300">
            Get Started Free
          </button>
        </header>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Assistance Card */}
            <div className="bg-white rounded-xl shadow-md p-8 hover:transform hover:-translate-y-2 transition-transform duration-300 cursor-pointer">
              <h2 className="text-2xl font-semibold text-blue-500 mb-4">
                AI Assistance
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li>✨ Smart test case generation</li>
                <li>🔍 Intelligent scenario detection</li>
                <li>🤖 Automated test step suggestions</li>
              </ul>
            </div>

            {/* Automation Card */}
            <div className="bg-white rounded-xl shadow-md p-8 hover:transform hover:-translate-y-2 transition-transform duration-300 cursor-pointer">
              <h2 className="text-2xl font-semibold text-green-600 mb-4">
                Automation
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li>⚡ Streamlined task automation</li>
                <li>🔄 Seamless CI/CD integration</li>
                <li>📊 Real-time results tracking</li>
              </ul>
            </div>

            {/* Analytics Card */}
            <div className="bg-white rounded-xl shadow-md p-8 hover:transform hover:-translate-y-2 transition-transform duration-300 cursor-pointer">
              <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                Analytics
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li>📈 Comprehensive reporting</li>
                <li>🎯 Performance metrics</li>
                <li>💡 Actionable insights</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
