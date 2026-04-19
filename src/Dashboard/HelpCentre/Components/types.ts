export type TicketStatus = "Open" | "In Progress" | "Pending" | "Resolved";
export type UserRole = "Passenger" | "Driver";
export type TicketCategory = "Ride" | "Payment" | "Account" | "Technical" | "App Bug";

export interface InternalNote {
  id: string;
  adminName: string;
  timestamp: string;
  content: string;
}

export interface Message {
  id: string;
  sender: string;
  senderType: "user" | "admin";
  content: string;
  timestamp: string;
}

export interface ActivityEvent {
  id: string;
  type: "created" | "status_change" | "admin_reply" | "resolved" | "escalated";
  description: string;
  timestamp: string;
  actor?: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;       // ← ticket description from backend
  status: TicketStatus;
  role: UserRole;
  category: TicketCategory;
  time: string;
  user: {
    name: string;
    role: UserRole;
    memberSince: string;
    email: string;
    phone: string;
  };
  trip: {
    tripId: string;
    date: string;
    route: string;
    price: string;
    status: string;
    pickupAddress?: string;
    dropOffAddress?: string;
    passengerName?: string;
  };
  payment: {
    method: string;
    transactionStatus: string;
  };
  notes: InternalNote[];
  messages: Message[];
  activity: ActivityEvent[];
}