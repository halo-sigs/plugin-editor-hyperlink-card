import resetStyles from '@unocss/reset/tailwind.css?inline';
import { LitElement, css, html, unsafeCSS } from 'lit';
import { property, state } from 'lit/decorators.js';
import './loading-bar';
import './themes/grid-card';
import './themes/regular-card';
import './themes/small-card';
import { SiteData } from './types';

export class HyperlinkCard extends LitElement {
  @property({ type: String })
  href = '';

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
    // Mock
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

  renderCard() {
    switch (this.theme) {
      case 'small':
        return html`<hyperlink-small-card
          .href=${this.href}
          .siteData=${this.siteData}
        ></hyperlink-small-card>`;
      case 'regular':
        return html`<hyperlink-regular-card
          .href=${this.href}
          .siteData=${this.siteData}
        ></hyperlink-regular-card>`;
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

  override render() {
    if (this.loading) {
      return html`<loading-bar></loading-bar>`;
    }

    return html`
      <a
        href=${this.href}
        target=${this.target}
        class="border h-full border-card relative flex rounded-xl overflow-hidden border-hover-card bg-card transition-all"
      >
        ${this.siteData
          ? html` ${this.renderCard()} `
          : html`<span class="text-link text-xs p-1 px-2">${this.href}</span>`}
      </a>
    `;
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