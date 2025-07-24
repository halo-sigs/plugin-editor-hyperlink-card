import resetStyles from '@unocss/reset/tailwind.css?inline';
import { LitElement, css, html, unsafeCSS } from 'lit';
import { property, state } from 'lit/decorators.js';
import './themes/grid-card';
import './themes/grid-card-loading';
import './themes/regular-card';
import './themes/regular-card-loading';
import './themes/small-card';
import './themes/small-card-loading';
import { SiteData } from './types';
import { provide } from '@lit/context';
import { customDescriptionContext, customTitleContext } from './context';

export class HyperlinkCard extends LitElement {
  @property({ type: String })
  href = '';

  @provide({ context: customTitleContext })
  @property({ type: String, attribute: 'custom-title' })
  customTitle?: string;

  @provide({ context: customDescriptionContext })
  @property({ type: String, attribute: 'custom-description' })
  customDescription?: string;

  @property({ type: String })
  target: '_blank' | '_self' = '_self';

  @property({ type: String })
  theme: 'small' | 'regular' | 'grid' = 'regular';

  @state()
  siteData?: SiteData;

  @state()
  loading = false;

  override connectedCallback() {
    super.connectedCallback();
    this.fetchSiteData();
  }

  async fetchSiteData() {
    try {
      this.loading = true;
      const response = await fetch(
        `/apis/api.hyperlink.halo.run/v1alpha1/link-detail?url=${this.href}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch site data');
      }

      this.siteData = (await response.json()) as SiteData;
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  override render() {
    return html`
      <a
        href=${this.href}
        target=${this.target}
        class="border h-full border-card relative flex rounded-xl overflow-hidden border-hover-card bg-card transition-all"
      >
        ${this.renderContent()}
      </a>
    `;
  }

  renderContent() {
    if (this.loading) {
      switch (this.theme) {
        case 'small':
          return html`<hyperlink-small-card-loading></hyperlink-small-card-loading>`;
        case 'grid':
          return html`<hyperlink-grid-card-loading></hyperlink-grid-card-loading>`;
        default:
          return html`<hyperlink-regular-card-loading></hyperlink-regular-card-loading>`;
      }
    }
    if (this.siteData) {
      switch (this.theme) {
        case 'small':
          return html`<hyperlink-small-card
            .href=${this.href}
            .siteData=${this.siteData}
          ></hyperlink-small-card>`;
        case 'grid':
          return html`<hyperlink-grid-card
            .href=${this.href}
            .siteData=${this.siteData}
          ></hyperlink-grid-card>`;
        default:
          return html`<hyperlink-regular-card
            .href=${this.href}
            .siteData=${this.siteData}
          ></hyperlink-regular-card>`;
      }
    }
    return html`<span class="text-link text-xs p-1 px-2">${this.href}</span>`;
  }

  static override styles = [
    unsafeCSS(resetStyles),
    css`
      :host {
        display: inline-block;
        width: 100%;
      }
      @unocss-placeholder;
    `,
  ];
}

customElements.get('hyperlink-card') || customElements.define('hyperlink-card', HyperlinkCard);

declare global {
  interface HTMLElementTagNameMap {
    'hyperlink-card': HyperlinkCard;
  }
}
