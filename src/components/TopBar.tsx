import { Settings, User } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

interface TopBarProps {
  projectName?: string;
}

export const TopBar = ({ projectName = "My Project" }: TopBarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const pages = [
    { path: '/', label: 'Canvas' },
    { path: '/storyboard', label: 'Storyboard' },
    { path: '/characters', label: 'Characters' },
    { path: '/props', label: 'Props' },
    { path: '/video-editor', label: 'Video' },
    { path: '/audio-editor', label: 'Audio' },
  ];

  return (
    <div className="h-12 bg-toolbar border-b border-panel-border flex items-center justify-between px-4 gap-4">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <div className="text-primary font-bold text-lg">CDE</div>
        <Button variant="ghost" size="icon" className="icon-button" title="Settings">
          <Settings className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="icon-button" title="Account">
          <User className="w-4 h-4" />
        </Button>
      </div>

      {/* Center - Page Navigation */}
      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <Button
            key={page.path}
            variant={location.pathname === page.path ? 'default' : 'ghost'}
            size="sm"
            className="tool-tab"
            onClick={() => navigate(page.path)}
          >
            {page.label}
          </Button>
        ))}
      </div>

      {/* Right Section - Empty for now */}
      <div className="w-16" />
    </div>
  );
};
