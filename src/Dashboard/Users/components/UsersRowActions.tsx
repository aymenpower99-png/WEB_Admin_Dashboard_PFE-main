import { Edit2, ShieldX, ShieldCheck, Mail, Trash2, UserCog } from "lucide-react";
import type { AdminUser } from "../../../api/users";

interface Props {
  user:              AdminUser;
  actionLoading:     string | null;
  onEdit:            () => void;
  onBlock:           () => void;
  onUnblock:         () => void;
  onResend:          () => void;
  onCompleteProfile: () => void;
  onDelete:          () => void;
}

const BTN: React.CSSProperties = {
  width:30, height:30, display:"flex", alignItems:"center",
  justifyContent:"center", borderRadius:"0.375rem", flexShrink:0,
};

export default function UsersRowActions({
  user, actionLoading,
  onEdit, onBlock, onUnblock, onResend, onCompleteProfile, onDelete,
}: Props) {

  const needsProfileCompletion =
    user.role === "driver" &&
    user.status === "active" &&
    user.profileComplete === false;

  return (
    <div style={{ display:"flex", alignItems:"center", gap:"0.3rem", flexWrap:"nowrap" }}>

      {/* Edit — always */}
      <button title="Edit user" className="ts-icon-btn" onClick={onEdit} style={BTN}>
        <Edit2 size={13} />
      </button>

      {/* Block — when not blocked */}
      {user.status !== "blocked" && (
        <button title="Block user" className="ts-icon-btn ts-icon-btn-del"
          disabled={actionLoading === user.id + "-block"}
          onClick={onBlock} style={BTN}>
          <ShieldX size={13} />
        </button>
      )}

      {/* Unblock — when blocked */}
      {user.status === "blocked" && (
        <button title="Unblock user" className="ts-icon-btn"
          disabled={actionLoading === user.id + "-unblock"}
          onClick={onUnblock} style={{ ...BTN, color:"#059669" }}>
          <ShieldCheck size={13} />
        </button>
      )}

      {/* Resend invite — when pending */}
      {user.status === "pending" && (
        <button title="Resend invitation" className="ts-icon-btn"
          disabled={actionLoading === user.id + "-resend"}
          onClick={onResend} style={{ ...BTN, color:"#d97706" }}>
          <Mail size={13} />
        </button>
      )}

      {/* Complete driver profile — active driver WITHOUT profile yet */}
      {needsProfileCompletion && (
        <button
          title="Setup Driver Profile"
          className="ts-icon-btn"
          onClick={onCompleteProfile}
          style={{ ...BTN, background:"#fff7ed", color:"#ea580c", border:"1px solid #fed7aa", cursor:"pointer" }}
        >
          <UserCog size={13} />
        </button>
      )}

      {/* Delete — always */}
      <button title="Delete user" className="ts-icon-btn ts-icon-btn-del"
        disabled={actionLoading === user.id + "-delete"}
        onClick={onDelete}
        style={{ ...BTN, color:"#dc2626" }}>
        <Trash2 size={13} />
      </button>

    </div>
  );
}