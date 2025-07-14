import resetStyles from '@unocss/reset/tailwind.css?inline';
import { LitElement, css, html, unsafeCSS } from 'lit';
import { property, state } from 'lit/decorators.js';
import { SiteData } from '../types';
import { consume } from '@lit/context';
import { customDescriptionContext, customTitleContext } from '../context';
export class HyperlinkSmallCard extends LitElement {
  @property({ type: String })
  href: string = '';

  @consume({ context: customTitleContext, subscribe: true })
  @state()
  customTitle?: string;

  @consume({ context: customDescriptionContext, subscribe: true })
  @state()
  customDescription?: string;

  @property({ type: Object })
  siteData?: SiteData;
  override render() {
    return html`
      <div class="items-center relative flex p-2 gap-3">
        ${this.siteData?.image || this.siteData?.icon
          ? html`<div class="flex-none w-8 z-[1] aspect-square">
              <img
                class="rounded-lg size-full object-cover"
                src=${this.siteData.icon || this.siteData?.image || ''}
                referrerpolicy="no-referrer"
              />
            </div>`
          : ''}

        <h2 class="font-semibold text-base whitespace-nowrap truncate text-title">
          ${this.customTitle || this.siteData?.title}
        </h2>
        <p class="text-sm truncate text-description">
          ${this.customDescription || this.siteData?.description}
        </p>
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
