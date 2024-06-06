import resetStyles from '@unocss/reset/tailwind.css?inline';
import { LitElement, css, html, unsafeCSS } from 'lit';
import { property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { SiteData } from '../types';

export class HyperlinkRegularCard extends LitElement {
  @property({ type: String })
  href: string = '';

  @property({ type: Object })
  siteData?: SiteData;

  override render() {
    return html`<div class="items-center flex flex-col sm:flex-row relative p-2 gap-3">
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
      ${this.siteData?.image
        ? html`<div class="aspect-16/9 w-full sm:w-56 flex-none z-[1]">
            <img class="rounded-lg size-full object-cover" src=${this.siteData?.image} />
          </div>`
        : ''}
      ${!this.siteData?.image && this.siteData?.icon
        ? html`<div class="aspect-square w-full sm:w-32 flex-none z-[1]">
            <img class="rounded-lg size-full object-cover" src=${this.siteData?.icon} />
          </div>`
        : ''}

      <div class="flex-1 shrink space-y-1 z-[1]">
        <div>
          <span class="text-link text-xs line-clamp-1">${this.siteData?.url}</span>
        </div>
        <div>
          <h2 class="font-semibold text-base text-title line-clamp-2 lg:line-clamp-1">
            ${this.siteData?.title}
          </h2>
        </div>
        <p class="text-sm text-description line-clamp-2">${this.siteData?.description}</p>
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

customElements.get('hyperlink-regular-card') ||
  customElements.define('hyperlink-regular-card', HyperlinkRegularCard);

declare global {
  interface HTMLElementTagNameMap {
    'hyperlink-regular-card': HyperlinkRegularCard;
  }
}
