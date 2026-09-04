import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb = () => {
  const { url } = usePage();
  const pathname = url.split('?')[0];
  const pathnames = pathname.split('/').filter(x => x);

  const routeNameMap = {
    home: 'Beranda Dashboard',
    peraturan: 'Daftar Peraturan',
    'draft-generate': 'Draft Generate Surat',
    panduan: 'Panduan Penggunaan',
    ai: 'Harmonitas AI'
  };

  return (
    <nav className="flex items-center text-xs text-slate-500 font-medium overflow-x-auto no-scrollbar py-0.5 whitespace-nowrap">
      <Link href="/home" className="flex items-center gap-1 hover:text-blue-900 transition-colors shrink-0">
        <Home className="w-3.5 h-3.5" />
        <span className="hidden xs:inline">Dashboard</span>
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routeNameMap[value] || (value.startsWith('REG-') ? `Detail (${value})` : value);

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3.5 h-3.5 mx-1 sm:mx-1.5 text-slate-400 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-blue-950 truncate max-w-[140px] sm:max-w-[220px] shrink-0">{displayName}</span>
            ) : (
              <Link href={to} className="hover:text-blue-900 transition-colors truncate max-w-[100px] sm:max-w-[160px] shrink-0">
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
