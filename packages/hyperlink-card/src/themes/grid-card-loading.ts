import resetStyles from '@unocss/reset/tailwind.css?inline';
import { LitElement, css, html, unsafeCSS } from 'lit';

export class HyperlinkGridCardLoading extends LitElement {
  override render() {
    return html`
      <div class="items-center relative grid grid-cols-12 p-2 gap-3">
        <div class="col-span-12 z-[1]">
          <div class="bg-skeleton rounded-lg size-full aspect-16/9 animate-pulse"></div>
        </div>

        <div class="col-span-12 space-y-1 z-[1]">
          <div class="h-3 bg-skeleton rounded animate-pulse w-1/3"></div>

          <div class="space-y-1">
            <div class="h-4 bg-skeleton rounded animate-pulse w-4/5"></div>
            <div class="h-4 bg-skeleton rounded animate-pulse w-3/5"></div>
          </div>

          <div class="space-y-1">
            <div class="h-3 bg-skeleton rounded animate-pulse w-full"></div>
            <div class="h-3 bg-skeleton rounded animate-pulse w-2/3"></div>
          </div>
        </div>
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

customElements.get('hyperlink-grid-card-loading') ||
  customElements.define('hyperlink-grid-card-loading', HyperlinkGridCardLoading);

declare global {
  interface HTMLElementTagNameMap {
    'hyperlink-grid-card-loading': HyperlinkGridCardLoading;
  }
}
