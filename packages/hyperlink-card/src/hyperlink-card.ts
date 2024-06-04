import { LitElement, css, html, unsafeCSS } from 'lit';
import resetStyles from '@unocss/reset/tailwind.css?inline';
import { property, state } from 'lit/decorators.js';

export class HyperlinkCard extends LitElement {
  @property({ type: String })
  href = location.href; // Mock

  @property({ type: String })
  theme: 'normal' | 'big' = 'normal';

  // Mock
  @state()
  siteTitle = '';

  @state()
  siteDescription = '';

  override connectedCallback() {
    super.connectedCallback();
    this.fetchSiteData();
  }

  async fetchSiteData() {
    // Mock
    const response = await fetch(this.href);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const title = doc.querySelector('title')?.textContent;
    const description = doc.querySelector('meta[name="description"]')?.getAttribute('content');
    this.siteTitle = title || '';
    this.siteDescription = description || '';
  }

  override render() {
    return html`<a class="text-blue-600" href=${this.href}>${this.href}</a>
      <span>${this.siteTitle}</span>
      <span>${this.siteDescription}</span>`;
  }

  static override styles = [
    unsafeCSS(resetStyles),
    css`
      :host {
        display: inline-block;
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
