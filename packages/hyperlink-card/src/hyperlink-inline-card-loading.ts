import resetStyles from '@unocss/reset/tailwind.css?inline';
import { LitElement, css, html, unsafeCSS } from 'lit';

export class HyperlinkInlineCardLoading extends LitElement {
  override render() {
    return html`
      <span
        class="inline-flex items-center group space-x-1.5 px-1.5 text-inline-title bg-inline-card text-[90%] rounded transition-all mx-1 py-0.5"
      >
        <div class="size-4 bg-skeleton rounded-sm animate-pulse"></div>
        <div class="h-3 bg-skeleton rounded animate-pulse w-16"></div>
      </span>
    `;
  }

  static override styles = [
    unsafeCSS(resetStyles),
    css`
      :host {
        display: inline-block;
        vertical-align: middle;
      }

      @unocss-placeholder;
    `,
  ];
}

customElements.get('hyperlink-inline-card-loading') ||
  customElements.define('hyperlink-inline-card-loading', HyperlinkInlineCardLoading);

declare global {
  interface HTMLElementTagNameMap {
    'hyperlink-inline-card-loading': HyperlinkInlineCardLoading;
  }
}
