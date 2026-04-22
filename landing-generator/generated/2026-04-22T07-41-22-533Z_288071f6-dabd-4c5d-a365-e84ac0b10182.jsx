export default function App() {
  return (
    <div className="min-h-screen font-sans text-gray-800 bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544367527-d421253683a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 flex items-center justify-center h-full text-white text-center px-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 animate-fade-in-down">
              Find Your Inner Peace in the Heart of Berlin
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto animate-fade-in-up">
              Discover a sanctuary for mind, body, and spirit at Berlin Yoga Studio.
              Experience authentic yoga in a welcoming community.
            </p>
            <a href="#classes" className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105 shadow-lg animate-fade-in">
              Explore Classes
            </a>
          </div>
        </div>
      </section>

      {/* Features/Offerings Section */}
      <section id="classes" className="py-16 bg-white px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Our Sanctuary for Mind & Body</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            At Berlin Yoga Studio, we offer a diverse range of classes designed to nurture your well-being,
            guided by experienced instructors in a serene environment.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-5xl text-purple-600 mb-4 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-white bg-opacity-50">
                🧘‍♀️ {/* Unicode icon */}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Vinyasa Flow</h3>
              <p className="text-gray-700">
                Dynamic sequences synchronize breath with movement, building strength, flexibility, and focus. All levels welcome.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-teal-100 to-green-100 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-5xl text-teal-600 mb-4 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-white bg-opacity-50">
                🌿
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Restorative Yoga</h3>
              <p className="text-gray-700">
                Gentle, supported poses to deeply relax the body and calm the mind, perfect for stress relief and recovery.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-5xl text-yellow-600 mb-4 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-white bg-opacity-50">
                ✨
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Meditation & Mindfulness</h3>
              <p className="text-gray-700">
                Learn techniques to cultivate inner peace, enhance awareness, and reduce daily anxieties.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-pink-100 to-red-100 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-5xl text-pink-600 mb-4 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-white bg-opacity-50">
                🤰
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Prenatal Yoga</h3>
              <p className="text-gray-700">
                Supportive classes for expectant mothers to prepare for childbirth, maintain fitness, and find calm.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-5xl text-blue-600 mb-4 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-white bg-opacity-50">
                🤸
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Yoga Workshops</h3>
              <p className="text-gray-700">
                Deep dive into specific poses, philosophy, or practices with our extended weekend workshops.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-gray-100 to-slate-100 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-5xl text-gray-600 mb-4 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-white bg-opacity-50">
                🌎
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Community Events</h3>
              <p className="text-gray-700">
                Join our vibrant community for social gatherings, outdoor yoga, and charitable initiatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials/Social Proof Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Our Community Speaks</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Hear from our wonderful students who've found balance and joy at Berlin Yoga Studio.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
              <img src="https://picsum.photos/id/1005/100/100" alt="Student Anna" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover ring-2 ring-pink-300" />
              <p className="text-lg italic text-gray-700 mb-4">
                "Berlin Yoga Studio is my peaceful escape. The instructors are amazing and the atmosphere is so welcoming!"
              </p>
              <p className="font-semibold text-gray-900">- Anna Schmidt, Berlin</p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
              <img src="https://picsum.photos/id/1011/100/100" alt="Student Max" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover ring-2 ring-purple-300" />
              <p className="text-lg italic text-gray-700 mb-4">
                "I've gained so much strength and flexibility here. It's truly transformed my daily life."
              </p>
              <p className="font-semibold text-gray-900">- Max Müller, Kreuzberg</p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
              <img src="https://picsum.photos/id/1012/100/100" alt="Student Lena" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover ring-2 ring-teal-300" />
              <p className="text-lg italic text-gray-700 mb-4">
                "The community here feels like family. It's more than just yoga, it's a lifestyle."
              </p>
              <p className="font-semibold text-gray-900">- Lena Becker, Prenzlauer Berg</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action (CTA) Section */}
      <section className="py-20 bg-pink-600 text-white text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl md:text-2xl mb-10 opacity-90">
            Join our vibrant community and experience the transformative power of yoga.
            Your first class awaits!
          </p>
          <a href="#" className="inline-block bg-white text-pink-600 font-bold py-4 px-12 rounded-full text-xl uppercase tracking-wide transition duration-300 hover:bg-gray-100 transform hover:scale-105 shadow-xl">
            Book Your First Class
          </a>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-gray-300 py-10 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Berlin Yoga Studio</h3>
            <p className="text-gray-400 leading-relaxed">
              A serene space in the heart of Berlin dedicated to promoting wellness, mindfulness, and community through the practice of yoga.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Contact Us</h3>
            <p className="mb-2">123 Yogastraße, 10115 Berlin</p>
            <p className="mb-2">info@berlinyogastud.io</p>
            <p>+49 30 123 456 789</p>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Connect</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition duration-300" aria-label="Facebook">
                {/* SVG for Facebook */}
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 5.232 3.865 9.568 8.927 10.395V14.65h-2.54v-2.18h2.54V9.8c0-2.507 1.492-3.89 3.776-3.89 1.094 0 2.24.195 2.24.195v2.46h-1.26c-1.247 0-1.637.77-1.637 1.562v1.88h2.773l-.443 2.18h-2.33V22.41C18.135 21.585 22 17.25 22 12.017 22 6.484 17.523 2 12 2Z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300" aria-label="Instagram">
                {/* SVG for Instagram */}
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                  <path fillRule="evenodd" d="M12.317 2.01c-.161 0-.32.008-.479.018A10.027 10.027 0 004 7.02c0 .159.008.318.018.479A10.007 10.007 0 002 12c0 2.766 1.127 5.253 2.938 7.062 1.809 1.808 4.296 2.938 7.062 2.938 2.766 0 5.253-1.127 7.062-2.938A10.007 10.007 0 0022 12c0-2.766-1.127-5.253-2.938-7.062A10.027 10.027 0 0012.479 2.01v0ZM12 4.41C7.818 4.41 4.41 7.818 4.41 12S7.818 19.59 12 19.59s7.59-3.408 7.59-7.59S16.182 4.41 12 4.41Zm0 3.016a4.574 4.574 0 100 9.148 4.574 4.574 0 000-9.148Zm0 1.635a2.94 2.94 0 110 5.88 2.94 2.94 0 010-5.88Zm6.096-3.837a1.08 1.08 0 100 2.16 1.08 1.08 0 000-2.16Z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300" aria-label="YouTube">
                {/* SVG for YouTube */}
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                  <path fillRule="evenodd" d="M19.812 5.438a3.116 3.116 0 00-2.222-2.222C16.273 3 12 3 12 3s-4.273 0-5.59.186a3.116 3.116 0 00-2.222 2.222C4 6.727 4 12 4 12s0 5.273.186 6.59a3.116 3.116 0 002.222 2.222C7.727 21 12 21 12 21s4.273 0 5.59-.186a3.116 3.116 0 002.222-2.222C20 17.273 20 12 20 12s0-5.273-.186-6.59Zm-11.45 6.843 5.346-2.531-5.346-2.531v5.062Z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Berlin Yoga Studio. All rights reserved.
        </div>
      </footer>
    </div>
  );
}