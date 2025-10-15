import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export type Language = 'it' | 'en' | 'pt';

interface Translation {
  [key: string]: string | Translation;
}

interface Translations {
  it: Translation;
  en: Translation;
  pt: Translation;
}

// Translations object
const translations: Translations = {
  it: {
    // Menu Bar
    menu: {
      title: "Menu",
      file: "File",
      view: "Visualizza",
      tools: "Strumenti",
      help: "Aiuto",
      newProcess: "Nuovo Processo",
      open: "Apri...",
      save: "Salva",
      exportPDF: "Esporta PDF",
      print: "Stampa",
      exit: "Esci",
      logEvents: "Log Eventi",
      systemReports: "Report Sistema",
      pidSchema: "Schema P&ID",
      refreshData: "Aggiorna Dati",
      settings: "Impostazioni",
      calibration: "Calibrazione",
      databaseConfig: "Database Config",
      userManual: "Manuale Utente",
      quickGuide: "Guida Rapida",
      systemInfo: "Info Sistema",
      systemActive: "Sistema Attivo",
      dashboardTitle: "Dashboard Torcia",
      hmiVersion: "HMI Pressurizzazione GPL v1.0"
    },
    
    // Step Titles
    steps: {
      tankData: "Dati serbatoio completi",
      pressureTarget: "Selezionare pressione target",
      bottleSelection: "Scelta bombole",
      initialChecks: "Verifiche iniziali",
      generator: "Gruppo Elettrogeno",
      utilities: "Attivare utenze",
      pressurization: "Avvio pressurizzazione automatica",
      automaticProcess: "Processo automatico e spegnimento",
      saveComplete: "Salvataggio e conclusione",
      phases: "Fasi Processo"
    },
    
    // Common
    common: {
      back: "Indietro",
      continue: "Continua",
      reset: "Reset",
      complete: "Completa Processo",
      start: "START",
      stop: "STOP",
      on: "ON",
      off: "OFF",
      yes: "Sì",
      no: "No",
      cancel: "Annulla",
      save: "Salva",
      close: "Chiudi",
      confirm: "Conferma",
      bar: "bar",
      celsius: "°C",
      liters: "L",
      percent: "%",
      rpm: "rpm",
      seconds: "s",
      minutes: "min"
    },
    
    // Tank Data Panel
    tankData: {
      title: "Dati Serbatoio Completi",
      tankType: "Tipo serbatoio",
      standard: "Standard",
      special: "Speciale",
      initialPressure: "Pressione iniziale P₀",
      capacity: "Capacità",
      temperature: "Temperatura",
      fillLevel: "Riempimento",
      insertAllParams: "Inserire tutti i parametri del serbatoio prima di procedere"
    },
    
    // Pressure Target Panel
    pressureTarget: {
      title: "Selezionare Pressione Target",
      presetLevels: "Livelli prefissati",
      customPressure: "Pressione personalizzata",
      finalPressure: "Pressione finale personalizzata",
      targetSelected: "Target selezionato"
    },
    
    // Bottle Selection Panel
    bottleSelection: {
      title: "Scelta Bombole",
      bottle: "Bombola",
      pressure: "Pressione",
      capacity: "Capacità",
      selected: "Bombole selezionate"
    },
    
    // Initial Checks Panel
    initialChecks: {
      title: "Verifiche Iniziali",
      check1: "Caricare set-up corretto sul Vallen",
      check2: "Verificare montaggio sensori",
      check3: "Verificare funzionamento sensori",
      check4: "Eseguire monitoraggio rumore di fondo",
      completed: "Verifiche completate"
    },
    
    // Generator Panel
    generator: {
      title: "Gruppo Elettrogeno",
      startGE: "Avvia Gruppo Elettrogeno",
      warming: "Riscaldamento in corso",
      remaining: "rimanenti",
      warmupComplete: "Riscaldamento completato",
      operational3000: "Funzionamento 3000 giri/min",
      operationalStatus: "GE Operativo a 3000 giri/min",
      readyNextStep: "Pronto per il passo successivo",
      progress: "Progresso riscaldamento"
    },
    
    // Utilities Panel
    utilities: {
      title: "Attivare Utenze",
      activateAll: "Attiva tutte le utenze",
      compressor: "Compressore",
      dryer: "Essiccatore",
      n2Generator: "Generatore N₂"
    },
    
    // Pressurization Panel
    pressurization: {
      title: "Avvio Pressurizzazione",
      description: "Il PLC gestirà automaticamente le valvole. Premere START per iniziare.",
      startPressurization: "START Pressurizzazione",
      inProgress: "Pressurizzazione in corso...",
      completed: "Pressurizzazione completata",
      estimatedTime: "Tempo stimato"
    },
    
    // Automatic Process Panel
    automaticProcess: {
      title: "Processo Automatico e Spegnimento",
      startAutomatic: "AVVIA Processo Automatico",
      inProgress: "Processo automatico in corso...",
      stasis: "Stasi stabilizzazione pressione",
      depressurization: "Depressurizzazione automatica verso torcia",
      lineDrain: "Scarico automatico linee",
      generatorDrain: "Scarico linea generatore",
      confirmComplete: "Conferma Processo Completato",
      processComplete: "Processo automatico completato",
      shutdownGE: "SPEGNI Gruppo Elettrogeno",
      allComplete: "Processo Completato",
      allOpsComplete: "Tutte le operazioni automatiche completate e GE spento",
      finalChecklist: "Checklist finale - Verificare:",
      checkPressures: "Pressioni = 0",
      checkValves: "Tutte le valvole chiuse",
      checkTorch: "Torcia smontata e riposta",
      checkBottles: "Bombole chiuse",
      checkUtilities: "Utenze spente",
      checkInstruments: "Vallen/PLC/monitor spenti; batteria disattivata"
    },
    
    // Save Panel
    savePanel: {
      title: "Salvataggio e Conclusione",
      saveData: "SALVA Dati e Report",
      printReport: "STAMPA Report",
      terminateProcess: "TERMINA Processo",
      successTitle: "Processo Terminato con Successo",
      successMessage: "Tutte le operazioni sono state completate correttamente"
    },
    
    // Settings
    settings: {
      title: "Impostazioni Sistema",
      subtitle: "Configura limiti minimi e massimi per tutti i parametri",
      unsavedChanges: "Modifiche non salvate",
      rememberSave: "Ricorda di salvare le modifiche prima di chiudere",
      processParams: "Parametri Processo",
      equipment: "Equipaggiamenti",
      processTimers: "Timer Processo",
      initialPressure: "Pressione Iniziale (bar)",
      finalPressure: "Pressione Finale (bar)",
      productVolume: "Volume Prodotto (L)",
      temperature: "Temperatura (°C)",
      fillLevel: "Riempimento (%)",
      geRpm: "RPM Gruppo Elettrogeno",
      warmupTime: "Tempo Riscaldamento",
      bottlePressure: "Pressione Bombole",
      stasisTimer: "Timer Stasi",
      depTimer: "Timer Depressurizzazione",
      minimum: "Minimo",
      maximum: "Massimo",
      range: "Range",
      restoreDefaults: "Ripristina Default",
      saveChanges: "Salva Modifiche"
    },
    
    // Log Modal
    log: {
      title: "Log Eventi Sistema",
      eventsRecorded: "eventi registrati",
      noEvents: "Nessun evento registrato",
      totalEvents: "eventi totali",
      clearLog: "Cancella Log"
    },
    
    // Sidebar
    sidebar: {
      processPhases: "Fasi Processo"
    },
    
    // Messages
    messages: {
      configSaved: "Configurazione salvata",
      loadingConfig: "Caricamento configurazione...",
      reportExported: "Report esportato",
      printStarted: "Avviata stampa report",
      processComplete: "Processo completato!",
      backToStep: "Tornato al passo",
      nextStep: "Passaggio al passo",
      geStarted: "GE avviato a 1500 giri/min - Iniziato riscaldamento",
      warmupComplete: "Warm-up completato - GE pronto per 3000 rpm.",
      ge3000rpm: "GE portato a 3000 giri/min - Regime operativo",
      allUtilitiesOn: "Tutte le utenze attivate: Compressore, Essiccatore, Generatore N₂",
      allUtilitiesOff: "Tutte le utenze disattivate",
      pressurizationStarted: "Avviata pressurizzazione automatica.",
      pressurizationComplete: "Pressurizzazione completata.",
      automaticProcessStarted: "Avviato processo automatico: Stasi → Depressurizzazione → Scarico linee → Scarico generatore",
      automaticProcessComplete: "Processo automatico completato",
      geShutdown: "Gruppo Elettrogeno spento",
      dataSaved: "Dati salvati e report generato",
      processTerminated: "Processo terminato",
      settingsSaved: "Impostazioni limiti salvate"
    }
  },
  
  en: {
    // Menu Bar
    menu: {
      title: "Menu",
      file: "File",
      view: "View",
      tools: "Tools",
      help: "Help",
      newProcess: "New Process",
      open: "Open...",
      save: "Save",
      exportPDF: "Export PDF",
      print: "Print",
      exit: "Exit",
      logEvents: "Event Log",
      systemReports: "System Reports",
      pidSchema: "P&ID Schema",
      refreshData: "Refresh Data",
      settings: "Settings",
      calibration: "Calibration",
      databaseConfig: "Database Config",
      userManual: "User Manual",
      quickGuide: "Quick Guide",
      systemInfo: "System Info",
      systemActive: "System Active",
      dashboardTitle: "Torch Dashboard",
      hmiVersion: "LPG Pressurization HMI v1.0"
    },
    
    // Step Titles
    steps: {
      tankData: "Complete tank data",
      pressureTarget: "Select target pressure",
      bottleSelection: "Bottle selection",
      initialChecks: "Initial checks",
      generator: "Generator Set",
      utilities: "Activate utilities",
      pressurization: "Start automatic pressurization",
      automaticProcess: "Automatic process and shutdown",
      saveComplete: "Save and completion",
      phases: "Process Phases"
    },
    
    // Common
    common: {
      back: "Back",
      continue: "Continue",
      reset: "Reset",
      complete: "Complete Process",
      start: "START",
      stop: "STOP",
      on: "ON",
      off: "OFF",
      yes: "Yes",
      no: "No",
      cancel: "Cancel",
      save: "Save",
      close: "Close",
      confirm: "Confirm",
      bar: "bar",
      celsius: "°C",
      liters: "L",
      percent: "%",
      rpm: "rpm",
      seconds: "s",
      minutes: "min"
    },
    
    // Tank Data Panel
    tankData: {
      title: "Complete Tank Data",
      tankType: "Tank type",
      standard: "Standard",
      special: "Special",
      initialPressure: "Initial pressure P₀",
      capacity: "Capacity",
      temperature: "Temperature",
      fillLevel: "Fill level",
      insertAllParams: "Enter all tank parameters before proceeding"
    },
    
    // Pressure Target Panel
    pressureTarget: {
      title: "Select Target Pressure",
      presetLevels: "Preset levels",
      customPressure: "Custom pressure",
      finalPressure: "Custom final pressure",
      targetSelected: "Target selected"
    },
    
    // Bottle Selection Panel
    bottleSelection: {
      title: "Bottle Selection",
      bottle: "Bottle",
      pressure: "Pressure",
      capacity: "Capacity",
      selected: "Bottles selected"
    },
    
    // Initial Checks Panel
    initialChecks: {
      title: "Initial Checks",
      check1: "Load correct setup on Vallen",
      check2: "Verify sensor installation",
      check3: "Verify sensor operation",
      check4: "Perform background noise monitoring",
      completed: "Checks completed"
    },
    
    // Generator Panel
    generator: {
      title: "Generator Set",
      startGE: "Start Generator Set",
      warming: "Warming up in progress",
      remaining: "remaining",
      warmupComplete: "Warm-up completed",
      operational3000: "Operation 3000 rpm",
      operationalStatus: "GE Operational at 3000 rpm",
      readyNextStep: "Ready for next step",
      progress: "Warm-up progress"
    },
    
    // Utilities Panel
    utilities: {
      title: "Activate Utilities",
      activateAll: "Activate all utilities",
      compressor: "Compressor",
      dryer: "Dryer",
      n2Generator: "N₂ Generator"
    },
    
    // Pressurization Panel
    pressurization: {
      title: "Start Pressurization",
      description: "PLC will automatically manage valves. Press START to begin.",
      startPressurization: "START Pressurization",
      inProgress: "Pressurization in progress...",
      completed: "Pressurization completed",
      estimatedTime: "Estimated time"
    },
    
    // Automatic Process Panel
    automaticProcess: {
      title: "Automatic Process and Shutdown",
      startAutomatic: "START Automatic Process",
      inProgress: "Automatic process in progress...",
      stasis: "Stasis pressure stabilization",
      depressurization: "Automatic depressurization to torch",
      lineDrain: "Automatic line drain",
      generatorDrain: "Generator line drain",
      confirmComplete: "Confirm Process Completed",
      processComplete: "Automatic process completed",
      shutdownGE: "SHUTDOWN Generator Set",
      allComplete: "Process Completed",
      allOpsComplete: "All automatic operations completed and GE shut down",
      finalChecklist: "Final checklist - Verify:",
      checkPressures: "Pressures = 0",
      checkValves: "All valves closed",
      checkTorch: "Torch dismounted and stored",
      checkBottles: "Bottles closed",
      checkUtilities: "Utilities off",
      checkInstruments: "Vallen/PLC/monitors off; battery deactivated"
    },
    
    // Save Panel
    savePanel: {
      title: "Save and Completion",
      saveData: "SAVE Data and Report",
      printReport: "PRINT Report",
      terminateProcess: "TERMINATE Process",
      successTitle: "Process Successfully Completed",
      successMessage: "All operations have been completed correctly"
    },
    
    // Settings
    settings: {
      title: "System Settings",
      subtitle: "Configure minimum and maximum limits for all parameters",
      unsavedChanges: "Unsaved changes",
      rememberSave: "Remember to save changes before closing",
      processParams: "Process Parameters",
      equipment: "Equipment",
      processTimers: "Process Timers",
      initialPressure: "Initial Pressure (bar)",
      finalPressure: "Final Pressure (bar)",
      productVolume: "Product Volume (L)",
      temperature: "Temperature (°C)",
      fillLevel: "Fill Level (%)",
      geRpm: "Generator Set RPM",
      warmupTime: "Warm-up Time",
      bottlePressure: "Bottle Pressure",
      stasisTimer: "Stasis Timer",
      depTimer: "Depressurization Timer",
      minimum: "Minimum",
      maximum: "Maximum",
      range: "Range",
      restoreDefaults: "Restore Defaults",
      saveChanges: "Save Changes"
    },
    
    // Log Modal
    log: {
      title: "System Event Log",
      eventsRecorded: "events recorded",
      noEvents: "No events recorded",
      totalEvents: "total events",
      clearLog: "Clear Log"
    },
    
    // Sidebar
    sidebar: {
      processPhases: "Process Phases"
    },
    
    // Messages
    messages: {
      configSaved: "Configuration saved",
      loadingConfig: "Loading configuration...",
      reportExported: "Report exported",
      printStarted: "Print started",
      processComplete: "Process completed!",
      backToStep: "Back to step",
      nextStep: "Moving to step",
      geStarted: "GE started at 1500 rpm - Warm-up started",
      warmupComplete: "Warm-up completed - GE ready for 3000 rpm.",
      ge3000rpm: "GE brought to 3000 rpm - Operational mode",
      allUtilitiesOn: "All utilities activated: Compressor, Dryer, N₂ Generator",
      allUtilitiesOff: "All utilities deactivated",
      pressurizationStarted: "Automatic pressurization started.",
      pressurizationComplete: "Pressurization completed.",
      automaticProcessStarted: "Automatic process started: Stasis → Depressurization → Line drain → Generator drain",
      automaticProcessComplete: "Automatic process completed",
      geShutdown: "Generator Set shut down",
      dataSaved: "Data saved and report generated",
      processTerminated: "Process terminated",
      settingsSaved: "Limit settings saved"
    }
  },
  
  pt: {
    // Menu Bar
    menu: {
      title: "Menu",
      file: "Arquivo",
      view: "Visualizar",
      tools: "Ferramentas",
      help: "Ajuda",
      newProcess: "Novo Processo",
      open: "Abrir...",
      save: "Salvar",
      exportPDF: "Exportar PDF",
      print: "Imprimir",
      exit: "Sair",
      logEvents: "Log de Eventos",
      systemReports: "Relatórios do Sistema",
      pidSchema: "Esquema P&ID",
      refreshData: "Atualizar Dados",
      settings: "Configurações",
      calibration: "Calibração",
      databaseConfig: "Config Database",
      userManual: "Manual do Usuário",
      quickGuide: "Guia Rápido",
      systemInfo: "Info Sistema",
      systemActive: "Sistema Ativo",
      dashboardTitle: "Dashboard Tocha",
      hmiVersion: "HMI Pressurização GLP v1.0"
    },
    
    // Step Titles
    steps: {
      tankData: "Dados completos do tanque",
      pressureTarget: "Selecionar pressão alvo",
      bottleSelection: "Seleção de garrafas",
      initialChecks: "Verificações iniciais",
      generator: "Grupo Gerador",
      utilities: "Ativar utilidades",
      pressurization: "Iniciar pressurização automática",
      automaticProcess: "Processo automático e desligamento",
      saveComplete: "Salvamento e conclusão",
      phases: "Fases do Processo"
    },
    
    // Common
    common: {
      back: "Voltar",
      continue: "Continuar",
      reset: "Reset",
      complete: "Completar Processo",
      start: "START",
      stop: "STOP",
      on: "ON",
      off: "OFF",
      yes: "Sim",
      no: "Não",
      cancel: "Cancelar",
      save: "Salvar",
      close: "Fechar",
      confirm: "Confirmar",
      bar: "bar",
      celsius: "°C",
      liters: "L",
      percent: "%",
      rpm: "rpm",
      seconds: "s",
      minutes: "min"
    },
    
    // Tank Data Panel
    tankData: {
      title: "Dados Completos do Tanque",
      tankType: "Tipo de tanque",
      standard: "Padrão",
      special: "Especial",
      initialPressure: "Pressão inicial P₀",
      capacity: "Capacidade",
      temperature: "Temperatura",
      fillLevel: "Nível de enchimento",
      insertAllParams: "Inserir todos os parâmetros do tanque antes de prosseguir"
    },
    
    // Pressure Target Panel
    pressureTarget: {
      title: "Selecionar Pressão Alvo",
      presetLevels: "Níveis predefinidos",
      customPressure: "Pressão personalizada",
      finalPressure: "Pressão final personalizada",
      targetSelected: "Alvo selecionado"
    },
    
    // Bottle Selection Panel
    bottleSelection: {
      title: "Seleção de Garrafas",
      bottle: "Garrafa",
      pressure: "Pressão",
      capacity: "Capacidade",
      selected: "Garrafas selecionadas"
    },
    
    // Initial Checks Panel
    initialChecks: {
      title: "Verificações Iniciais",
      check1: "Carregar configuração correta no Vallen",
      check2: "Verificar instalação dos sensores",
      check3: "Verificar funcionamento dos sensores",
      check4: "Executar monitoramento de ruído de fundo",
      completed: "Verificações concluídas"
    },
    
    // Generator Panel
    generator: {
      title: "Grupo Gerador",
      startGE: "Iniciar Grupo Gerador",
      warming: "Aquecimento em progresso",
      remaining: "restantes",
      warmupComplete: "Aquecimento concluído",
      operational3000: "Operação 3000 rpm",
      operationalStatus: "GE Operacional a 3000 rpm",
      readyNextStep: "Pronto para próxima etapa",
      progress: "Progresso do aquecimento"
    },
    
    // Utilities Panel
    utilities: {
      title: "Ativar Utilidades",
      activateAll: "Ativar todas as utilidades",
      compressor: "Compressor",
      dryer: "Secador",
      n2Generator: "Gerador N₂"
    },
    
    // Pressurization Panel
    pressurization: {
      title: "Iniciar Pressurização",
      description: "O PLC gerenciará automaticamente as válvulas. Pressione START para iniciar.",
      startPressurization: "START Pressurização",
      inProgress: "Pressurização em andamento...",
      completed: "Pressurização concluída",
      estimatedTime: "Tempo estimado"
    },
    
    // Automatic Process Panel
    automaticProcess: {
      title: "Processo Automático e Desligamento",
      startAutomatic: "INICIAR Processo Automático",
      inProgress: "Processo automático em andamento...",
      stasis: "Estase estabilização de pressão",
      depressurization: "Despressurização automática para tocha",
      lineDrain: "Drenagem automática de linhas",
      generatorDrain: "Drenagem linha do gerador",
      confirmComplete: "Confirmar Processo Concluído",
      processComplete: "Processo automático concluído",
      shutdownGE: "DESLIGAR Grupo Gerador",
      allComplete: "Processo Concluído",
      allOpsComplete: "Todas as operações automáticas concluídas e GE desligado",
      finalChecklist: "Checklist final - Verificar:",
      checkPressures: "Pressões = 0",
      checkValves: "Todas as válvulas fechadas",
      checkTorch: "Tocha desmontada e guardada",
      checkBottles: "Garrafas fechadas",
      checkUtilities: "Utilidades desligadas",
      checkInstruments: "Vallen/PLC/monitores desligados; bateria desativada"
    },
    
    // Save Panel
    savePanel: {
      title: "Salvamento e Conclusão",
      saveData: "SALVAR Dados e Relatório",
      printReport: "IMPRIMIR Relatório",
      terminateProcess: "TERMINAR Processo",
      successTitle: "Processo Concluído com Sucesso",
      successMessage: "Todas as operações foram concluídas corretamente"
    },
    
    // Settings
    settings: {
      title: "Configurações do Sistema",
      subtitle: "Configurar limites mínimos e máximos para todos os parâmetros",
      unsavedChanges: "Alterações não salvas",
      rememberSave: "Lembre-se de salvar as alterações antes de fechar",
      processParams: "Parâmetros do Processo",
      equipment: "Equipamentos",
      processTimers: "Temporizadores do Processo",
      initialPressure: "Pressão Inicial (bar)",
      finalPressure: "Pressão Final (bar)",
      productVolume: "Volume do Produto (L)",
      temperature: "Temperatura (°C)",
      fillLevel: "Nível de Enchimento (%)",
      geRpm: "RPM Grupo Gerador",
      warmupTime: "Tempo de Aquecimento",
      bottlePressure: "Pressão das Garrafas",
      stasisTimer: "Temporizador Estase",
      depTimer: "Temporizador Despressurização",
      minimum: "Mínimo",
      maximum: "Máximo",
      range: "Faixa",
      restoreDefaults: "Restaurar Padrões",
      saveChanges: "Salvar Alterações"
    },
    
    // Log Modal
    log: {
      title: "Log de Eventos do Sistema",
      eventsRecorded: "eventos registrados",
      noEvents: "Nenhum evento registrado",
      totalEvents: "eventos totais",
      clearLog: "Limpar Log"
    },
    
    // Sidebar
    sidebar: {
      processPhases: "Fases do Processo"
    },
    
    // Messages
    messages: {
      configSaved: "Configuração salva",
      loadingConfig: "Carregando configuração...",
      reportExported: "Relatório exportado",
      printStarted: "Impressão iniciada",
      processComplete: "Processo concluído!",
      backToStep: "Voltou para etapa",
      nextStep: "Passando para etapa",
      geStarted: "GE iniciado a 1500 rpm - Aquecimento iniciado",
      warmupComplete: "Aquecimento concluído - GE pronto para 3000 rpm.",
      ge3000rpm: "GE levado a 3000 rpm - Modo operacional",
      allUtilitiesOn: "Todas as utilidades ativadas: Compressor, Secador, Gerador N₂",
      allUtilitiesOff: "Todas as utilidades desativadas",
      pressurizationStarted: "Pressurização automática iniciada.",
      pressurizationComplete: "Pressurização concluída.",
      automaticProcessStarted: "Processo automático iniciado: Estase → Despressurização → Drenagem de linhas → Drenagem do gerador",
      automaticProcessComplete: "Processo automático concluído",
      geShutdown: "Grupo Gerador desligado",
      dataSaved: "Dados salvos e relatório gerado",
      processTerminated: "Processo terminado",
      settingsSaved: "Configurações de limites salvas"
    }
  }
};

