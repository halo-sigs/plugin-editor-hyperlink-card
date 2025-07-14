import resetStyles from '@unocss/reset/tailwind.css?inline';
import { LitElement, css, html, unsafeCSS } from 'lit';
import { property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { SiteData } from '../types';
import { customDescriptionContext, customTitleContext } from '../context';
import { consume } from '@lit/context';

export class HyperlinkGridCard extends LitElement {
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
    return html`<div class="items-center relative grid grid-cols-12 p-2 gap-3">
      ${this.siteData?.image
        ? html`
            <div
              class="h-full z-0 w-full rounded-b-none absolute inset-0 rounded-t-md bg-cover bg-center bg-no-repeat"
              style=${styleMap({
                backgroundImage: `var(--halo-hyperlink-card-bg-gradient,linear-gradient(#f2f2f2, #f2f2f2), linear-gradient(#000000, #000000)), url('${this.siteData.image || this.siteData.icon}')`,
                backgroundBlendMode: `luminosity, overlay, normal`,
                transform: `scale(1.5) translate3d(0, 0, 0)`,
                filter: `blur(64px) saturate(4) contrast(90%)`,
              })}
            ></div>
          `
        : ''}
      ${this.siteData?.image || this.siteData?.icon
        ? html`<div class="col-span-12 z-[1]">
            <img
              class="rounded-lg size-full object-cover aspect-16/9"
              src=${this.siteData?.image || this.siteData?.icon || ''}
              referrerpolicy="no-referrer"
            />
          </div>`
        : ''}

      <div class="col-span-12 space-y-1 z-[1]">
        <div class="text-link text-xs line-clamp-1">${this.siteData?.url}</div>
        <h2 class="font-semibold text-base text-title line-clamp-2">
          ${this.customTitle || this.siteData?.title}
        </h2>
        <p class="text-sm text-description line-clamp-2">
          ${this.customDescription || this.siteData?.description}
        </p>
      </div>
    </div>`;
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

customElements.get('hyperlink-grid-card') ||
  customElements.define('hyperlink-grid-card', HyperlinkGridCard);

declare global {
  interface HTMLElementTagNameMap {
    'hyperlink-grid-card': HyperlinkGridCard;
  }
}
