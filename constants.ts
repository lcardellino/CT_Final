import { VehicleType } from './types';

export const VEHICLE_RATES = {
  [VehicleType.SPRINTER_19]: { prod: 1800, improd: 1500 },
  [VehicleType.MINIBUS_BUS]: { prod: 2600, improd: 2400 },
  [VehicleType.BUS_60]: { prod: 3000, improd: 3000 },
};

export const IVA_RATE = 1.105; // 10.5% based on calculation in image (859540 -> 949792)

export const COMPANY_INFO = {
  name: 'EMPRENDIMIENTOS SRL',
  address: 'Dirección: Sierras Grandes 21 - B° Yapeyú - Córdoba.',
  email: 'Correo: viajesespeciales@grupofonobus.com.ar',
  phone: 'Telefono: 351-6617222'
};