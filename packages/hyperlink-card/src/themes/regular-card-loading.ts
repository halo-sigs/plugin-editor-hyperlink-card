import resetStyles from '@unocss/reset/tailwind.css?inline';
import { LitElement, css, html, unsafeCSS } from 'lit';

export class HyperlinkRegularCardLoading extends LitElement {
  override render() {
    return html`
      <div class="items-center flex flex-col sm:flex-row relative p-2 gap-3">
        <div
          class="aspect-16/9 w-full sm:w-56 flex-none z-[1] bg-skeleton rounded-lg animate-pulse"
        ></div>

        <div class="flex-auto shrink space-y-1 z-[1] overflow-hidden w-full">
          <div class="h-3 bg-skeleton rounded animate-pulse w-1/3"></div>

          <div class="space-y-1">
            <div class="h-4 bg-skeleton rounded animate-pulse w-4/5"></div>
            <div class="h-4 bg-skeleton rounded animate-pulse w-3/5 hidden lg:block"></div>
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

customElements.get('hyperlink-regular-card-loading') ||
  customElements.define('hyperlink-regular-card-loading', HyperlinkRegularCardLoading);

declare global {
  interface HTMLElementTagNameMap {
    'hyperlink-regular-card-loading': HyperlinkRegularCardLoading;
  }
}
