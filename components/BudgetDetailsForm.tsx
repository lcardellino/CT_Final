import React from 'react';
import { BudgetDetails } from '../types';

interface BudgetDetailsFormProps {
  data: BudgetDetails;
  onChange: (data: BudgetDetails) => void;
}

export const BudgetDetailsForm: React.FC<BudgetDetailsFormProps> = ({ data, onChange }) => {
  
  const handleChange = (field: keyof BudgetDetails, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-6xl mx-auto mt-8">
      <h3 className="text-xl font-bold text-slate-700 mb-6 border-b pb-2">Datos del Presupuesto (Para PDF)</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Contact Info */}
        <div className="space-y-4">
           <h4 className="font-semibold text-sm text-emerald-800 uppercase">Cliente</h4>
           <div className="grid grid-cols-1 gap-3">
              <label className="block text-sm">
                <span className="text-gray-600">Contacto / Empresa:</span>
                <input 
                  type="text" 
                  value={data.contactName}
                  onChange={(e) => handleChange('contactName', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm border p-2"
                  placeholder="Nombre del cliente"
                />
              </label>
              <label className="block text-sm">
                <span className="text-gray-600">Telefono:</span>
                <input 
                  type="tel" 
                  value={data.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm border p-2"
                  placeholder="351..."
                />
              </label>
              <label className="block text-sm">
                <span className="text-gray-600">Fecha Presupuesto:</span>
                <input 
                  type="date" 
                  value={data.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm border p-2"
                />
              </label>
           </div>
        </div>

        {/* Trip Logistics */}
        <div className="space-y-4">
           <h4 className="font-semibold text-sm text-emerald-800 uppercase">Logística</h4>
           <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm">
                <span className="text-gray-600">Fecha Salida:</span>
                <input 
                  type="date" 
                  value={data.departureDate}
                  onChange={(e) => handleChange('departureDate', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded border p-2 text-sm"
                />
              </label>
              <label className="block text-sm">
                <span className="text-gray-600">Hora Salida:</span>
                <input 
                  type="time" 
                  value={data.departureTime}
                  onChange={(e) => handleChange('departureTime', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded border p-2 text-sm"
                />
              </label>
              <label className="block text-sm">
                <span className="text-gray-600">Fecha Regreso:</span>
                <input 
                  type="date" 
                  value={data.returnDate}
                  onChange={(e) => handleChange('returnDate', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded border p-2 text-sm"
                />
              </label>
              <label className="block text-sm">
                <span className="text-gray-600">Hora Regreso:</span>
                <input 
                  type="time" 
                  value={data.returnTime}
                  onChange={(e) => handleChange('returnTime', e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded border p-2 text-sm"
                />
              </label>
           </div>
           
           <div className="space-y-2">
            <label className="block text-sm">
                <span className="text-gray-600">Origen:</span>
                <input 
                  type="text" 
                  value={data.origin}
                  onChange={(e) => handleChange('origin', e.target.value)}
                  className="w-full border-gray-300 rounded border p-2 text-sm"
                />
              </label>
              <label className="block text-sm">
                <span className="text-gray-600">Destino:</span>
                <input 
                  type="text" 
                  value={data.destination}
                  onChange={(e) => handleChange('destination', e.target.value)}
                  className="w-full border-gray-300 rounded border p-2 text-sm"
                />
              </label>
              <label className="block text-sm">
                <span className="text-gray-600">Regreso:</span>
                <input 
                  type="text" 
                  value={data.returnTo}
                  onChange={(e) => handleChange('returnTo', e.target.value)}
                  className="w-full border-gray-300 rounded border p-2 text-sm"
                />
              </label>
           </div>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
            <label className="block text-sm">
                <span className="text-gray-600">Descripción del Servicio:</span>
                <input 
                  type="text" 
                  value={data.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full border-gray-300 rounded border p-2 text-sm"
                  placeholder="Ej: Traslado privado (19 asientos)"
                />
              </label>
        </div>

      </div>
    </div>
  );
};