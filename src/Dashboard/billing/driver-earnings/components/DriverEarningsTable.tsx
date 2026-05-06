import type { DriverEarningRecord } from "../../../../api/billing";
import { TH, TD } from "./DriverEarningsTypes";
import DriverEarningsTableRow from "./DriverEarningsTableRow";

const COLUMNS = ["#", "Driver", "Rides", "Salary", "Commission", "Net Earnings", "Actions"];

interface Props {
  data:      DriverEarningRecord[];
  loading:   boolean;
  page:      number;
  onRefresh: () => void;
}

export default function DriverEarningsTable({ data, loading, page, onRefresh }: Props) {
  return (
    <table className="ts-table">
      <thead>
        <tr>
          {COLUMNS.map((h, i) => (
            <th
              key={h}
              style={i === COLUMNS.length - 1 ? { ...TH, textAlign: "center" as const } : TH}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {loading ? (
          <tr>
            <td
              colSpan={7}
              style={{ ...TD, textAlign: "center" as const, color: "var(--text-faint)", height: 120 }}
            >
              Loading…
            </td>
          </tr>
        ) : data.length === 0 ? (
          <tr>
            <td
              colSpan={7}
              style={{ ...TD, textAlign: "center" as const, color: "var(--text-faint)", height: 120 }}
            >
              No earnings found for this month.
            </td>
          </tr>
        ) : (
          data.map((d, i) => (
            <DriverEarningsTableRow
              key={d.driverProfileId}
              record={d}
              index={(page - 1) * 5 + i + 1}
              onRefresh={onRefresh}
            />
          ))
        )}
      </tbody>
    </table>
  );
}

