// MenuBar.tsx - Menu bar con supporto multilingua (VERSIONE CORRETTA)
import React, { useState, useRef, useEffect } from 'react';
import { 
  Settings, FileText, Download, BarChart3, 
  Save, FolderOpen, Printer, Info, HelpCircle,
  Monitor, Database, RefreshCw, CheckCircle
} from 'lucide-react';
import { useTranslation, LanguageSelector } from './i18n';

interface MenuBarProps {
  onOpenSettings: () => void;
  onOpenReports: () => void;
  onOpenLog: () => void;
  onExportPDF: () => void;
  onSave?: () => void;
  onLoad?: () => void;
  onPrint?: () => void;
  onAbout?: () => void;
}

interface MenuDropdown {
  label: string;
  items: Array<{
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    onClick: () => void;
    shortcut?: string;
    separator?: boolean;
    disabled?: boolean;
  }>;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  onOpenSettings,
  onOpenReports,
  onOpenLog,
  onExportPDF,
  onSave = () => {},
  onLoad = () => {},
  onPrint = () => {},
  onAbout = () => {}
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  // Chiudi menu quando clicchi fuori
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menus: MenuDropdown[] = [
    {
      label: t('menu.file'),
      items: [
        { label: t('menu.newProcess'), icon: RefreshCw, onClick: () => window.location.reload(), shortcut: 'Ctrl+N' },
        { label: t('menu.open'), icon: FolderOpen, onClick: onLoad, shortcut: 'Ctrl+O' },
        { label: t('menu.save'), icon: Save, onClick: onSave, shortcut: 'Ctrl+S' },
        { separator: true, label: '', onClick: () => {} },
        { label: t('menu.exportPDF'), icon: Download, onClick: onExportPDF, shortcut: 'Ctrl+E' },
        { label: t('menu.print'), icon: Printer, onClick: onPrint, shortcut: 'Ctrl+P' },
        { separator: true, label: '', onClick: () => {} },
        { label: t('menu.exit'), icon: undefined, onClick: () => window.close(), shortcut: 'Alt+F4' }
      ]
    },
    {
      label: t('menu.view'),
      items: [
        { label: t('menu.logEvents'), icon: FileText, onClick: onOpenLog, shortcut: 'Ctrl+L' },
        { label: t('menu.systemReports'), icon: BarChart3, onClick: onOpenReports, shortcut: 'Ctrl+R' },
        { separator: true, label: '', onClick: () => {} },
        { label: t('menu.pidSchema'), icon: Monitor, onClick: () => {}, shortcut: 'F2', disabled: true },
        { label: t('menu.refreshData'), icon: RefreshCw, onClick: () => window.location.reload(), shortcut: 'F5' }
      ]
    },
    {
      label: t('menu.tools'),
      items: [
        { label: t('menu.settings'), icon: Settings, onClick: onOpenSettings, shortcut: 'Ctrl+,' },
        { label: t('menu.calibration'), icon: CheckCircle, onClick: () => {}, shortcut: 'Ctrl+K', disabled: true },
        { separator: true, label: '', onClick: () => {} },
        { label: t('menu.databaseConfig'), icon: Database, onClick: () => {}, disabled: true }
      ]
    },
    {
      label: t('menu.help'),
      items: [
        { label: t('menu.userManual'), icon: HelpCircle, onClick: () => {}, shortcut: 'F1' },
        { label: t('menu.quickGuide'), icon: Info, onClick: () => {} },
        { separator: true, label: '', onClick: () => {} },
        { label: t('menu.systemInfo'), icon: Info, onClick: onAbout }
      ]
    }
  ];

  const handleMenuClick = (menuLabel: string) => {
    setActiveMenu(activeMenu === menuLabel ? null : menuLabel);
  };

  const handleItemClick = (onClick: () => void) => {
    onClick();
    setActiveMenu(null);
  };

  return (
    <div 
      ref={menuRef}
      className="bg-white border-b border-gray-200 shadow-sm relative z-50"
    >
      <div className="flex items-center">
        {/* Logo/Brand */}
        <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm">{t('menu.dashboardTitle')}</span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex">
          {menus.map((menu) => (
            <div key={menu.label} className="relative">
              <button
                onClick={() => handleMenuClick(menu.label)}
                className={`
                  px-4 py-2 text-sm font-medium transition-colors duration-150
                  ${activeMenu === menu.label
                    ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                {menu.label}
              </button>

              {/* Dropdown Menu */}
              {activeMenu === menu.label && (
                <div className="absolute top-full left-0 min-w-[200px] bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-50">
                  {menu.items.map((item, index) => {
                    if (item.separator) {
                      return (
                        <div key={index} className="h-px bg-gray-200 mx-2 my-1" />
                      );
                    }

                    const IconComponent = item.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleItemClick(item.onClick)}
                        disabled={item.disabled}
                        className={`
                          w-full px-4 py-2 text-left text-sm transition-colors duration-150 flex items-center justify-between group
                          ${item.disabled
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          {IconComponent && (
                            <IconComponent className={`w-4 h-4 ${item.disabled ? 'text-gray-400' : 'text-gray-500 group-hover:text-blue-600'}`} />
                          )}
                          <span>{item.label}</span>
                        </div>
                        {item.shortcut && (
                          <span className={`text-xs ${item.disabled ? 'text-gray-300' : 'text-gray-400'}`}>
                            {item.shortcut}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Status Area & Language Selector */}
        <div className="ml-auto px-4 py-2 flex items-center gap-4 text-sm text-gray-600">
          {/* Language Selector - Direct buttons */}
          <LanguageSelector />

          {/* Separator */}
          <div className="h-6 w-px bg-gray-300"></div>

          {/* System Status */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>{t('menu.systemActive')}</span>
          </div>
          
          {/* Clock */}
          <div className="text-gray-400">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
