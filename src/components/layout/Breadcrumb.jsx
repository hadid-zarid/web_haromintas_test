import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const routeNameMap = {
    home: 'Beranda Dashboard',
    peraturan: 'Daftar Peraturan',
    panduan: 'Panduan Penggunaan'
  };

  return (
    <nav className="flex items-center text-xs text-slate-500 font-medium">
      <Link to="/home" className="flex items-center gap-1 hover:text-blue-900 transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span>Dashboard</span>
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routeNameMap[value] || (value.startsWith('REG-') ? `Detail (${value})` : value);

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-400 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-blue-950 truncate max-w-[200px]">{displayName}</span>
            ) : (
              <Link to={to} className="hover:text-blue-900 transition-colors truncate max-w-[150px]">
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
