import { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Drawer from './Drawer';
import { BeakerIcon, CubeTransparentIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

function Layout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(() => localStorage.getItem('drawerOpen') === 'true');
  const [drawerWidth, setDrawerWidth] = useState(() => parseInt(localStorage.getItem('drawerWidth'), 10) || 300);

  useEffect(() => { localStorage.setItem('drawerOpen', isDrawerOpen); }, [isDrawerOpen]);
  useEffect(() => { localStorage.setItem('drawerWidth', drawerWidth); }, [drawerWidth]);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const linkClass = ({ isActive }) =>
    `flex items-center p-3 my-1 rounded-lg transition-colors text-gray-700 font-medium border-l-4 ${
      isActive ? 'border-blue-500' : 'border-transparent'
    }`;

  return (
    <div className="bg-slate-50">
      <Drawer isOpen={isDrawerOpen} width={drawerWidth} setWidth={setDrawerWidth}>
        <div className="h-full bg-white">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">My Notes</h3>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Current Tasks</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Check binding affinity for CHEMBL25.
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Compare structures of Aspirin and Ibuprofen.
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Investigate protein target 1A3N.
              </li>
            </ul>
          </div>

          <div className="p-4 border-t">
            <button
              onClick={toggleDrawer}
              className="w-full font-medium py-2 px-4 rounded transition-colors"
            >
              Close Notes
            </button>
          </div>
        </div>
      </Drawer>

      <div
        className={`flex h-screen transition-all duration-300 ease-in-out`}
        style={{ marginLeft: isDrawerOpen ? `${drawerWidth}px` : '0px' }}
      >
        <aside className="w-64 bg-white shadow-md flex flex-col flex-shrink-0 z-10 border-r">
          <div className="p-4 border-b h-20 flex items-center">
            <h2 className="text-2xl font-bold text-blue-600">BioSpark</h2>
          </div>
          <nav className="flex-grow p-4">
            <NavLink to="/" className={linkClass}>
              <BeakerIcon className="h-6 w-6 mr-3" /> Ligand Database
            </NavLink>
            <NavLink to="/protein" className={linkClass}>
              <CubeTransparentIcon className="h-6 w-6 mr-3" /> Protein Viewer
            </NavLink>
          </nav>
          <div className="p-4 border-t">
            <button
              onClick={toggleDrawer}
              className="w-full flex items-center p-3 rounded-lg text-gray-700 font-medium transition-colors"
            >
              <ClipboardDocumentListIcon className="h-6 w-6 mr-3" /> My Notes
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;