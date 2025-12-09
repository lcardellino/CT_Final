# Guía de Integración con MongoDB para Vercel

Esta aplicación actualmente funciona como una Single Page Application (SPA) del lado del cliente. Para guardar los presupuestos en una base de datos MongoDB, se recomienda utilizar **Vercel Serverless Functions**.

## Pasos para la implementación

### 1. Configuración de MongoDB Atlas
1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Crea un nuevo Cluster (el nivel gratuito M0 es suficiente).
3. En "Database Access", crea un usuario y contraseña.
4. En "Network Access", permite el acceso desde cualquier IP (`0.0.0.0/0`) para simplificar la conexión desde Vercel.
5. Obtén tu string de conexión (URI), que se verá algo así:
   `mongodb+srv://<usuario>:<password>@cluster0.mongodb.net/cotizador?retryWrites=true&w=majority`

### 2. Preparación del Proyecto
Instala las dependencias necesarias para el backend:
```bash
npm install mongoose
```

### 3. Crear la conexión a la Base de Datos
Crea un archivo `lib/db.ts` (debes crear la carpeta `lib`) para gestionar la conexión reutilizable (patrón Singleton para Serverless):

```typescript
// lib/db.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Por favor define la variable MONGODB_URI en tus variables de entorno');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
```

### 4. Definir el Modelo (Schema)
Crea `models/Quote.ts`:

```typescript
// models/Quote.ts
import mongoose from 'mongoose';

const QuoteSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  clientName: String,
  phone: String,
  totalCost: Number,
  details: Object, // Puedes ser más específico definiendo la estructura completa
});

export default mongoose.models.Quote || mongoose.model('Quote', QuoteSchema);
```

### 5. Crear la API Route (Serverless Function)
Crea una carpeta `api` en la raíz del proyecto y dentro crea `api/save-quote.ts`. Vercel convertirá automáticamente los archivos en esta carpeta en funciones serverless.

```typescript
// api/save-quote.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import connectToDatabase from '../lib/db';
import Quote from '../models/Quote';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    try {
      await connectToDatabase();
      const newQuote = await Quote.create(req.body);
      res.status(201).json({ success: true, data: newQuote });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
```

### 6. Configurar Variables de Entorno en Vercel
1. Ve a tu proyecto en el dashboard de Vercel.
2. Ve a **Settings > Environment Variables**.
3. Agrega una nueva variable:
   - **Key**: `MONGODB_URI`
   - **Value**: Tu string de conexión de MongoDB Atlas.

### 7. Integrar en el Frontend
En tu archivo `App.tsx`, modifica la función de guardar para llamar a la API:

```typescript
const saveToDatabase = async () => {
  const payload = {
    clientName: budgetDetails.contactName,
    phone: budgetDetails.phone,
    totalCost: totals.totalFinal,
    details: { ...quoteState, ...budgetDetails }
  };

  try {
    const response = await fetch('/api/save-quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (response.ok) {
      alert('Presupuesto guardado en la base de datos exitosamente');
    }
  } catch (error) {
    console.error('Error al guardar:', error);
  }
};
```
