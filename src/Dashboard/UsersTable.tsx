import { USERS, STATUS_STYLES } from "./constants";

interface UsersTableProps {
  dark: boolean;
}

interface User {
  name: string;
  email: string;
  role: string;
  status: "active" | "pending" | "blocked";
  trips: number;
}

interface UserRowProps {
  user: User;
  index: number;
  dark: boolean;
  onSelectUser?: (name: string) => void;
}

export default function UsersTable({ dark }: UsersTableProps) {
  return (
    <div className={`overflow-hidden rounded-3xl border p-6 shadow-sm  transition-all duration-300 ${dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className={`text-sm font-semibold ${dark ? "text-gray-100" : "text-gray-900"}`}>Recent users</div>
          <div className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}>Last signups &amp; status</div>
        </div>
        <button className="text-xs font-medium text-purple-500 hover:text-purple-400">View all</button>
      </div>

      <div
        className={`grid text-xs  overflow-hidden font-medium mb-2 pb-1 border-b ${dark ? "text-gray-500 border-gray-800" : "text-gray-400 border-gray-100"}`}
        style={{ gridTemplateColumns: "1.6fr 1.5fr 0.8fr 0.7fr 0.4fr" }}
      >
        <span>Name</span>
        <span>Email</span>
        <span>Role</span>
        <span>Status</span>
        <span>Trips</span>
      </div>

      <div className="flex flex-col">
        {USERS.map((user, i) => (
          <UserRow
            key={user.name}
            user={user as User}
            index={i}
            dark={dark}
          />
        ))}
      </div>
    </div>
  );
}

function UserRow({ user, index, dark, onSelectUser }: UserRowProps) {
  return (
    <div
      className={`grid text-xs py-2.5 items-center rounded-lg px-1 transition-colors 
       ${dark ? "hover:bg-gray-800 border-gray-800" : "hover:bg-violet-50 border-gray-100"} ${
        index > 0 ? "border-t" : ""
      }`}
      style={{ gridTemplateColumns: "1.6fr 1.5fr 0.8fr 0.7fr 0.4fr" }}
    >
      <span className={`font-medium flex items-center gap-1.5 ${dark ? "text-gray-100" : "text-gray-900"}`}>
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
          alt={user.name}
          className="w-5 h-5 rounded-full bg-violet-100 shrink-0"
        />
        {user.name}
      </span>
      <span className={dark ? "text-gray-400" : "text-gray-500"}>{user.email}</span>
      <span>
        <span className={`px-2 py-0.5 rounded-full text-xs ${dark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
          {user.role}
        </span>
      </span>
      <span>
        <span className={`px-2 py-0.5 rounded-full text-xs ${STATUS_STYLES[user.status]}`}>
          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
        </span>
      </span>
      <span className={`font-medium ${dark ? "text-gray-100" : "text-gray-900"}`}>{user.trips}</span>
    </div>
  );
}