
// components/GlobalHubNav.tsx
import * as React from 'react';
import type { NavNode } from '../helpers/NavApi';

export const GlobalHubNavigation: React.FC<{ nodes: NavNode[] }> = ({ nodes }) => {
  return (
    <nav aria-label="Global navigation">
      <ul className="ghn-root">
        {nodes.map(n => (
          <li key={n.Id} className="ghn-item">
            <a href={n.Url}>{n.Title}</a>
            {n.Children?.length ? (
              <div className="ghn-mega">
                <ul>
                  {n.Children.map(c => (
                    <li key={c.Id}><a href={c.Url}>{c.Title}</a></li>
                  ))}
                </ul>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </nav>
  );
};
