import { ReactNode } from 'react';

interface BottomToolbarProps {
  children: ReactNode;
}

export const BottomToolbar = ({ children }: BottomToolbarProps) => {
  return (
    <div className="h-12 bg-toolbar border-t border-panel-border flex items-center justify-between px-4 gap-4">
      {children}
    </div>
  );
};
