export default function Sidebar({ isSidebarOpen }: { isSidebarOpen: boolean }) {
  return (
    <aside
      className={`w-64 bg-white shadow-md h-screen transition-transform transform ${
        isSidebarOpen ? "translate-x-0" : "translate-x-full"
      } absolute right-0 md:relative md:translate-x-0`}
    >
      <div className="p-4">
        <h2 className="text-lg font-semibold">Dashboard</h2>
        <ul className="mt-4 space-y-2">
          <li className="p-2 bg-gray-200 rounded-md">Home</li>
          <li className="p-2 bg-gray-200 rounded-md">Members</li>
          <li className="p-2 bg-gray-200 rounded-md">Settings</li>
        </ul>
      </div>
    </aside>
  );
}
