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
