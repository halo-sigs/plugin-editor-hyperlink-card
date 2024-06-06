import resetStyles from '@unocss/reset/tailwind.css?inline';
import { LitElement, css, html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { SiteData } from '../types';
export class HyperlinkSmallCard extends LitElement {
  @property({ type: String })
  href: string = '';

  @property({ type: Object })
  siteData?: SiteData;
  override render() {
    return html`
      <div class="items-center relative flex p-2 gap-3">
        ${this.siteData?.image
          ? html`<div class="flex-none w-8 z-[1] aspect-square">
              <img
                class="rounded-lg size-full object-cover"
                src=${this.siteData.icon || this.siteData?.image}
              />
            </div>`
          : ''}

        <h2 class="font-semibold text-base whitespace-nowrap truncate text-title">
          ${this.siteData?.title}
        </h2>
        <p class="text-sm truncate text-description">${this.siteData?.description}</p>
      </div>
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

customElements.get('hyperlink-small-card') ||
  customElements.define('hyperlink-small-card', HyperlinkSmallCard);

declare global {
  interface HTMLElementTagNameMap {
    'hyperlink-small-card': HyperlinkSmallCard;
  }
}
