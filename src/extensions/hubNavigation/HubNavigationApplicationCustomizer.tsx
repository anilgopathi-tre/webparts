import { Log } from '@microsoft/sp-core-library';
import { BaseApplicationCustomizer } from '@microsoft/sp-application-base';

const LOG_SOURCE: string = 'HubNavigationApplicationCustomizer';

export interface IHubNavigationApplicationCustomizerProperties {
  hubSiteUrl?: string;
}

/** Application Customizer to highlight current site in hub navigation */
export default class HubNavigationApplicationCustomizer
  extends BaseApplicationCustomizer<IHubNavigationApplicationCustomizerProperties> {

  private _styleElement: HTMLStyleElement | null = null;

  public async onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized HubNavigationApplicationCustomizer`);
    
    // Inject base CSS styles
    this._injectStyles();
    
    // Apply highlighting after page loads
    this._applyHighlighting();
    
    // Re-apply on navigation events
    this.context.application.navigatedEvent.add(this, () => {
      setTimeout(() => this._applyHighlighting(), 500);
    });
    
    // Also watch for DOM changes (mega menu opens)
    this._observeDOM();
    
    return Promise.resolve();
  }

  private _injectStyles(): void {
    if (this._styleElement) return;
    
    this._styleElement = document.createElement('style');
    this._styleElement.setAttribute('data-hub-nav-customizer', 'true');
    this._styleElement.innerHTML = `
      /* Current site link - BOLD RED */
      .hub-nav-current-site,
      .hub-nav-current-site span,
      .hub-nav-current-site button,
      a.hub-nav-current-site {
        color: #d32f2f !important;
        font-weight: 700 !important;
      }
      
      /* Other links - NORMAL GREEN */
      .hub-nav-other-site,
      .hub-nav-other-site span,
      .hub-nav-other-site button,
      a.hub-nav-other-site {
        color: #2e7d32 !important;
        font-weight: 400 !important;
      }
    `;
    document.head.appendChild(this._styleElement);
  }

  private _applyHighlighting(): void {
    const currentSiteUrl = this.context.pageContext.web.absoluteUrl.replace(/\/$/, '').toLowerCase();
    const currentSiteName = currentSiteUrl.split('/sites/')[1]?.split('/')[0] || '';
    
    console.log('Hub Nav Customizer - Current site:', currentSiteName, currentSiteUrl);
    
    // Find all links in hub navigation areas
    const selectors = [
      '[class*="hubNav"] a',
      '[class*="HubNav"] a', 
      '[data-automationid="HubNav"] a',
      '[class*="megaMenu"] a',
      '[class*="MegaMenu"] a',
      '[class*="topNav"] a',
      '[class*="TopNav"] a',
      'nav a[href*="/sites/"]',
      '[role="navigation"] a[href*="/sites/"]',
      '[class*="root"] > [class*="link"]',
      'button[class*="hubNav"]',
      '[class*="CompositeHeader"] a'
    ];
    
    const allLinks = document.querySelectorAll(selectors.join(', '));
    
    console.log('Hub Nav Customizer - Found links:', allLinks.length);
    
    allLinks.forEach((link: Element) => {
      const href = link.getAttribute('href') || '';
      const linkUrl = href.toLowerCase();
      const linkSiteName = linkUrl.split('/sites/')[1]?.split('/')[0] || '';
      
      // Remove existing classes
      link.classList.remove('hub-nav-current-site', 'hub-nav-other-site');
      
      // Check if this link matches current site
      const isCurrentSite = linkSiteName && currentSiteName && 
        linkSiteName === currentSiteName;
      
      if (isCurrentSite) {
        link.classList.add('hub-nav-current-site');
        console.log('Hub Nav Customizer - Marked as current:', href);
      } else if (linkUrl.indexOf('/sites/') > -1) {
        link.classList.add('hub-nav-other-site');
      }
    });
  }

  private _observeDOM(): void {
    // Watch for mega menu dropdown to appear
    const observer = new MutationObserver(() => {
      this._applyHighlighting();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}





/*
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { getTopNav } from './helpers/NavApi';
import { GlobalHubNavigation } from './components/GlobalHubNav';

import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';

const LOG_SOURCE: string = 'HubNavigationApplicationCustomizer';

export interface IHubNavigationApplicationCustomizerProperties {
 
  hubSiteUrl?: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
/* export default class HubNavigationApplicationCustomizer
  extends BaseApplicationCustomizer<IHubNavigationApplicationCustomizerProperties> {

    //private topPlaceholder;
     private _top: PlaceholderContent | undefined;
     
  public async onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized HubNavigationApplicationCustomizer`);
    // Re-render when SharePoint does partial navigations
    this.context.placeholderProvider.changedEvent.add(this, this._render);
    //this._render();
    window.addEventListener('popstate',()=>{this._render();});
    //await this._render();
    return Promise.resolve();
  }

  private async _render(): Promise<void> {
    if (!this._top) {
      this._top = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top);
    }
    if (!this._top?.domElement) return;

    // Mount your React component here (after fetching nav JSON)
    const hubUrl = this.properties.hubSiteUrl || this.context.pageContext.site.absoluteUrl;
    const nodes = await getTopNav(hubUrl, this.context);

    const currentUrl = this.context.pageContext.web.absoluteUrl;
    ReactDOM.render(<GlobalHubNavigation nodes={nodes} currentUrl={currentUrl} />, this._top.domElement);
    
    //this._root!.render(<GlobalHubNavigation nodes={nodes} />);

    //ReactDom.render(<GlobalHubNav nodes={nodes} />, this._top.domElement);
    
    //ReactDom.render(<GlobalHubNavigation nodes={nodes} />, this._top.domElement);
    //ReactDom.render()

  }


  //private _topPlaceholder: PlaceholderContent | undefined;
  //private _bottomPlaceholder: PlaceholderContent | undefined;
