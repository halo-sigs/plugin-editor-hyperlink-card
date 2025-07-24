import resetStyles from '@unocss/reset/tailwind.css?inline';
import { LitElement, css, html, unsafeCSS } from 'lit';

export class HyperlinkSmallCardLoading extends LitElement {
  override render() {
    return html`
      <div class="items-center relative flex p-2 gap-3">
        <div class="flex-none w-8 z-[1] aspect-square bg-skeleton rounded-lg animate-pulse"></div>
        <div class="h-4 bg-skeleton rounded animate-pulse w-30"></div>
        <div class="h-3 bg-skeleton rounded animate-pulse w-40"></div>
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

customElements.get('hyperlink-small-card-loading') ||
  customElements.define('hyperlink-small-card-loading', HyperlinkSmallCardLoading);

declare global {
  interface HTMLElementTagNameMap {
    'hyperlink-small-card-loading': HyperlinkSmallCardLoading;
  }
}
