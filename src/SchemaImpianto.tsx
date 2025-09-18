// SchemaImpianto.tsx - Componente Schema P&ID Interattivo
import React from 'react';
import { SchemaImpiantoProps } from './types';

const SchemaImpianto: React.FC<SchemaImpiantoProps> = ({
  P_serb,
  P_bombole,
  PV1,
  PV2,
  PV4,
  PV5,
  PV6,
  PR1open,
  PR2open,
  geOn,
  compressoreOn,
  essiccatoreOn,
  genN2On,
  fase,
}) => {
  // Calcolo pressioni derivate per PS1, PS2, PS3 (simulate)
  const PS1 = P_bombole * 0.95; // Pressione a valle filtri
  const PS2 = P_bombole * 0.98; // Pressione collettore
  const PS3 = genN2On ? 8.5 : 0; // Pressione generatore N2
  const PS4 = P_serb; // Pressione serbatoio

  // Colori dinamici
  const getValveColor = (isOpen: boolean) => isOpen ? '#10b981' : '#6b7280'; // green-500 : gray-500
  const getPressureColor = (pressure: number) => pressure > 10 ? '#dc2626' : pressure > 5 ? '#f59e0b' : '#10b981'; // red-600 : amber-500 : green-500
  const getEquipmentColor = (isOn: boolean) => isOn ? '#3b82f6' : '#9ca3af'; // blue-500 : gray-400

  // Componente Valvola
  const Valve = ({ x, y, isOpen, label, rotate = 0 }: { x: number; y: number; isOpen: boolean; label: string; rotate?: number }) => (
    <g transform={`translate(${x}, ${y}) rotate(${rotate})`}>
      <rect 
        x={-15} 
        y={-8} 
        width={30} 
        height={16} 
        fill={getValveColor(isOpen)} 
        stroke="#374151" 
        strokeWidth="2" 
        rx="2"
      />
      <line x1={-20} y1={0} x2={-15} y2={0} stroke="#374151" strokeWidth="2" />
      <line x1={15} y1={0} x2={20} y2={0} stroke="#374151" strokeWidth="2" />
      {isOpen && (
        <line x1={-8} y1={0} x2={8} y2={0} stroke="white" strokeWidth="3" />
      )}
      <text x={0} y={25} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#374151">{label}</text>
      <circle cx={0} cy={-18} r={4} fill={isOpen ? '#10b981' : '#ef4444'} />
    </g>
  );

  // Componente Sensore Pressione
  const PressureSensor = ({ x, y, pressure, label }: { x: number; y: number; pressure: number; label: string }) => (
    <g transform={`translate(${x}, ${y})`}>
      <circle cx={0} cy={0} r={20} fill="white" stroke="#374151" strokeWidth="2" />
      <circle cx={0} cy={0} r={15} fill={getPressureColor(pressure)} opacity="0.3" />
      <text x={0} y={-3} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#374151">
        {pressure.toFixed(1)}
      </text>
      <text x={0} y={8} textAnchor="middle" fontSize="8" fill="#374151">bar</text>
      <text x={0} y={35} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#374151">{label}</text>
    </g>
  );

  // Componente Regolatore
  const PressureRegulator = ({ x, y, isOpen, label }: { x: number; y: number; isOpen: boolean; label: string }) => (
    <g transform={`translate(${x}, ${y})`}>
      <polygon 
        points="-12,-10 12,-10 15,0 12,10 -12,10 -15,0" 
        fill={getValveColor(isOpen)} 
        stroke="#374151" 
        strokeWidth="2" 
      />
      <line x1={-20} y1={0} x2={-15} y2={0} stroke="#374151" strokeWidth="2" />
      <line x1={15} y1={0} x2={20} y2={0} stroke="#374151" strokeWidth="2" />
      <text x={0} y={25} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#374151">{label}</text>
    </g>
  );

  // Componente Equipaggiamento
  const Equipment = ({ x, y, width, height, isOn, label }: { x: number; y: number; width: number; height: number; isOn: boolean; label: string }) => (
    <g transform={`translate(${x}, ${y})`}>
      <rect 
        x={-width/2} 
        y={-height/2} 
        width={width} 
        height={height} 
        fill={getEquipmentColor(isOn)} 
        stroke="#374151" 
        strokeWidth="2" 
        rx="4"
      />
      <text x={0} y={0} textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">{label}</text>
      <circle cx={width/2 - 10} cy={-height/2 + 10} r={5} fill={isOn ? '#10b981' : '#ef4444'} />
    </g>
  );

  // Animazione flusso
  const FlowAnimation = ({ x1, y1, x2, y2, isActive }: { x1: number; y1: number; x2: number; y2: number; isActive: boolean }) => {
    if (!isActive) return null;
    
    return (
      <g>
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
          </marker>
        </defs>
        <line 
          x1={x1} 
          y1={y1} 
          x2={x2} 
          y2={y2} 
          stroke="#10b981" 
          strokeWidth="3" 
          markerEnd="url(#arrowhead)"
          opacity="0.7"
        >
          <animate attributeName="stroke-dasharray" values="0,10;10,0" dur="1s" repeatCount="indefinite" />
        </line>
      </g>
    );
  };

  // Serbatoio GPL
  const Serbatoio = ({ x, y }: { x: number; y: number }) => (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx={0} cy={0} rx={80} ry={40} fill="#f3f4f6" stroke="#374151" strokeWidth="3" />
      <ellipse cx={-60} cy={0} rx={10} ry={35} fill="#d1d5db" stroke="#374151" strokeWidth="2" />
      <ellipse cx={60} cy={0} rx={10} ry={35} fill="#d1d5db" stroke="#374151" strokeWidth="2" />
      <text x={0} y={-5} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#374151">SERBATOIO GPL</text>
      <text x={0} y={10} textAnchor="middle" fontSize="12" fill="#374151">{PS4.toFixed(1)} bar</text>
    </g>
  );

  return (
    <div className="w-full h-full bg-white rounded-lg border shadow-sm p-4 overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Schema P&ID Impianto Torcia</h3>
        <div className="text-sm text-slate-600">
          Fase: <span className="font-semibold text-indigo-600">{fase}</span>
        </div>
      </div>

      <div className="w-full h-full min-h-[600px] relative">
        <svg viewBox="0 0 1200 800" className="w-full h-full">
          {/* Definizioni per gradienti e pattern */}
          <defs>
            <linearGradient id="tankGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="50%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#f8fafc" />
            </linearGradient>
            <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
            </pattern>
          </defs>

          {/* Background grid */}
          <rect width="100%" height="100%" fill="url(#gridPattern)" />

          {/* GENERATORE AZOTO - Top Right */}
          <Equipment x={950} y={120} width={120} height={60} isOn={genN2On} label="GENERATORE AZOTO" />
          <PressureSensor x={950} y={80} pressure={PS3} label="PS3" />
          
          {/* PACCO BOMBOLE - Left Side */}
          <Equipment x={180} y={300} width={100} height={150} isOn={true} label="BOMBOLE N₂" />
          <PressureSensor x={180} y={200} pressure={PS2} label="PS2" />
          <PressureSensor x={180} y={400} pressure={PS1} label="PS1" />
          
          {/* Filtri FL1, FL2, FL3 */}
          <g transform="translate(180, 350)">
            <rect x={-15} y={-20} width={30} height={8} fill="#94a3b8" stroke="#374151" strokeWidth="1" />
            <rect x={-15} y={-10} width={30} height={8} fill="#94a3b8" stroke="#374151" strokeWidth="1" />
            <rect x={-15} y={0} width={30} height={8} fill="#94a3b8" stroke="#374151" strokeWidth="1" />
            <text x={40} y={-10} fontSize="10" fill="#374151">FL1</text>
            <text x={40} y={0} fontSize="10" fill="#374151">FL2</text>
            <text x={40} y={10} fontSize="10" fill="#374151">FL3</text>
          </g>

          {/* SERBATOIO GPL - Bottom Center */}
          <Serbatoio x={600} y={650} />
          <PressureSensor x={600} y={580} pressure={PS4} label="PS4" />

          {/* VALVOLE PRINCIPALI */}
          <Valve x={350} y={300} isOpen={PV1} label="PV1" />
          <Valve x={450} y={200} isOpen={PV2} label="PV2" />
          <Valve x={750} y={450} isOpen={PV4} label="PV4" />
          <Valve x={600} y={500} isOpen={PV5} label="PV5" rotate={90} />
          <Valve x={800} y={350} isOpen={PV6} label="PV6" />

          {/* REGOLATORI */}
          <PressureRegulator x={550} y={300} isOpen={PR1open} label="PR1" />
          <PressureRegulator x={650} y={200} isOpen={PR2open} label="PR2" />

          {/* MANICHETTA */}
          <Equipment x={900} y={500} width={80} height={40} isOn={PV6} label="MANICHETTA" />

          {/* GBR (Gas Burn Rate) */}
          <g transform="translate(1000, 350)">
            <polygon points="0,0 20,10 20,30 0,40 -20,30 -20,10" fill={PV6 ? '#f59e0b' : '#9ca3af'} stroke="#374151" strokeWidth="2" />
            <text x={0} y={50} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#374151">GBR</text>
            {PV6 && (
              <>
                <circle cx={0} cy={-15} r={3} fill="#f59e0b" opacity="0.8">
                  <animate attributeName="r" values="2;6;2" dur="0.8s" repeatCount="indefinite" />
                </circle>
                <circle cx={-5} cy={-20} r={2} fill="#dc2626" opacity="0.6">
                  <animate attributeName="r" values="1;4;1" dur="1s" repeatCount="indefinite" />
                </circle>
                <circle cx={5} cy={-18} r={2} fill="#f59e0b" opacity="0.7">
                  <animate attributeName="r" values="1;5;1" dur="0.6s" repeatCount="indefinite" />
                </circle>
              </>
            )}
          </g>

          {/* LINEE DI COLLEGAMENTO */}
          <g stroke="#374151" strokeWidth="3" fill="none">
            {/* Dal generatore */}
            <path d="M 950 150 L 950 200 L 680 200" />
            
            {/* Dalle bombole */}
            <path d="M 230 300 L 320 300" />
            
            {/* Linea principale */}
            <path d="M 380 300 L 520 300" />
            <path d="M 580 300 L 720 300 L 720 450" />
            
            {/* Verso serbatoio */}
            <path d="M 600 530 L 600 580" />
            
            {/* Verso torcia */}
            <path d="M 830 350 L 900 350 L 900 480" />
            <path d="M 900 350 L 980 350" />
          </g>

          {/* ANIMAZIONI FLUSSO */}
          {PV1 && <FlowAnimation x1={350} y1={300} x2={520} y2={300} isActive={true} />}
          {PV2 && <FlowAnimation x1={680} y1={200} x2={580} y2={300} isActive={true} />}
          {PR1open && <FlowAnimation x1={580} y1={300} x2={720} y2={300} isActive={true} />}
          {PV4 && <FlowAnimation x1={720} y1={450} x2={720} y2={300} isActive={true} />}
          {PV5 && <FlowAnimation x1={600} y1={530} x2={600} y2={580} isActive={fase === "Fase1" || fase === "Fase2"} />}
          {PV6 && <FlowAnimation x1={830} y1={350} x2={980} y2={350} isActive={true} />}

          {/* LEGEND */}
          <g transform="translate(50, 50)">
            <rect x={0} y={0} width={200} height={120} fill="white" stroke="#d1d5db" strokeWidth="1" rx="4" />
            <text x={10} y={20} fontSize="14" fontWeight="bold" fill="#374151">LEGENDA</text>
            
            <circle cx={20} cy={40} r={4} fill="#10b981" />
            <text x={35} y={45} fontSize="12" fill="#374151">Aperto/Attivo</text>
            
            <circle cx={20} cy={60} r={4} fill="#ef4444" />
            <text x={35} y={65} fontSize="12" fill="#374151">Chiuso/Inattivo</text>
            
            <circle cx={20} cy={80} r={4} fill="#f59e0b" />
            <text x={35} y={85} fontSize="12" fill="#374151">Pressione Media</text>
            
            <circle cx={20} cy={100} r={4} fill="#dc2626" />
            <text x={35} y={105} fontSize="12" fill="#374151">Pressione Alta</text>
          </g>

          {/* STATUS PANEL */}
          <g transform="translate(50, 200)">
            <rect x={0} y={0} width={200} height={150} fill="white" stroke="#d1d5db" strokeWidth="1" rx="4" />
            <text x={10} y={20} fontSize="14" fontWeight="bold" fill="#374151">STATUS EQUIPAGGIAMENTI</text>
            
            <circle cx={20} cy={40} r={4} fill={getEquipmentColor(geOn)} />
            <text x={35} y={45} fontSize="12" fill="#374151">Gruppo Elettrogeno</text>
            
            <circle cx={20} cy={60} r={4} fill={getEquipmentColor(compressoreOn)} />
            <text x={35} y={65} fontSize="12" fill="#374151">Compressore</text>
            
            <circle cx={20} cy={80} r={4} fill={getEquipmentColor(essiccatoreOn)} />
            <text x={35} y={85} fontSize="12" fill="#374151">Essiccatore</text>
            
            <circle cx={20} cy={100} r={4} fill={getEquipmentColor(genN2On)} />
            <text x={35} y={105} fontSize="12" fill="#374151">Generatore N₂</text>
            
            <text x={10} y={130} fontSize="12" fontWeight="bold" fill="#4f46e5">
              Fase: {fase}
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default SchemaImpianto;
