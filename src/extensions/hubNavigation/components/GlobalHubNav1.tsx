// components/GlobalHubNav.tsx
import * as React from 'react';
import type { NavNode } from '../helpers/NavApi';

interface GlobalHubNavProps {
  nodes: NavNode[];
  currentUrl: string;
}

// Normalize URLs for comparison
const normalizeUrl = (url: string): string => 
  (url || '').replace(/\/$/, '').toLowerCase();

// Container styles
const navContainerStyle: React.CSSProperties = {
  backgroundColor: '#f5f5f5',
  padding: '10px 20px',
  borderBottom: '1px solid #ddd'
};

const navListStyle: React.CSSProperties = {
  display: 'flex',
  listStyle: 'none',
  margin: 0,
  padding: 0,
  gap: '20px',
  flexWrap: 'wrap'
};

const navItemStyle: React.CSSProperties = {
  position: 'relative'
};

// Current site link - BOLD RED
const currentLinkStyle: React.CSSProperties = {
  fontWeight: 700,
  color: '#d32f2f',
  textDecoration: 'none',
  padding: '5px 10px',
  display: 'inline-block'
};

// Other links - NORMAL GREEN
const defaultLinkStyle: React.CSSProperties = {
  fontWeight: 400,
  color: '#2e7d32',
  textDecoration: 'none',
  padding: '5px 10px',
  display: 'inline-block'
};

// Mega menu dropdown styles
const megaMenuStyle: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  left: 0,
  backgroundColor: '#ffffff',
  border: '1px solid #ddd',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  padding: '10px',
  minWidth: '200px',
  zIndex: 1000,
  display: 'none'
};

const megaMenuListStyle: React.CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0
};

const megaMenuItemStyle: React.CSSProperties = {
  padding: '5px 0'
};

export const GlobalHubNavigation: React.FC<GlobalHubNavProps> = ({ nodes, currentUrl }) => {
  const normalizedCurrent = normalizeUrl(currentUrl);
  const [openMenu, setOpenMenu] = React.useState<number | null>(null);

  // Check if nav URL matches current site
  const isCurrentLink = (navUrl: string): boolean => {
    const normalizedNav = normalizeUrl(navUrl);
    const currentPath = normalizedCurrent.split('/sites/')[1] || '';
    const navPath = normalizedNav.split('/sites/')[1] || '';
    
    if (!currentPath || !navPath) return false;
    
    // Compare site names (first segment after /sites/)
    const currentSite = currentPath.split('/')[0];
    const navSite = navPath.split('/')[0];
    
    return currentSite === navSite;
  };

  return (
    <nav style={navContainerStyle} aria-label="Hub Navigation">
      <ul style={navListStyle}>
        {nodes.map(n => {
          const isActive = isCurrentLink(n.Url);
          const hasChildren = n.Children && n.Children.length > 0;
          const isOpen = openMenu === n.Id;
          
          return (
            <li 
              key={n.Id} 
              style={navItemStyle}
              onMouseEnter={() => hasChildren && setOpenMenu(n.Id)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <a 
                href={n.Url} 
                style={isActive ? currentLinkStyle : defaultLinkStyle}
              >
                {n.Title} {hasChildren ? '▼' : ''}
              </a>
              {hasChildren && (
                <div style={{ ...megaMenuStyle, display: isOpen ? 'block' : 'none' }}>
                  <ul style={megaMenuListStyle}>
                    {n.Children!.map(c => (
                      <li key={c.Id} style={megaMenuItemStyle}>
                        <a 
                          href={c.Url}
                          style={isCurrentLink(c.Url) ? currentLinkStyle : defaultLinkStyle}
                        >
                          {c.Title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};




/*

// components/GlobalHubNav.tsx
import * as React from 'react';
import type { NavNode } from '../helpers/NavApi';

interface GlobalHubNavProps {
  nodes: NavNode[];
  currentUrl: string;
}

// Normalize URLs for comparison (remove trailing slash, lowercase)
const normalizeUrl = (url: string): string => 
  (url || '').replace(/\/$/, '').toLowerCase();

export const GlobalHubNavigation: React.FC<GlobalHubNavProps> = ({ nodes, currentUrl }) => {
  const normalizedCurrent = normalizeUrl(currentUrl);

  const isCurrentLink = (url: string): boolean => 
    normalizeUrl(url) === normalizedCurrent;

  return (
    <nav aria-label="Global navigation">
      <ul className="ghn-root">
        {nodes.map(n => {
          const isActive = isCurrentLink(n.Url);
          const hasActiveChild = n.Children?.some(c => isCurrentLink(c.Url));
          
          return (
            <li key={n.Id} className="ghn-item">
              <a 
                href={n.Url} 
                className={isActive ? 'ghn-current' : undefined}
              >
                {n.Title}
              </a>
              {n.Children?.length ? (
                <div className="ghn-mega">
                  <ul>
                    {n.Children.map(c => (
                      <li key={c.Id}>
                        <a 
                          href={c.Url}
                          className={isCurrentLink(c.Url) ? 'ghn-current' : undefined}
                        >
                          {c.Title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
