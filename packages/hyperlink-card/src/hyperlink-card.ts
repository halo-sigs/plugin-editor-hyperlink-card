import resetStyles from '@unocss/reset/tailwind.css?inline';
import { LitElement, css, html, unsafeCSS } from 'lit';
import { property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import './loading-bar';

export class HyperlinkCard extends LitElement {
  @property({ type: String })
  href = location.href; // Mock

  @property({ type: String })
  target: '_blank' | '_self' = '_self';

  @property({ type: String })
  theme: 'normal' | 'big' = 'normal';

  // Mock
  @state()
  siteTitle = '';

  @state()
  siteDescription = '';

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
      const response = await fetch(this.href);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const title = doc.querySelector('title')?.textContent;
      const description = doc.querySelector('meta[name="description"]')?.getAttribute('content');
      this.siteTitle = title || '';
      this.siteDescription = description || '';
    } catch (error) {
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  override render() {
    return this.loading
      ? html`<loading-bar></loading-bar>`
      : html`
          <a
            href=${this.href}
            target=${this.target}
            class="border items-center relative rounded-xl overflow-hidden grid grid-cols-12 p-2 gap-3 hover:border-indigo-400 transition-all"
          >
            <div
              class="h-full z-0 w-full rounded-b-none absolute inset-0 rounded-t-md bg-cover bg-center bg-no-repeat"
              style=${styleMap({
                backgroundImage: `linear-gradient(#f2f2f2, #f2f2f2), linear-gradient(#000000, #000000), url('https://repository-images.githubusercontent.com/126178683/adbb35f3-5a34-48a3-8183-1c1da0b3a3ac')`,
                backgroundBlendMode: `luminosity, overlay, normal`,
                transform: `scale(1.5) translate3d(0, 0, 0)`,
                filter: `blur(64px) saturate(4) contrast(90%)`,
              })}
            ></div>
            <div class="col-span-12 lg:col-span-4 xl:col-span-3 z-[1]">
              <img
                class="rounded-lg size-full object-cover"
                src="https://repository-images.githubusercontent.com/126178683/adbb35f3-5a34-48a3-8183-1c1da0b3a3ac"
              />
            </div>
            <div class="col-span-12 lg:col-span-8 xl:col-span-9 space-y-1 z-[1]">
              <div>
                <span class="text-indigo-600 text-xs"> https://www.halo.run </span>
              </div>
              <div>
                <h2 class="font-semibold text-base">Halo - 强大易用的开源建站工具</h2>
              </div>
              <p class="text-sm text-zinc-500">
                Halo
                是一款强大易用的开源建站工具，配合上不同的模板与插件，可以很好地帮助你构建你心中的理想站点。
              </p>
            </div>
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
