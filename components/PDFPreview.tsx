import React from 'react';
import { QuoteState, BudgetDetails } from '../types';
import { COMPANY_INFO, IVA_RATE } from '../constants';

interface PDFPreviewProps {
  quoteState: QuoteState;
  budgetDetails: BudgetDetails;
  finalCost: number;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({ quoteState, budgetDetails, finalCost }) => {
  
  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 }).format(val);
  };

  const totalWithIva = finalCost * IVA_RATE;
  
  // Create a display description including unit count
  const unitsText = quoteState.unidades > 1 ? ` (${quoteState.unidades} Unidades)` : '';
  const displayDescription = budgetDetails.description || `Traslado privado`;

  // Format date for display (since input is now YYYY-MM-DD)
  const formatDate = (isoDate: string) => {
    if (!isoDate) return '-';
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  };

  // Calculate discount impact for display (since finalCost is already discounted, we reverse engineer subtotal for the PDF display)
  const discountDecimal = quoteState.discount / 100;
  // finalCost = subTotal * (1 - discountDecimal)
  // subTotal = finalCost / (1 - discountDecimal)
  const subTotal = quoteState.discount > 0 ? finalCost / (1 - discountDecimal) : finalCost;
  const discountAmount = subTotal - finalCost;

  return (
    <div className="bg-white w-[210mm] min-h-[297mm] mx-auto p-12 relative text-slate-800 shadow-2xl print:shadow-none print:w-full print:h-full print:absolute print:top-0 print:left-0 print:m-0 font-sans text-sm">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-8 border-b-2 border-emerald-800 pb-6">
        <div className="w-1/2 pt-2">
           <h1 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter leading-none mb-1">PRESUPUESTO</h1>
           <span className="text-emerald-700 font-bold tracking-widest uppercase text-xs">Servicios Especiales</span>
           
           <div className="mt-8 text-xs text-slate-500 leading-relaxed">
             <p className="font-bold text-slate-800 text-sm uppercase mb-1">{COMPANY_INFO.name}</p>
             <p>{COMPANY_INFO.address}</p>
             <p>{COMPANY_INFO.email}</p>
             <p>{COMPANY_INFO.phone}</p>
           </div>
        </div>
        <div className="w-1/2 text-right flex flex-col items-end">
            <div className="mb-6">
                 {/* Replaced Text with Image */}
                <img 
                    src="https://grupofonobus.com.ar/wp-content/uploads/2025/06/logo-oficial.fw_-1.png" 
                    alt="Grupo FonoBus" 
                    className="h-14 object-contain"
                />
            </div>
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg w-64 text-left shadow-sm">
                <div className="flex justify-between items-center mb-1 border-b border-gray-200 pb-1">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">FECHA EMISIÓN</span>
                    <span className="text-sm font-bold text-slate-700">{formatDate(budgetDetails.date)}</span>
                </div>
            </div>
        </div>
      </div>

      {/* Client Info */}
      <div className="mb-8 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
         <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-100 flex items-center gap-2">
            <span className="text-emerald-800 font-bold text-xs uppercase tracking-wider">Información del Cliente</span>
         </div>
         <div className="grid grid-cols-2 divide-x divide-gray-100 bg-white">
             <div className="p-4">
                 <p className="text-[10px] text-gray-400 uppercase font-bold mb-1 tracking-wide">Solicitante / Empresa</p>
                 <p className="text-lg font-bold text-slate-800 tracking-tight">{budgetDetails.contactName || '-'}</p>
             </div>
             <div className="p-4">
                 <p className="text-[10px] text-gray-400 uppercase font-bold mb-1 tracking-wide">Teléfono de Contacto</p>
                 <p className="text-lg font-bold text-slate-800 tracking-tight">{budgetDetails.phone || '-'}</p>
             </div>
         </div>
      </div>

      {/* Trip Details Grid */}
      <div className="mb-10">
         <h3 className="text-slate-800 font-black text-sm uppercase tracking-wider mb-4 border-b-2 border-emerald-500 inline-block pb-1">Itinerario y Logística</h3>
         <div className="grid grid-cols-12 gap-6">
            
            {/* Dates Box */}
            <div className="col-span-5 bg-slate-50 p-4 rounded border border-slate-100 flex flex-col justify-center gap-4">
               <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">Salida</span>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-800">{formatDate(budgetDetails.departureDate)}</div>
                    <div className="text-xs text-gray-500">{budgetDetails.departureTime} hs</div>
                  </div>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">Regreso</span>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-800">{formatDate(budgetDetails.returnDate)}</div>
                    <div className="text-xs text-gray-500">{budgetDetails.returnTime} hs</div>
                  </div>
               </div>
            </div>

            {/* Locations List */}
            <div className="col-span-7 space-y-3 py-1">
                <div className="flex items-baseline gap-4">
                    <span className="w-20 text-[10px] font-bold text-gray-400 uppercase shrink-0 text-right">Origen</span>
                    <span className="font-medium text-slate-800 border-b border-gray-100 w-full pb-1">{budgetDetails.origin}</span>
                </div>
                <div className="flex items-baseline gap-4">
                    <span className="w-20 text-[10px] font-bold text-gray-400 uppercase shrink-0 text-right">Destino</span>
                    <span className="font-medium text-slate-800 border-b border-gray-100 w-full pb-1">{budgetDetails.destination}</span>
                </div>
                 <div className="flex items-baseline gap-4">
                    <span className="w-20 text-[10px] font-bold text-gray-400 uppercase shrink-0 text-right">Regreso</span>
                    <span className="font-medium text-slate-800 border-b border-gray-100 w-full pb-1">{budgetDetails.returnTo}</span>
                </div>
            </div>

         </div>
      </div>

      {/* Pricing Table */}
      <div className="mb-8">
        <table className="w-full mb-6 border-collapse">
            <thead>
                <tr className="bg-slate-800 text-white text-[10px] uppercase tracking-wider">
                    <th className="py-3 px-4 text-left rounded-tl-md">Descripción del Servicio</th>
                    <th className="py-3 px-4 text-center">Cant. Pasajeros</th>
                    <th className="py-3 px-4 text-center">Unidades</th>
                    <th className="py-3 px-4 text-right rounded-tr-md">Costo Total</th>
                </tr>
            </thead>
            <tbody className="text-sm">
                <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 font-bold text-slate-700">
                        {displayDescription}
                        <div className="text-xs font-normal text-gray-500 mt-1 italic">Tipo de unidad: {quoteState.vehicleType}</div>
                    </td>
                    <td className="py-4 px-4 text-center text-gray-600">{quoteState.pasajeros}</td>
                    <td className="py-4 px-4 text-center text-gray-600">{quoteState.unidades}</td>
                    <td className="py-4 px-4 text-right font-bold text-slate-800 font-mono">{formatMoney(subTotal)}</td>
                </tr>
                {/* Empty rows for visual height consistency if needed */}
                <tr className="border-b border-gray-50 h-12">
                   <td colSpan={4}></td>
                </tr>
            </tbody>
        </table>

        {/* Totals Section */}
        <div className="flex justify-end">
            <div className="w-72 space-y-2">
                <div className="flex justify-between text-sm px-2">
                    <span className="text-gray-500 font-medium">Subtotal</span>
                    <span className="font-mono font-medium text-slate-700">{formatMoney(subTotal)}</span>
                </div>
                
                {quoteState.discount > 0 && (
                    <div className="flex justify-between text-sm px-2 text-red-600">
                        <span className="font-medium">Descuento ({quoteState.discount}%)</span>
                        <span className="font-mono font-medium">- {formatMoney(discountAmount)}</span>
                    </div>
                )}

                <div className="h-px bg-gray-200 my-1"></div>
                <div className="flex justify-between items-center text-lg font-bold bg-emerald-50 text-emerald-900 p-3 rounded border border-emerald-100">
                    <span className="flex flex-col text-xs uppercase leading-tight">
                       <span>Total Estimado</span>
                       <span className="font-normal opacity-75 capitalize text-[10px] text-emerald-700">(Incluye IVA 10.5%)</span>
                    </span>
                    <span className="font-mono text-xl">{formatMoney(totalWithIva)}</span>
                </div>
            </div>
        </div>
      </div>

      {/* Footer / Terms */}
      <div className="mt-auto pt-8 border-t-2 border-gray-100">
         <div className="grid grid-cols-2 gap-12 text-[10px] text-gray-500 leading-relaxed text-justify">
             <div>
                <p className="font-bold text-emerald-800 mb-2 uppercase tracking-wide flex items-center gap-2">
                   <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block"></span> 
                   Condiciones de Pago
                </p>
                <p className="mb-2">Los viajes deberán ser abonados con un mínimo de 72 hs antes de la fecha pactada. La forma de pago es mediante depósito bancario, enviando el comprobante por correo electrónico y/o WhatsApp al número indicado en el encabezado.</p>
             </div>
             <div>
                <p className="font-bold text-emerald-800 mb-2 uppercase tracking-wide flex items-center gap-2">
                   <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block"></span> 
                   Validez del Presupuesto
                </p>
                <p className="mb-2">La presente cotización tiene una validez de 15 días a partir de la fecha de emisión. Tarifas y disponibilidad sujetas a confirmación definitiva al momento de la reserva formal.</p>
             </div>
         </div>
         
         <div className="mt-8 text-center text-[9px] text-gray-300 uppercase tracking-widest font-bold">
            Documento generado automáticamente por Sistema de Cotizaciones FonoBus
         </div>
      </div>

    </div>
  );
};