/*
  public async OnInIt(): Promise<void> {
    // Re-run when SharePoint performs partial page navigation
    this.context.application.navigatedEvent.add(this, this.run);
    await this.run();
  }

  private async run(){
    try {
      const res= await fetch(`${this.context.pageContext.web.absoluteUrl}/_api/navigation/MenuState`, {
        headers: { 'accept': 'application/json;odata=nometadata' }
      });

      const menuState= await res.json();

      const currentUrl = this.context.pageContext.web.absoluteUrl.replace(/\/$/, '').toLowerCase();

      const nodes = (menuState?.MenuState?.Nodes || menuState?.Nodes || []);

      const allNodes: any[] = flatten(nodes);

      
      //const matches = nodes.filter(n => normalizeUrl(n?.Url) === currentUrl);
      //const match = matches.length ? matches[0] : undefined;
    const match=allNodes.filter(n=>{
    const nodeUrl=typeof n?.Url==='string' ? n.Url : (n?.Url as any)?.Url;
    return nodeUrl && nodeUrl.replace(/\/$/,'').toLowerCase()===currentUrl;});
      
      //const norm = (s: string) => (s || '').replace(/\/$/, '').toLowerCase();

      //const match = (Array.isArray(allNodes) ? allNodes : []).filter(n => norm(typeof n?.Url === 'string' ? n.Url : (n?.Url as any)?.Url) === norm(currentUrl));

            if (match) {
        // Apply CSS through a lightweight technique:
        // Try to select the anchor element by href in the DOM and add a class.
        //const selectorHref = CSS.escape(match.Url);
        const selectorHref = CSS.escape(match[0].Url);
        const link = document.querySelector(`a[href="${selectorHref}"]`);
        if (link) {
          link.classList.add('m365-current-hub-link');
        }
      }

    }
    catch (e) {
      Log.error(LOG_SOURCE, e as any);
    }

  }
  //public onInit(): Promise<void> {
   // Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    
    //const style = document.createElement('style');
    //style.setAttribute('data-hide-hub-nav', 'true');
    //style.innerHTML = `
   //   .ms-HubNav, .ms-HubNav * { display: none !important; }
   //   div[class*="CompositeHeader"] div[class*="HubNav"] { display: none !important; }
   // `;
   // document.head.appendChild(style);


    // Handling the top placeholder
    //this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);

   // return Promise.resolve();
 // }
  
  // top  placeholder start----------------------------------------------------------

  /* ------------------------------------------------------------------ 
  

  private _renderPlaceHolders(): void {
    console.log("Hello from HubNavigationApplicationCustomizer._renderPlaceHolders()");
    console.log("Available placeholders: ",
      this.context.placeholderProvider.placeholderNames
        .map(name => PlaceholderName[name])
        .join(", ")
    );
    // Handling the top placeholder
    if (!this._topPlaceholder) {
      this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top,
        { onDispose: this._onDispose }
      );

      // The extension should not assume that the expected placeholder is available.
      if (!this._topPlaceholder) {
        console.error("The expected placeholder (Top) was not found.");
        return;
      }

      if (this.properties) {
        let topString: string = this.properties.Top;
        if (!topString) {
          topString = "(Top property was not defined.)";
        }

        if (this._topPlaceholder.domElement) {
          this._topPlaceholder.domElement.innerHTML = `
           <div class="${styles.app}">
             <div class="${styles.top}">
             <i class="ms-Icon ms-Icon--Info" aria-hidden="true"></i> ${escape(topString)}
             </div>
           </div>`;



        }
      }
    }

    // Handling the bottom placeholder
/*---------------------------------------------------------- 
    if (!this._bottomPlaceholder) {
      this._bottomPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Bottom,
        { onDispose: this._onDispose }
      );

      // The extension should not assume that the expected placeholder is available.
      if (!this._bottomPlaceholder) {
        console.error("The expected placeholder (Bottom) was not found.");
        return;
      }

      if (this.properties) {
        let bottomString: string = this.properties.Bottom;
        if (!bottomString) {
          bottomString = "(Bottom property was not defined.)";
        }

        if (this._bottomPlaceholder.domElement) {
          this._bottomPlaceholder.domElement.innerHTML = `
            <div class="${styles.app}">
              <div class="${styles.bottom}">
              <i class="ms-Icon ms-Icon--Info" aria-hidden="true"></i> ${escape(bottomString)}
              </div>
            </div>`;
        }
      }
    }
     bottom placeholder end ----------------------------------------------------------*/
  //}    
  
//Top placeholder end ----------------------------------------------------------*/
  

  //private _onDispose(): void {
   // console.log('[HubNavigationApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
 // }
}

/*
function flatten(nodes: any[]): any[] {
  const out: any[] = [];
  for (const n of nodes || []) {
    out.push(n);
    const children = n.Children || n.Nodes;
    if (children && children.length) out.push(...flatten(children));
  }
  return out;
}

*/

