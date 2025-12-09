import React, { useEffect, useState } from 'react';
import { QuoteState, VehicleType, DriverItem } from '../types';
import { VEHICLE_RATES, IVA_RATE } from '../constants';
import { AlertCircle } from 'lucide-react';

interface CalculatorProps {
  state: QuoteState;
  onChange: (newState: QuoteState) => void;
  onTotalChange: (totals: { totalFinal: number; totalWithIva: number }) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ state, onChange, onTotalChange }) => {
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- Calculations ---
  const kmTotalProductivos = state.kmProductivos + state.kmDestino;
  const rates = VEHICLE_RATES[state.vehicleType];
  
  // Cost per ONE vehicle
  const costKmProd = kmTotalProductivos * rates.prod;
  const costKmImprod = state.kmImproductivos * rates.improd;
  const costoUnicoCoche = costKmProd + costKmImprod;

  const calculateDriverCost = (items: Record<string, DriverItem | number>) => {
    let total = 0;
    Object.values(items).forEach(val => {
      if (typeof val === 'object' && val !== null && 'qty' in val) {
        total += val.qty * val.unitPrice;
      }
    });
    return total;
  };

  const costoUnicoChoferProv = calculateDriverCost(state.driverProvincial);
  const costoUnicoChoferNac = calculateDriverCost(state.driverNational);
  
  // TOTALS (Multiplied by Units)
  const units = state.unidades > 0 ? state.unidades : 1;
  const costoTotalCoches = costoUnicoCoche * units;
  const costoTotalChoferProv = costoUnicoChoferProv * units;
  const costoTotalChoferNac = costoUnicoChoferNac * units;

  const subTotal = costoTotalCoches + costoTotalChoferProv + costoTotalChoferNac;
  
  // Apply Discount
  const discountAmount = subTotal * (state.discount / 100);
  const costoFinal = subTotal - discountAmount;
  
  const totalConIVA = costoFinal * IVA_RATE;

  // Propagate totals up for the next step
  useEffect(() => {
    onTotalChange({ totalFinal: costoFinal, totalWithIva: totalConIVA });
  }, [costoFinal, totalConIVA, onTotalChange]);


  // --- Validation Logic ---
  const validateAndSet = (field: string, value: number, updater: () => void) => {
    if (value < 0) {
      setErrors(prev => ({ ...prev, [field]: 'No se admiten valores negativos' }));
      return; 
    }
    // Clear error if valid
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
    updater();
  };

  // --- Handlers ---
  const handleNumChange = (field: keyof QuoteState, value: string) => {
    const numVal = value === '' ? 0 : Number(value);
    validateAndSet(field, numVal, () => {
       onChange({ ...state, [field]: numVal });
    });
  };

  const handleDriverChange = (
    type: 'provincial' | 'national',
    key: string,
    field: 'qty' | 'unitPrice',
    value: string
  ) => {
    const numVal = value === '' ? 0 : Number(value);
    const errorKey = `${type}-${key}-${field}`;
    
    validateAndSet(errorKey, numVal, () => {
        const section = type === 'provincial' ? 'driverProvincial' : 'driverNational';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const currentSection = state[section] as any;
        
        onChange({
          ...state,
          [section]: {
            ...currentSection,
            [key]: {
              ...currentSection[key],
              [field]: numVal
            }
          }
        });
    });
  };

  // --- Formatters ---
  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);
  };

  // Helper for input classes based on error state
  const getInputClass = (errorKey: string, extraClasses = "") => {
    const hasError = !!errors[errorKey];
    return `border rounded p-1.5 focus:outline-none focus:ring-2 transition-all ${
      hasError 
        ? 'border-red-500 focus:ring-red-200 bg-red-50 text-red-700' 
        : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'
    } ${extraClasses}`;
  };

  return (
    <div className="bg-white p-4 md:p-8 rounded-lg shadow-lg max-w-6xl mx-auto space-y-8">
      
      <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4">
        <h2 className="text-3xl font-black text-slate-800 italic uppercase tracking-tighter">
          COTIZADOR DE VIAJES
        </h2>
        <div className="text-right">
          {/* Replaced Text with Image */}
          <img 
            src="https://grupofonobus.com.ar/wp-content/uploads/2025/06/logo-oficial.fw_-1.png" 
            alt="Grupo FonoBus" 
            className="h-12 object-contain"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: KMs and Basic Inputs */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="space-y-4">
            {/* Unidades */}
            <div className="bg-slate-50 p-4 rounded border border-slate-200">
               <label className="flex items-center justify-between mb-1">
                 <span className="font-bold text-slate-700 text-sm">CANTIDAD DE UNIDADES</span>
                 <input 
                  type="number" 
                  min="1"
                  value={state.unidades}
                  onChange={(e) => handleNumChange('unidades', e.target.value)}
                  className={getInputClass('unidades', 'w-20 text-right font-bold')}
                />
               </label>
               {errors['unidades'] && <p className="text-xs text-red-500 text-right flex justify-end items-center gap-1"><AlertCircle size={10} /> {errors['unidades']}</p>}
            </div>

            <label className="flex items-center justify-between bg-emerald-100 p-3 border border-emerald-300 rounded shadow-sm hover:bg-emerald-50 transition-colors relative">
              <span className="font-bold text-emerald-900 text-sm">KM PRODUCTIVOS</span>
              <div className="flex flex-col items-end">
                <input 
                    type="number" 
                    min="0"
                    value={state.kmProductivos}
                    onChange={(e) => handleNumChange('kmProductivos', e.target.value)}
                    className={getInputClass('kmProductivos', 'w-24 text-right')}
                />
                {errors['kmProductivos'] && <span className="text-[10px] text-red-600 absolute bottom-0.5 right-3">{errors['kmProductivos']}</span>}
              </div>
            </label>

            <label className="flex items-center justify-between bg-emerald-100 p-3 border border-emerald-300 rounded shadow-sm hover:bg-emerald-50 transition-colors relative">
              <span className="font-bold text-emerald-900 text-sm">KM EN DESTINO</span>
              <div className="flex flex-col items-end">
                <input 
                    type="number" 
                    min="0"
                    value={state.kmDestino}
                    onChange={(e) => handleNumChange('kmDestino', e.target.value)}
                    className={getInputClass('kmDestino', 'w-24 text-right')}
                />
                {errors['kmDestino'] && <span className="text-[10px] text-red-600 absolute bottom-0.5 right-3">{errors['kmDestino']}</span>}
              </div>
            </label>

            <label className="flex items-center justify-between bg-red-50 p-3 border border-red-200 rounded shadow-sm hover:bg-red-100 transition-colors relative">
              <span className="font-bold text-red-900 text-sm">KM IMPRODUCTIVOS</span>
              <div className="flex flex-col items-end">
                <input 
                    type="number" 
                    min="0"
                    value={state.kmImproductivos}
                    onChange={(e) => handleNumChange('kmImproductivos', e.target.value)}
                    className={getInputClass('kmImproductivos', 'w-24 text-right')}
                />
                {errors['kmImproductivos'] && <span className="text-[10px] text-red-600 absolute bottom-0.5 right-3">{errors['kmImproductivos']}</span>}
              </div>
            </label>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded p-4 space-y-3 text-sm shadow-inner">
            
            {/* Styled "KM TOTAL PROD" to match other fields exactly */}
            <div className="flex items-center justify-between bg-emerald-100 p-3 border border-emerald-300 rounded shadow-sm relative">
              <span className="font-bold text-emerald-900 text-sm">KM TOTAL PRODUCTIVOS</span>
              <div className="flex flex-col items-end">
                <input 
                    type="text" 
                    disabled
                    value={kmTotalProductivos}
                    className="w-24 text-right border border-gray-300 rounded p-1.5 bg-gray-50 text-slate-800 font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-between border-b border-emerald-200 py-2 items-center relative">
              <span className="text-emerald-900">PASAJEROS (por unidad)</span>
              <input 
                type="number" 
                min="0"
                value={state.pasajeros}
                onChange={(e) => handleNumChange('pasajeros', e.target.value)}
                className={getInputClass('pasajeros', 'w-20 text-right')}
              />
               {errors['pasajeros'] && <span className="text-[10px] text-red-600 absolute -bottom-1 right-0">{errors['pasajeros']}</span>}
            </div>

            <div className="flex flex-col gap-1 pt-1">
              <span className="text-emerald-900 font-medium">TIPO UNIDAD</span>
              <select 
                value={state.vehicleType}
                onChange={(e) => onChange({...state, vehicleType: e.target.value as VehicleType})}
                className="w-full text-xs border-gray-300 rounded p-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white shadow-sm text-slate-800 font-medium"
              >
                {Object.values(VehicleType).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center bg-emerald-100 p-4 border border-emerald-400 rounded shadow-sm">
             <div className="flex flex-col">
                <span className="font-bold text-emerald-900">COSTO VEHICULAR</span>
                <span className="text-xs text-emerald-700 font-medium">(Incluye {units} unidades)</span>
             </div>
             <span className="font-bold text-xl text-emerald-800">{formatMoney(costoTotalCoches)}</span>
          </div>
        </div>

        {/* Middle Column: Rates & Provincial Driver */}
        <div className="lg:col-span-4 space-y-6">
            
            {/* Rates Reference Table */}
            <div className="border border-emerald-800 rounded-lg overflow-hidden text-xs shadow-sm">
              <div className="bg-emerald-800 text-white font-bold text-center py-2 tracking-wide">TARIFAS (REFERENCIA UNITARIA)</div>
              {Object.entries(VEHICLE_RATES).map(([key, val]) => (
                <div key={key} className={`border-b last:border-0 transition-colors duration-200 ${state.vehicleType === key ? 'bg-yellow-50' : 'bg-white hover:bg-gray-50'}`}>
                  <div className="bg-emerald-700 text-white px-3 py-1 text-[10px] uppercase font-bold tracking-wider opacity-90">{key}</div>
                  <div className="grid grid-cols-2 text-center divide-x border-t border-emerald-100">
                    <div className="p-2 flex justify-between px-4 items-center">
                      <span className="text-gray-600">$ Km. Prod</span> 
                      <span className="font-bold text-slate-800">{formatMoney(val.prod)}</span>
                    </div>
                    <div className="p-2 flex justify-between px-4 items-center">
                      <span className="text-gray-600">$ Km. Improd</span> 
                      <span className="font-bold text-slate-800">{formatMoney(val.improd)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Provincial Driver Table */}
            <div className="border border-emerald-300 rounded-lg overflow-hidden shadow-sm">
               <div className="bg-emerald-800 text-white font-bold text-center py-3 text-sm uppercase tracking-wide">Costo Conductor Provincial</div>
               <table className="w-full text-xs">
                 <tbody>
                    {Object.entries(state.driverProvincial).map(([key, val]) => {
                      const item = val as DriverItem;
                      const errorKey = `provincial-${key}-qty`;
                      return (
                      <tr key={key} className="border-b last:border-0 odd:bg-white even:bg-slate-100 hover:bg-emerald-50 transition-colors">
                        <td className="p-4 font-medium text-slate-700 text-sm">{item.label}</td>
                        <td className="p-2 w-24 relative">
                          <input 
                            type="number"
                            min="0"
                            value={item.qty}
                            onChange={(e) => handleDriverChange('provincial', key, 'qty', e.target.value)}
                            className={getInputClass(errorKey, 'w-full text-center text-sm')}
                            placeholder="0"
                          />
                          {errors[errorKey] && <div className="absolute top-0 right-0 -mt-1 -mr-1 text-red-500"><AlertCircle size={12} /></div>}
                        </td>
                        <td className="p-4 text-right font-medium text-slate-600 text-sm">{formatMoney((item.qty * item.unitPrice) * units)}</td>
                      </tr>
                    )})}
                    <tr className="bg-emerald-100 font-bold text-emerald-900 border-t border-emerald-200">
                      <td colSpan={2} className="p-4 text-sm">TOTAL CHOFERES PROV.</td>
                      <td className="p-4 text-right text-base">{formatMoney(costoTotalChoferProv)}</td>
                    </tr>
                 </tbody>
               </table>
            </div>

        </div>

        {/* Right Column: National Driver & Final Totals */}
        <div className="lg:col-span-4 space-y-6">
            
            {/* National Driver Table */}
            <div className="border border-emerald-300 rounded-lg overflow-hidden shadow-sm">
               <div className="bg-emerald-800 text-white font-bold text-center py-3 text-sm uppercase tracking-wide">Viaticos Nacional</div>
               <table className="w-full text-xs">
                 <tbody>
                    {Object.entries(state.driverNational).filter(([k]) => k !== 'viaticos').map(([key, val]) => {
                       const item = val as DriverItem;
                       const errorKey = `national-${key}-qty`;
                       return (
                       <tr key={key} className="border-b last:border-0 odd:bg-white even:bg-slate-100 hover:bg-emerald-50 transition-colors">
                       <td className="p-4 font-medium text-slate-700 text-sm">{item.label}</td>
                       <td className="p-2 w-24 relative">
                         <input 
                           type="number"
                           min="0"
                           value={item.qty}
                           onChange={(e) => handleDriverChange('national', key, 'qty', e.target.value)}
                           className={getInputClass(errorKey, 'w-full text-center text-sm')}
                           placeholder="0"
                         />
                         {errors[errorKey] && <div className="absolute top-0 right-0 -mt-1 -mr-1 text-red-500"><AlertCircle size={12} /></div>}
                       </td>
                       <td className="p-4 text-right font-medium text-slate-600 text-sm">{formatMoney((item.qty * item.unitPrice) * units)}</td>
                     </tr>
                    )})}
                    <tr className="bg-emerald-100 font-bold text-emerald-900 border-t border-emerald-200">
                      <td colSpan={2} className="p-4 text-sm">TOTAL VIATICOS</td>
                      <td className="p-4 text-right text-base">{formatMoney(costoTotalChoferNac)}</td>
                    </tr>
                 </tbody>
               </table>
            </div>

            {/* Final Cost Box */}
            <div className="border-2 border-yellow-500 rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-[1.01]">
              <div className="bg-yellow-400 text-slate-900 font-black text-center py-3 uppercase tracking-wider text-lg">Costo del Viaje</div>
              <div className="bg-yellow-50 p-5 space-y-3 text-sm font-medium">
                 {units > 1 && (
                   <div className="text-center bg-yellow-100 text-yellow-800 p-1 rounded font-bold mb-2 border border-yellow-200">
                     Cotizando por {units} Unidades
                   </div>
                 )}
                 <div className="flex justify-between items-center">
                    <span className="text-slate-700">COSTO VEHICULAR</span>
                    <span className="font-bold">{formatMoney(costoTotalCoches)}</span>
                 </div>
                 <div className="flex justify-between items-center text-slate-500">
                    <span>COSTO VIATICOS</span>
                    <span>{formatMoney(costoTotalChoferNac)}</span>
                 </div>
                 <div className="flex justify-between items-center text-slate-500">
                    <span>COSTO CHOFER PROV</span>
                    <span>{formatMoney(costoTotalChoferProv)}</span>
                 </div>

                 {/* Discount Input Section */}
                 <div className="border-t border-dashed border-yellow-300 my-2 pt-2">
                    <label className="flex justify-between items-center">
                       <span className="text-slate-700 font-bold">Descuento (%)</span>
                       <input 
                         type="number"
                         min="0"
                         max="100"
                         value={state.discount}
                         onChange={(e) => handleNumChange('discount', e.target.value)}
                         className="w-16 text-center border border-yellow-300 rounded p-1 text-sm bg-white"
                       />
                    </label>
                    {discountAmount > 0 && (
                        <div className="flex justify-between items-center text-red-500 text-xs mt-1">
                            <span>Monto Descontado</span>
                            <span>- {formatMoney(discountAmount)}</span>
                        </div>
                    )}
                 </div>

                 <div className="h-px bg-yellow-300 my-3"></div>
                 <div className="flex justify-between items-center font-bold text-lg text-slate-800">
                    <span>COSTO FINAL</span>
                    <span>{formatMoney(costoFinal)}</span>
                 </div>
                 <div className="flex justify-between items-center font-black text-xl text-yellow-800 bg-yellow-200 p-3 rounded shadow-sm mt-2">
                    <span>TOTAL CON IVA</span>
                    <span>{formatMoney(totalConIVA)}</span>
                 </div>
              </div>
            </div>

        </div>

      </div>
    </div>
  );
};