// Context
interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Provider Component
export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('it');

  // Load saved language preference
  useEffect(() => {
    const savedLang = localStorage.getItem('hmi-language') as Language;
    if (savedLang && ['it', 'en', 'pt'].includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  // Save language preference
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('hmi-language', lang);
  };

  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

// Hook
export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider');
  }
  return context;
};

// Language Selector Component - Direct buttons with flags
export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useTranslation();
  
  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'pt', label: 'Português', flag: '🇵🇹' }
  ];

  return (
    <div className="flex items-center gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
            language === lang.code
              ? 'bg-blue-600 text-white shadow-lg scale-105'
              : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-300 hover:border-blue-400'
          }`}
          title={lang.label}
        >
          <span className="text-xl">{lang.flag}</span>
          <span className="text-sm font-bold">{lang.code.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
};

// Demo Component
export default function I18nDemo() {
  return (
    <I18nProvider>
      <DemoContent />
    </I18nProvider>
  );
}

function DemoContent() {
  const { t, language } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-slate-800">
              {t('menu.dashboardTitle')}
            </h1>
            <LanguageSelector />
          </div>
          
          <div className="text-sm text-slate-600 mb-8">
            {t('menu.hmiVersion')} • {t('menu.systemActive')}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold text-blue-800 mb-4">{t('steps.tankData')}</h3>
              <div className="space-y-2 text-sm text-blue-700">
                <p>• {t('tankData.initialPressure')}</p>
                <p>• {t('tankData.capacity')}</p>
                <p>• {t('tankData.temperature')}</p>
                <p>• {t('tankData.fillLevel')}</p>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-bold text-green-800 mb-4">{t('generator.title')}</h3>
              <div className="space-y-2 text-sm text-green-700">
                <p>• {t('generator.startGE')}</p>
                <p>• {t('generator.warming')}</p>
                <p>• {t('generator.warmupComplete')}</p>
                <p>• {t('generator.operational3000')}</p>
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="font-bold text-purple-800 mb-4">{t('utilities.title')}</h3>
              <div className="space-y-2 text-sm text-purple-700">
                <p>• {t('utilities.compressor')}</p>
                <p>• {t('utilities.dryer')}</p>
                <p>• {t('utilities.n2Generator')}</p>
              </div>
            </div>

            <div className="bg-amber-50 p-6 rounded-lg">
              <h3 className="font-bold text-amber-800 mb-4">{t('bottleSelection.title')}</h3>
              <div className="space-y-2 text-sm text-amber-700">
                <p>• {t('bottleSelection.pressure')}: 180 {t('common.bar')}</p>
                <p>• {t('bottleSelection.capacity')}: 50 {t('common.liters')}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-colors">
              {t('common.back')}
            </button>
            <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              {t('common.continue')}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Lingue disponibili / Available languages / Idiomas disponíveis
          </h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-3xl mb-2">🇮🇹</div>
              <div className="font-semibold">Italiano</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-3xl mb-2">🇬🇧</div>
              <div className="font-semibold">English</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-3xl mb-2">🇵🇹</div>
              <div className="font-semibold">Português</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
