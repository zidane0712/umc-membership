export default function Navbar() {
  return (
    <nav className="flex items-center justify-between h-27 text-white shadow-md">
      <div className=" items-center gap-4 !ml-6">
        <p className="text-xl font-league mis-title tracking-wider !pt-5">
          United Methodist Church
        </p>
        <p className="mis-title text-4xl !pb-5">
          MEMBERSHIP INFORMATION SYSTEM
        </p>
      </div>
      <div className="flex items-center gap-4 !m-6">
        <p className="text-md">Welcome, John Doe</p>
        <button className="bg-white text-blue-600 px-3 py-1 rounded-md">
          Logout
        </button>
      </div>
    </nav>
  );
}
