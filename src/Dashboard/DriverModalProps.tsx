import { X } from "lucide-react";

interface DriverModalProps {
  isOpen: boolean;
  onClose: () => void;
}
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
const revenueData = [
  { month: "Jan", revenue: 1200 },
  { month: "Feb", revenue: 2100 },
  { month: "Mar", revenue: 1800 },
  { month: "Apr", revenue: 2400 },
  { month: "May", revenue: 3000 },
  { month: "Jun", revenue: 2700 },
];
export default function DriverModal({ isOpen, onClose }: DriverModalProps) {
  if (!isOpen) return null;

  return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">      
      {/* Modal Container */}
<div className="w-full max-w-xl max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col">        
        {/* Header */}
        <div className="flex items-start justify-between px-8 py-6 border-b">
          <div className="flex items-center gap-4">
            <img
              src="https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F25-35%2FEuropean%2F2"
              alt="Driver"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Thomas Anderson
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Mercedes E-Class • ID: DRV-8492
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
<div className="p-6 space-y-8 overflow-y-auto">          
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl border">
              <p className="text-xs text-gray-500 mb-2">Total Trips (YTD)</p>
              <p className="text-xl font-semibold text-gray-900">124</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border">
              <p className="text-xs text-gray-500 mb-2">Generated Revenue</p>
              <p className="text-xl font-semibold text-gray-900">€8,450.00</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border">
              <p className="text-xs text-gray-500 mb-2">Pending Payout</p>
              <p className="text-xl font-semibold text-orange-500">
                €420.00
              </p>
            </div>
          </div>
{/* Revenue Chart */}
<div className="bg-white border rounded-xl p-6">
  <h3 className="text-sm font-semibold text-gray-900 mb-4">
    Revenue Overview (Last 6 Months)
  </h3>

  <div className="w-full h-64">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={revenueData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="revenue"
          strokeWidth={3}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>
          {/* Payout Section */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 space-y-4">
            
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                Initiate Payout
              </h3>
              <p className="text-sm text-gray-500">
                Pending Balance:{" "}
                <span className="font-semibold text-purple-600">
                  €420.00
                </span>
              </p>
            </div>

            <div className="flex gap-4">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  €
                </span>
                <input
                  type="text"
                  defaultValue="420.00"
                  className="w-full h-11 pl-8 pr-4 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button className="h-11 px-6 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition">
                Send Payment
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}