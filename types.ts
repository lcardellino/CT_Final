export enum VehicleType {
  SPRINTER_19 = 'SPRINTER 19 ASIENTOS',
  MINIBUS_BUS = '24 - 44 - 46 ASIENTOS',
  BUS_60 = '60 ASIENTOS'
}

export interface DriverItem {
  id: string;
  label: string;
  qty: number;
  unitPrice: number;
}

export interface QuoteState {
  unidades: number;
  kmProductivos: number;
  kmDestino: number;
  kmImproductivos: number;
  pasajeros: number;
  vehicleType: VehicleType;
  discount: number; // Porcentaje de descuento (0-100)
  
  // Driver Provincial
  driverProvincial: {
    jornada: DriverItem;
    viatico: DriverItem;
    tomeYDeje: DriverItem;
    hExtra: DriverItem;
    cama: DriverItem;
  };

  // Driver National
  driverNational: {
    desayuno: DriverItem;
    almuerzo: DriverItem;
    merienda: DriverItem;
    cena: DriverItem;
    cama: DriverItem;
    viaticos: number; // Calculated sum usually, but here we track components
  };
}

export interface BudgetDetails {
  contactName: string;
  phone: string;
  date: string; // Issue date
  
  departureDate: string;
  departureTime: string;
  returnDate: string;
  returnTime: string;
  
  origin: string;
  destination: string;
  returnTo: string;
  
  description: string;
}

export const INITIAL_QUOTE_STATE: QuoteState = {
  unidades: 1,
  kmProductivos: 0,
  kmDestino: 0,
  kmImproductivos: 0,
  pasajeros: 0,
  vehicleType: VehicleType.MINIBUS_BUS,
  discount: 0,
  driverProvincial: {
    jornada: { id: 'jornada', label: 'JORNADA CHOFER', qty: 0, unitPrice: 63199 },
    viatico: { id: 'viatico', label: 'VIATICO', qty: 0, unitPrice: 13574 },
    tomeYDeje: { id: 'tomeYDeje', label: 'TOME Y DEJE', qty: 0, unitPrice: 4597 },
    hExtra: { id: 'hExtra', label: 'H. EXTRA', qty: 0, unitPrice: 9196 },
    cama: { id: 'cama', label: 'CAMA', qty: 0, unitPrice: 21591 },
  },
  driverNational: {
    desayuno: { id: 'desayuno', label: 'DESAYUNO', qty: 0, unitPrice: 3624 },
    almuerzo: { id: 'almuerzo', label: 'ALMUERZO', qty: 0, unitPrice: 13337 },
    merienda: { id: 'merienda', label: 'MERIENDA', qty: 0, unitPrice: 3624 },
    cena: { id: 'cena', label: 'CENA', qty: 0, unitPrice: 13337 },
    cama: { id: 'cama', label: 'CAMA', qty: 0, unitPrice: 21591 },
    viaticos: 0
  }
};

// Helper to get today's date in YYYY-MM-DD format for input type="date"
const getTodayISO = () => new Date().toISOString().split('T')[0];

export const INITIAL_BUDGET_DETAILS: BudgetDetails = {
  contactName: '',
  phone: '',
  date: getTodayISO(),
  departureDate: '',
  departureTime: '00:00',
  returnDate: '',
  returnTime: '00:00',
  origin: '',
  destination: '',
  returnTo: '',
  description: 'Traslado privado'
};