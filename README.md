# Import Structure Documentation

## Struttura Directory
```
src/
├── App.tsx                     (main application)
├── NumericInput.tsx            (numeric input component)  
├── Settings.tsx                (settings component)
├── SchemaImpianto.tsx          (P&ID schema)
├── MenuBar.tsx                 (menu bar)
├── components/
│   ├── panels/                 (panel components - step specific)
│   │   ├── TankDataPanel.tsx
│   │   ├── PressureTargetPanel.tsx
│   │   ├── BottleSelectionPanel.tsx  
│   │   ├── InitialChecksPanel.tsx
│   │   ├── GeneratorPanel.tsx
│   │   ├── UtilitiesPanel.tsx
│   │   ├── PressurizationPanel.tsx
│   │   ├── AutomaticProcessPanel.tsx
│   │   └── SavePanel.tsx
│   ├── ui/                     (reusable UI components)
│   │   ├── Sidebar.tsx
│   │   ├── LogModal.tsx
│   │   ├── ProgressBar.tsx
│   │   └── StepWrapper.tsx
│   └── common/                 (common components)
├── hooks/                      (custom hooks)
│   ├── useTimer.tsx
│   ├── useWarmup.tsx
│   └── useProcessState.tsx
├── types/                      (TypeScript definitions)
│   └── process.ts
└── utils/                      (utility functions)
    ├── validation.ts
    └── calculations.ts
```

## Import Paths

### From App.tsx
```typescript
// UI Components
import Sidebar from './components/ui/Sidebar';
import LogModal from './components/ui/LogModal';

// Panel Components  
import TankDataPanel from './components/panels/TankDataPanel';
import PressureTargetPanel from './components/panels/PressureTargetPanel';
// ... other panels

// Hooks
import { useTimer } from './hooks/useTimer';
import { useWarmup } from './hooks/useWarmup';

// Types
import { Fase, STEP_TITLES } from './types/process';

// Existing components (no path change)
import SchemaImpianto from './SchemaImpianto';
import MenuBar from './MenuBar';
import Settings from './Settings';
```

### From components/panels/*
```typescript
// From panel components to root level
import NumericInput from '../../NumericInput';
import { SettingsLimits } from '../../Settings';

// From panel components to types
import { Fase } from '../../types/process';
```

### From components/ui/*
```typescript
// From UI components to root level (if needed)
import SomeRootComponent from '../../SomeRootComponent';

// From UI components to types
import { SomeType } from '../../types/process';
```

### From hooks/*
```typescript
// From hooks to types
import { Fase } from '../types/process';
```

### From types/*
```typescript
// Types can import from each other
import { OtherType } from './other-types';
```

## Regole Import

1. **Sempre usare path relativi** - Non usare path assoluti
2. **Due livelli massimi** - `../../` è il massimo consentito  
3. **Import ordinati** - Prima librerie esterne, poi componenti interni
4. **Tipizzazione esplicita** - Sempre importare tipi quando necessari
5. **No import circolari** - Evitare riferimenti circolari tra file

## Path Fix per Errori Comuni

### Error: Could not resolve "../NumericInput"
**Fix:** Usare `'../../NumericInput'` da `components/panels/`

### Error: Could not resolve "../types"  
**Fix:** Usare `'../../types/process'` da `components/panels/`

### Error: Could not resolve "./components/panels/SomePanel"
**Fix:** Verificare che il file esista e il path sia corretto da App.tsx

## Checklist Validazione Import
- [ ] Path relativo corretto?
- [ ] File di destinazione esiste?
- [ ] Export default/named match import? 
- [ ] No import circolari?
- [ ] TypeScript types importati?
