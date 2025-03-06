export default function Navbar() {
  return (
    <nav className="flex items-center justify-between h-27 shadow-md">
      <div className=" items-center gap-4 !ml-8 self-end !mb-5">
        <p className="text-md font-league mis-title tracking-wider !pt-5 !text-[#e4002b]">
          United Methodist Church
        </p>
        <p className="mis-title text-2xl ">MEMBERSHIP INFORMATION SYSTEM</p>
      </div>
      <div className="flex flex-col items-end self-end !mr-8 !mb-5">
        <p className="text-md">Welcome, John Doe</p>
        <button
          className=" !text-[#b5b7b4] !py-0.5 !text-sm"
          onClick={() => console.log("Logout button clicked")}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
