import type { TripPaymentRecord } from "../../../../api/billing";
import { TH, TD } from "./TripPaymentsTypes";
import TripPaymentsTableRow from "./TripPaymentsTableRow";

const COLUMNS = ["Ride ID", "Pickup", "Drop-off", "Method", "Amount", "Status"];

interface Props {
  payments: TripPaymentRecord[];
  loading:  boolean;
}

export default function TripPaymentsTable({ payments, loading }: Props) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: "11%" }} />
          <col style={{ width: "23%" }} />
          <col style={{ width: "23%" }} />
          <col style={{ width: "13%" }} />
          <col style={{ width: "13%" }} />
          <col style={{ width: "17%" }} />
        </colgroup>

        <thead>
          <tr>
            {COLUMNS.map((h) => <th key={h} style={TH}>{h}</th>)}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={6}
                style={{ ...TD, textAlign: "center" as const, color: "var(--text-faint)", height: 120 }}
              >
                Loading…
              </td>
            </tr>
          ) : payments.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                style={{ ...TD, textAlign: "center" as const, color: "var(--text-faint)", height: 120 }}
              >
                No payments found.
              </td>
            </tr>
          ) : (
            payments.map((p) => (
              <TripPaymentsTableRow key={p.id} payment={p} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

