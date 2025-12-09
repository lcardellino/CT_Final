import React, { useState } from 'react';
import { INITIAL_QUOTE_STATE, INITIAL_BUDGET_DETAILS, QuoteState, BudgetDetails } from './types';
import { Calculator } from './components/Calculator';
import { BudgetDetailsForm } from './components/BudgetDetailsForm';
import { PDFPreview } from './components/PDFPreview';
import { Printer, Edit, Calculator as CalcIcon } from 'lucide-react';

const App: React.FC = () => {
  const [quoteState, setQuoteState] = useState<QuoteState>(INITIAL_QUOTE_STATE);
  const [budgetDetails, setBudgetDetails] = useState<BudgetDetails>(INITIAL_BUDGET_DETAILS);
  const [totals, setTotals] = useState({ totalFinal: 0, totalWithIva: 0 });
  
  // Navigation State
  const [view, setView] = useState<'calculator' | 'preview'>('calculator');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen pb-12">
      
      {/* Navigation Bar (Hidden on Print) */}
      <nav className="no-print bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="font-bold text-xl flex items-center gap-2">
            <CalcIcon className="text-emerald-400" />
            <span>FonoBus Quote System</span>
          </div>
          <div className="flex gap-4">
             <button 
               onClick={() => setView('calculator')}
               className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${view === 'calculator' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 text-gray-300'}`}
             >
               <Edit size={18} /> Editar Datos
             </button>
             <button 
               onClick={() => setView('preview')}
               className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${view === 'preview' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 text-gray-300'}`}
             >
               <Printer size={18} /> Vista Previa PDF
             </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto mt-8 px-4">
        
        {view === 'calculator' ? (
          <div className="animate-fade-in space-y-8 no-print">
            <Calculator 
              state={quoteState} 
              onChange={setQuoteState} 
              onTotalChange={setTotals}
            />
            
            <BudgetDetailsForm 
              data={budgetDetails}
              onChange={setBudgetDetails}
            />

            <div className="flex justify-center pt-8">
               <button 
                 onClick={() => setView('preview')}
                 className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition hover:-translate-y-1 flex items-center gap-2 text-lg"
               >
                 Generar Presupuesto <Printer />
               </button>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in flex flex-col items-center gap-8">
            <div className="no-print bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded w-full max-w-2xl" role="alert">
              <p className="font-bold">Modo Vista Previa</p>
              <p>Revise que los datos sean correctos. Haga clic en "Imprimir / Guardar PDF" para descargar el archivo.</p>
            </div>

            {/* This container shows normally on screen, but is the ONLY thing shown when printing due to CSS in index.html */}
            <div className="print-only">
               <PDFPreview 
                  quoteState={quoteState}
                  budgetDetails={budgetDetails}
                  finalCost={totals.totalFinal}
               />
            </div>

            <button 
                 onClick={handlePrint}
                 className="no-print bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 px-12 rounded-lg shadow-xl transform transition hover:-translate-y-1 flex items-center gap-3 text-xl mb-12"
               >
                 <Printer size={24} /> Imprimir / Guardar como PDF
            </button>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;