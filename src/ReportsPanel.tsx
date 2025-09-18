// ReportsPanel.tsx - Pannello Report e Export
import React, { useState } from 'react';
import { X, Download, FileText, Calendar, BarChart3, Settings, Printer } from 'lucide-react';

interface ReportData {
  timestamp: string;
  processStep: number;
  phase: string;
  parameters: {
    P0: number;
    Pfinale: number | "";
    volumeProdotto: number | "";
    temperatura: number | "";
    riempimento: number | "";
    P_serb: number;
    P_bombole: number;
  };
  equipment: {
    geOn: boolean;
    geRpm: number;
    compressoreOn: boolean;
    essiccatoreOn: boolean;
    genN2On: boolean;
  };
  valves: {
    PV1: boolean;
    PV2: boolean;
    PV4: boolean;
    PV5: boolean;
    PV6: boolean;
    PR1open: boolean;
    PR2open: boolean;
  };
  processStatus: {
    stasiCompletata: boolean;
    depCompletata: boolean;
    scaricoLineeDone: boolean;
    scaricoGenDone: boolean;
  };
}

interface ReportsPanelProps {
  isVisible: boolean;
  onClose: () => void;
  reportData: ReportData;
  log: string[];
}

const ReportsPanel: React.FC<ReportsPanelProps> = ({
  isVisible,
  onClose,
  reportData,
  log
}) => {
  const [selectedReportType, setSelectedReportType] = useState<'process' | 'equipment' | 'log'>('process');

  if (!isVisible) return null;

  const generateProcessReport = () => {
    return {
      title: "Report Processo Pressurizzazione GPL",
      data: [
        { label: "Timestamp", value: reportData.timestamp },
        { label: "Step Corrente", value: `${reportData.processStep + 1}/16` },
        { label: "Fase", value: reportData.phase },
        { label: "Pressione Iniziale (P₀)", value: `${reportData.parameters.P0} bar` },
        { label: "Pressione Target", value: reportData.parameters.Pfinale ? `${reportData.parameters.Pfinale} bar` : "Non impostata" },
        { label: "Volume Serbatoio", value: reportData.parameters.volumeProdotto ? `${reportData.parameters.volumeProdotto} L` : "Non impostato" },
        { label: "Temperatura", value: reportData.parameters.temperatura ? `${reportData.parameters.temperatura} °C` : "Non impostata" },
        { label: "Riempimento", value: reportData.parameters.riempimento ? `${reportData.parameters.riempimento} %` : "Non impostato" },
        { label: "Pressione Serbatoio Attuale", value: `${reportData.parameters.P_serb.toFixed(2)} bar` },
        { label: "Pressione Bombole N₂", value: `${reportData.parameters.P_bombole} bar` },
      ]
    };
  };

  const generateEquipmentReport = () => {
    return {
      title: "Report Stato Equipaggiamenti",
      data: [
        { label: "Gruppo Elettrogeno", value: reportData.equipment.geOn ? `ON - ${reportData.equipment.geRpm} rpm` : "OFF" },
        { label: "Compressore", value: reportData.equipment.compressoreOn ? "ON" : "OFF" },
        { label: "Essiccatore", value: reportData.equipment.essiccatoreOn ? "ON" : "OFF" },
        { label: "Generatore N₂", value: reportData.equipment.genN2On ? "ON" : "OFF" },
        { label: "Valvola PV1", value: reportData.valves.PV1 ? "APERTA" : "CHIUSA" },
        { label: "Valvola PV2", value: reportData.valves.PV2 ? "APERTA" : "CHIUSA" },
        { label: "Valvola PV4", value: reportData.valves.PV4 ? "APERTA" : "CHIUSA" },
        { label: "Valvola PV5", value: reportData.valves.PV5 ? "APERTA" : "CHIUSA" },
        { label: "Valvola PV6", value: reportData.valves.PV6 ? "APERTA" : "CHIUSA" },
        { label: "Regolatore PR1", value: reportData.valves.PR1open ? "APERTO" : "CHIUSO" },
        { label: "Regolatore PR2", value: reportData.valves.PR2open ? "APERTO" : "CHIUSO" },
      ]
    };
  };

  const getCurrentReport = () => {
    switch (selectedReportType) {
      case 'process': return generateProcessReport();
      case 'equipment': return generateEquipmentReport();
      case 'log': return {
        title: "Log Eventi Sistema",
        data: log.slice(0, 20).map((entry, idx) => ({ 
          label: `Evento ${log.length - idx}`, 
          value: entry 
        }))
      };
      default: return generateProcessReport();
    }
  };

  const currentReport = getCurrentReport();

  const handleExportPDF = () => {
    // Funzione di export PDF - da implementare con jsPDF
    console.log('Exporting PDF...', currentReport);
    
    // Simulazione download
    const element = document.createElement('a');
    const content = `${currentReport.title}\n\n${currentReport.data.map(item => `${item.label}: ${item.value}`).join('\n')}`;
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `torcia_report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${currentReport.title}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f8fafc; }
              .timestamp { text-align: right; color: #64748b; font-size: 12px; }
            </style>
          </head>
          <body>
            <h1>${currentReport.title}</h1>
            <div class="timestamp">Generato il: ${new Date().toLocaleString()}</div>
            <table>
              <thead>
                <tr>
                  <th>Parametro</th>
                  <th>Valore</th>
                </tr>
              </thead>
              <tbody>
                ${currentReport.data.map(item => `
                  <tr>
                    <td>${item.label}</td>
                    <td>${item.value}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Report Sistema
              </h2>
              <p className="text-sm text-slate-500">Generazione e export dei report di processo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/80 rounded-xl transition-all duration-200 hover:shadow-lg"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Type Selection */}
          <div className="w-64 bg-gradient-to-b from-slate-50 to-slate-100 border-r border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Tipo Report</h3>
            <div className="space-y-2">
              {[
                { key: 'process', label: 'Processo', icon: BarChart3, description: 'Parametri di processo' },
                { key: 'equipment', label: 'Equipaggiamenti', icon: Settings, description: 'Stato apparecchiature' },
                { key: 'log', label: 'Log Eventi', icon: FileText, description: 'Cronologia operazioni' }
              ].map((type) => (
                <button
                  key={type.key}
                  onClick={() => setSelectedReportType(type.key as any)}
                  className={`w-full p-3 text-left rounded-lg transition-all duration-200 ${
                    selectedReportType === type.key 
                      ? 'bg-blue-100 border-blue-200 text-blue-800'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  } border`}
                >
                  <div className="flex items-center gap-2">
                    <type.icon className="w-4 h-4" />
                    <span className="font-medium">{type.label}</span>
                  </div>
                  <div className="text-xs opacity-75 mt-1">{type.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Report Content */}
          <div className="flex-1 flex flex-col">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">{currentReport.title}</h3>
              <div className="text-sm text-slate-500 mt-1">
                Generato il: {new Date().toLocaleString()}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {currentReport.data.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                    <span className="text-sm text-slate-900 font-mono">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gradient-to-r from-slate-100 to-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Report generato automaticamente dal sistema
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gradient-to-r from-slate-200 to-slate-300 hover:from-slate-300 hover:to-slate-400 
                rounded-lg transition-all duration-200 text-slate-700 font-medium shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Stampa
            </button>
            
            <button
              onClick={handleExportPDF}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                rounded-lg transition-all duration-200 text-white font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Esporta PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPanel;
