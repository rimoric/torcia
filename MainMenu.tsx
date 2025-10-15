// MainMenu.tsx - Menu principale con dropdown
import React, { useState, useRef, useEffect } from 'react';
import { Menu, Settings, FileText, Download, BarChart3, X } from 'lucide-react';

interface MainMenuProps {
  onOpenSettings: () => void;
  onOpenReports: () => void;
  onOpenLog: () => void;
  onExportPDF: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onOpenSettings,
  onOpenReports,
  onOpenLog,
  onExportPDF
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Chiudi menu quando clicchi fuori
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    {
      icon: Settings,
      label: 'Impostazioni',
      onClick: () => {
        onOpenSettings();
        setIsOpen(false);
      },
      description: 'Configura limiti min/max'
    },
    {
      icon: BarChart3,
      label: 'Report',
      onClick: () => {
        onOpenReports();
        setIsOpen(false);
      },
      description: 'Visualizza statistiche'
    },
    {
      icon: FileText,
      label: 'Log Eventi',
      onClick: () => {
        onOpenLog();
        setIsOpen(false);
      },
      description: 'Cronologia operazioni'
    },
    {
      icon: Download,
      label: 'Esporta PDF',
      onClick: () => {
        onExportPDF();
        setIsOpen(false);
      },
      description: 'Salva report processo'
    }
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* Pulsante Menu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2
          ${isOpen 
            ? 'bg-blue-600 text-white shadow-lg' 
            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105'
          }
        `}
      >
        <Menu className="w-4 h-4" />
        <span className="text-sm font-medium">Menu</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-gray-50 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Dashboard Torcia</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="w-full px-4 py-3 hover:bg-blue-50 transition-colors text-left group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors">
                      <IconComponent className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-800 group-hover:text-blue-700">
                        {item.label}
                      </div>
                      <div className="text-sm text-slate-500 group-hover:text-blue-600">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-50 border-t">
            <div className="text-xs text-gray-500 text-center">
              HMI Pressurizzazione GPL v1.0
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainMenu;
