import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { COLORS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
  isAdmin?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hideHeader = false, isAdmin = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800" style={{ backgroundColor: isAdmin ? '#f3f4f6' : COLORS.background }}>
      {!hideHeader && (
        <header className="bg-white shadow-sm sticky top-0 z-50 safe-area-top">
          <div className={`mx-auto px-4 py-2 sm:py-3 flex items-center justify-between gap-2 min-h-[52px] sm:min-h-0 ${isAdmin ? 'max-w-7xl' : 'max-w-4xl'}`}>
            <div className="flex items-center min-w-0 flex-1">
              <img
                src="/logo.png"
                alt="Globe Life AIL Division - Paz Organization"
                className="h-9 sm:h-10 w-auto max-w-full object-contain object-left"
              />
            </div>
            {isAdmin && (
              <nav className="flex items-center gap-1.5 sm:gap-2 text-sm shrink-0">
                <button
                  type="button"
                  onClick={() => navigate('/admin')}
                  className={`min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-3 py-2 rounded-full border text-xs font-medium transition-colors touch-manipulation ${
                    isActive('/admin')
                      ? 'bg-[#005EB8] text-white border-[#005EB8]'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-blue-50 active:bg-blue-50'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/qr')}
                  className={`min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-3 py-2 rounded-full border text-xs font-medium transition-colors touch-manipulation ${
                    isActive('/qr')
                      ? 'bg-[#005EB8] text-white border-[#005EB8]'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-blue-50 active:bg-blue-50'
                  }`}
                >
                  QR Codes
                </button>
              </nav>
            )}
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-[#005EB8] to-[#37B06D]" />
        </header>
      )}
      <main className="flex-grow flex flex-col relative overflow-x-hidden px-safe-area">
        {children}
      </main>
      {!isAdmin && (
        <footer className="py-4 sm:py-6 text-center text-xs text-gray-400 safe-area-bottom px-4">
          <p>&copy; {new Date().getFullYear()} Paz Organization | Globe Life AIL Division</p>
        </footer>
      )}
    </div>
  );
};

export default Layout;