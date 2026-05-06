import type { TripPaymentRecord } from "../../../../api/billing";
import { formatId } from "../../../../api/billing";
import { TD, ROW_H } from "./TripPaymentsTypes";
import TripPaymentsStatusPill from "./TripPaymentsStatusPill";

interface Props {
  payment: TripPaymentRecord;
}

export default function TripPaymentsTableRow({ payment }: Props) {
  return (
    <tr className="ts-tr" style={{ height: ROW_H }}>

      {/* Ride ID */}
      <td style={TD}>
        <span
          className="font-mono"
          style={{ fontSize: ".78rem", fontWeight: 700, color: "var(--text-h)" }}
        >
          {formatId("TRP", payment.rideId)}
        </span>
      </td>

      {/* Pickup — plain text, no icon */}
      <td style={TD}>
        <span
          style={{
            fontSize:     ".78rem",
            color:        "var(--text-body)",
            display:      "block",
            overflow:     "hidden",
            textOverflow: "ellipsis",
            whiteSpace:   "nowrap",
          }}
        >
          {(payment as any).ride?.pickupAddress ?? "—"}
        </span>
      </td>

      {/* Drop-off — plain text, no icon */}
      <td style={TD}>
        <span
          style={{
            fontSize:     ".78rem",
            color:        "var(--text-body)",
            display:      "block",
            overflow:     "hidden",
            textOverflow: "ellipsis",
            whiteSpace:   "nowrap",
          }}
        >
          {(payment as any).ride?.dropoffAddress ?? "—"}
        </span>
      </td>

      {/* Method */}
      <td style={TD}>
        <span style={{ fontSize: ".78rem", color: "var(--text-muted)" }}>
          {payment.paymentMethod ?? "—"}
        </span>
      </td>

      {/* Amount */}
      <td style={TD}>
        <span style={{ fontSize: ".82rem", fontWeight: 700, color: "var(--text-h)" }}>
          {payment.amount.toFixed(2)} TND
        </span>
      </td>

      {/* Status */}
      <td style={TD}>
        <TripPaymentsStatusPill status={payment.paymentStatus} />
      </td>
    </tr>
  );
}
