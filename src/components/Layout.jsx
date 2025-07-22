import { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Drawer from './Drawer';
import { BeakerIcon, CubeTransparentIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

function Layout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(() => localStorage.getItem('drawerOpen') === 'true');
  const [drawerWidth, setDrawerWidth] = useState(() => parseInt(localStorage.getItem('drawerWidth'), 10) || 300);

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('myNotes');
  });

  const [newNote, setNewNote] = useState('');

  useEffect(() => { localStorage.setItem('drawerOpen', isDrawerOpen); }, [isDrawerOpen]);
  useEffect(() => { localStorage.setItem('drawerWidth', drawerWidth); }, [drawerWidth]);
  useEffect(() => { localStorage.setItem('myNotes', JSON.stringify(notes)); }, [notes]);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  const addNote = () => {
    if (newNote.trim() !== '') {
      setNotes(prev => [...prev, newNote.trim()]);
      setNewNote('');
    }
  };

  const clearNotes = () => setNotes([]);

  const linkClass = ({ isActive }) =>
    `flex items-center p-3 my-1 rounded-lg transition-colors text-gray-700 font-medium border-l-4 ${
      isActive ? 'border-blue-500' : 'border-transparent'
    }`;

  return (
    <div className="bg-slate-50">
      <Drawer isOpen={isDrawerOpen} width={drawerWidth} setWidth={setDrawerWidth}>
        <div className="h-full bg-white flex flex-col">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">My Notes</h3>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Current Tasks</h4>
            {notes.length === 0 ? (
              <p className="text-gray-500 text-sm">No notes available.</p>
            ) : (
              <ul className="space-y-2 text-sm text-gray-600">
                {notes.map((note, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {note}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-4 border-t space-y-2">
            <div className="flex">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a new note..."
                className="flex-1 border rounded-l px-3 py-2 text-sm focus:outline-none"
              />
              <button
                onClick={addNote}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r text-sm font-medium"
              >
                Add
              </button>
            </div>

            <button
              onClick={clearNotes}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded text-sm font-medium"
            >
              Clear All Notes
            </button>

            <button
              onClick={toggleDrawer}
              className="w-full font-medium py-2 px-4 rounded transition-colors border border-gray-300"
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
