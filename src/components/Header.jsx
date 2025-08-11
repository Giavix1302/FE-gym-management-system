export default function Header() {
  return (
    <header className="bg-blue-600 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold">Gym Management</h1>
        <nav className="space-x-4">
          <a href="/" className="hover:underline">Home</a>
          <a href="/booking" className="hover:underline">Booking</a>
          <a href="/login" className="hover:underline">Login</a>
        </nav>
      </div>
    </header>
  )
}