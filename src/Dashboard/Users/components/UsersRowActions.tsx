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

// Shared Tailwind classes for every action button
const BTN_CLS = "ts-icon-btn w-[30px] h-[30px] flex items-center justify-center rounded-md shrink-0";

export default function UsersRowActions({
  user, actionLoading,
  onEdit, onBlock, onUnblock, onResend, onCompleteProfile, onDelete,
}: Props) {

  const needsProfileCompletion =
    user.role === "driver" &&
    user.status === "active" &&
    user.profileComplete === false;

  return (
    // gap-2 = 0.5rem — previously 0.3rem, gives icons more breathing room
    <div className="flex items-center gap-2 flex-nowrap">

      {/* Edit — always */}
      <button title="Edit user" className={BTN_CLS} onClick={onEdit}>
        <Edit2 size={13} />
      </button>

      {/* Block — when not blocked */}
      {user.status !== "blocked" && (
        <button title="Block user"
          className={`${BTN_CLS} ts-icon-btn-del`}
          disabled={actionLoading === user.id + "-block"}
          onClick={onBlock}>
          <ShieldX size={13} />
        </button>
      )}

      {/* Unblock — when blocked */}
      {user.status === "blocked" && (
        <button title="Unblock user"
          className={`${BTN_CLS} text-[#059669]`}
          disabled={actionLoading === user.id + "-unblock"}
          onClick={onUnblock}>
          <ShieldCheck size={13} />
        </button>
      )}

      {/* Resend invite — when pending */}
      {user.status === "pending" && (
        <button title="Resend invitation"
          className={`${BTN_CLS} text-[#d97706]`}
          disabled={actionLoading === user.id + "-resend"}
          onClick={onResend}>
          <Mail size={13} />
        </button>
      )}

      {/* Complete driver profile — active driver WITHOUT profile yet */}
      {needsProfileCompletion && (
        <button
          title="Setup Driver Profile"
          className={BTN_CLS}
          onClick={onCompleteProfile}
          style={{ background:"#fff7ed", color:"#ea580c", border:"1px solid #fed7aa" }}>
          <UserCog size={13} />
        </button>
      )}

      {/* Delete — always */}
      <button title="Delete user"
        className={`${BTN_CLS} ts-icon-btn-del text-[#dc2626]`}
        disabled={actionLoading === user.id + "-delete"}
        onClick={onDelete}>
        <Trash2 size={13} />
      </button>

    </div>
  );
}