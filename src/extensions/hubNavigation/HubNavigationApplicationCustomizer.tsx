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
export default class HubNavigationApplicationCustomizer
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

