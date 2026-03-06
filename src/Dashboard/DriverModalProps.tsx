import { X } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import './travelsync-design-system.css'
interface DriverModalProps { isOpen: boolean; onClose: () => void; }

const revenueData = [
  { month:"Jan",revenue:1200 },{ month:"Feb",revenue:2100 },{ month:"Mar",revenue:1800 },
  { month:"Apr",revenue:2400 },{ month:"May",revenue:3000 },{ month:"Jun",revenue:2700 },
];

export default function DriverModal({ isOpen, onClose }: DriverModalProps) {
  if (!isOpen) return null;
  return (
    <div className="ts-overlay" onClick={(e)=>e.target===e.currentTarget&&onClose()}>
      <div className="ts-modal ts-modal-lg ts-modal-scroll">
        {/* Header */}
        <div className="ts-modal-header">
          <div className="flex items-center gap-4">
            <img src="https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F25-35%2FEuropean%2F2"
              alt="Driver" className="w-12 h-12 rounded-full object-cover" />
            <div>
              <h2 className="ts-page-title text-base font-semibold">Thomas Anderson</h2>
              <p className="ts-muted text-sm mt-1">Mercedes E-Class · ID: DRV-8492</p>
            </div>
          </div>
          <button className="ts-modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Body */}
        <div className="ts-modal-body">
          {/* Stats */}
          <div className="ts-grid-4" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
            {[
              { label:"Total Trips (YTD)", value:"124",      color:"ts-td-h" },
              { label:"Generated Revenue", value:"€8,450.00",color:"ts-td-h" },
              { label:"Pending Payout",    value:"€420.00",  color:"text-orange-500" },
            ].map((s) => (
              <div key={s.label} className="ts-card-inner" style={{ padding: "1rem" }}>
                <p className="ts-muted text-xs mb-2">{s.label}</p>
                <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="ts-card" style={{ padding: "1.5rem" }}>
            <h3 className="ts-td-h text-sm font-semibold mb-4">Revenue Overview (Last 6 Months)</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payout */}
          <div className="ts-payout-box">
            <div className="flex items-center justify-between mb-4">
              <h3 className="ts-td-h text-sm font-semibold">Initiate Payout</h3>
              <p className="ts-muted text-sm">Pending Balance: <span className="font-semibold text-violet-600">€420.00</span></p>
            </div>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <span className="ts-muted absolute left-4 top-1/2 -translate-y-1/2">€</span>
                <input type="text" defaultValue="420.00"
                  className="ts-input" style={{ paddingLeft: "2rem" }} />
              </div>
              <button className="ts-btn-primary" style={{ height: "2.75rem", padding: "0 1.5rem", fontSize: ".875rem" }}>
                Send Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}