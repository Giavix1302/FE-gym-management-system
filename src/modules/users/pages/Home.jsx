export default function Home() {
  return (
    <div>
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">Welcome to Our Gym</h2>
        <p className="text-gray-600 mb-6">
          Stay fit, stay healthy. Join us today and start your fitness journey with our professional trainers.
        </p>
        <a
          href="/register"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Get Started
        </a>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Modern Equipment</h3>
          <p className="text-gray-600">
            Our gym is equipped with the latest and safest machines to help you achieve your fitness goals.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Expert Trainers</h3>
          <p className="text-gray-600">
            Learn from the best. Our trainers are certified and experienced in multiple fitness disciplines.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Flexible Memberships</h3>
          <p className="text-gray-600">
            Choose from a variety of membership plans that suit your schedule and budget.
          </p>
        </div>
      </section>
    </div>
  )
}