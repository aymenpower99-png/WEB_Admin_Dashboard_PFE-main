export interface Driver {
  id: number;
  first: string;
  last: string;
  phone: string;
  email: string;
  lang: string;
  status: "online" | "busy" | "offline";
  vehicle: string;
  plate: string;
  trips: number;
  earnings: number;
  rating: number;
  seed: string;
}

export interface DriversPageProps {
  drivers: Driver[];
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
  onNavigate: (page: string, prefill?: Driver | null) => void;
}

/* Keep your seed data exactly as before */
export const INITIAL_DRIVERS: Driver[] = [
  { id:1,  first:"John",    last:"Doe",       phone:"+1 555-0101", email:"john.doe@email.com",     lang:"English", status:"online",  vehicle:"Toyota Corolla",  plate:"ABC-1234", trips:24, earnings:560, rating:4.8, seed:"John"    },
  { id:2,  first:"Emily",   last:"Ross",      phone:"+1 555-0102", email:"emily.ross@email.com",   lang:"French",  status:"busy",    vehicle:"Hyundai i10",     plate:"DEF-5678", trips:18, earnings:480, rating:4.6, seed:"Emily"   },
  { id:3,  first:"Mike",    last:"Smith",     phone:"+1 555-0103", email:"mike.smith@email.com",   lang:"English", status:"offline", vehicle:"Kia Rio",          plate:"GHI-9012", trips:12, earnings:300, rating:4.3, seed:"Mike"    },
  { id:4,  first:"Sara",    last:"Lee",       phone:"+1 555-0104", email:"sara.lee@email.com",     lang:"Arabic",  status:"online",  vehicle:"Dacia Logan",      plate:"JKL-3456", trips:31, earnings:720, rating:4.9, seed:"Sara"    },
  { id:5,  first:"Ahmed",   last:"Ben Ali",   phone:"+1 555-0105", email:"ahmed.b@email.com",      lang:"Arabic",  status:"busy",    vehicle:"Peugeot 301",      plate:"MNO-7890", trips:9,  earnings:210, rating:4.1, seed:"Ahmed"   },
  { id:6,  first:"Karim",   last:"Hassan",    phone:"+1 555-0106", email:"karim.h@email.com",      lang:"French",  status:"offline", vehicle:"Renault Symbol",   plate:"PQR-1234", trips:6,  earnings:160, rating:4.0, seed:"Karim"   },
  { id:7,  first:"Lina",    last:"Nour",      phone:"+1 555-0107", email:"lina.n@email.com",       lang:"English", status:"online",  vehicle:"Toyota Yaris",     plate:"STU-5678", trips:19, earnings:450, rating:4.5, seed:"Lina"    },
  { id:8,  first:"Youssef", last:"Mansour",   phone:"+1 555-0108", email:"youssef.m@email.com",    lang:"Arabic",  status:"busy",    vehicle:"Kia Picanto",      plate:"VWX-9012", trips:22, earnings:520, rating:4.7, seed:"Youssef" },
  { id:9,  first:"Nadia",   last:"Ferhat",    phone:"+1 555-0109", email:"nadia.f@email.com",      lang:"French",  status:"online",  vehicle:"Peugeot 208",      plate:"YZA-1111", trips:15, earnings:390, rating:4.4, seed:"Nadia"   },
  { id:10, first:"Omar",    last:"Trabelsi",  phone:"+1 555-0110", email:"omar.t@email.com",       lang:"Arabic",  status:"offline", vehicle:"Volkswagen Polo",  plate:"BCD-2222", trips:8,  earnings:200, rating:4.2, seed:"Omar"    },
  { id:11, first:"Sofia",   last:"Martin",    phone:"+1 555-0111", email:"sofia.m@email.com",      lang:"French",  status:"busy",    vehicle:"Citroën C3",       plate:"EFG-3333", trips:27, earnings:640, rating:4.8, seed:"Sofia"   },
  { id:12, first:"Tarek",   last:"Bouaziz",   phone:"+1 555-0112", email:"tarek.b@email.com",      lang:"Arabic",  status:"online",  vehicle:"Hyundai Accent",   plate:"HIJ-4444", trips:33, earnings:780, rating:4.9, seed:"Tarek"   },
];