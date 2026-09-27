<svelte:options
  customElement={{
    tag: "hyperlink-inline-card",
    props: {
      mode: { reflect: true, type: "String", attribute: "data-mode" },
      href: { reflect: true, type: "String", attribute: "href" },
      target: { reflect: true, type: "String", attribute: "target" },
      customTitle: { reflect: true, type: "String", attribute: "custom-title" },
      customImage: { reflect: true, type: "String", attribute: "custom-image" },
      customIcon: { reflect: true, type: "String", attribute: "custom-icon" },
    },
  }}
/>

<script lang="ts">
  import { canFetchOnline, savedSiteData, fetchSiteData } from "./site-data";
  import type { SiteData } from "./types";

  let {
    href,
    mode,
    target = "_self",
    customTitle,
    customImage,
    customIcon,
  }: {
    href: string;
    mode?: string;
    target: "_blank" | "_self";
    customTitle?: string;
    customImage?: string;
    customIcon?: string;
  } = $props();

  let loading = $state(false);
  let siteData = $state<SiteData>();

  $effect(() => {
    const controller = new AbortController();
    const saved = savedSiteData(href, customTitle, undefined, customImage, customIcon);
    const title = customTitle;
    const description = undefined;
    const image = customImage;
    const icon = customIcon;
    siteData = saved;
    loading = false;
    if (href && canFetchOnline(mode)) {
      loading = true;
      fetchSiteData(href, controller.signal)
        .then((data) => {
          if (!controller.signal.aborted) {
            siteData = {
              ...data,
              title: title || data.title || href,
              description: description || data.description,
              image: image || data.image,
              icon: icon || image || data.icon,
            };
          }
        })
        .catch(() => {
          /* Keep saved metadata or the URL when fetching fails. */
        })
        .finally(() => {
          if (!controller.signal.aborted) loading = false;
        });
    }
    return () => controller.abort();
  });

  let rel = $derived(target === "_blank" ? "noopener" : undefined);

  let image = $derived(siteData?.icon || siteData?.image);
</script>

{#if loading}
  <span
    class="inline-flex items-center group space-x-1.5 px-1.5 text-inline-title bg-inline-card text-[90%] rounded transition-all mx-1 py-0.5"
  >
    <div class="size-4 bg-skeleton rounded-sm animate-pulse"></div>
    <div class="h-3 bg-skeleton rounded animate-pulse w-16"></div>
  </span>
{:else if siteData}
  <a
    class="inline-flex items-center group space-x-1.5 px-1.5 text-inline-title bg-hover-inline-card text-[90%] rounded bg-inline-card transition-all mx-1 py-0.5"
    {href}
    {target}
    {rel}
  >
    {#if image}
      <img class="size-4 rounded-sm" src={image} alt={siteData?.title} referrerpolicy="no-referrer" />
    {/if}
    <span>{siteData?.title || href}</span>
    {#if !href.startsWith(location.origin)}
      <span class="i-tabler-external-link text-inline-title"></span>
    {/if}
  </a>
{:else}
  <a class="text-indigo-600" {href} {target} {rel}> {href}</a>
{/if}

<style>
  :host {
    display: inline-block;
    vertical-align: middle;
  }

  :global {
    *,
    ::before,
    ::after {
      box-sizing: border-box;
      border-width: 0;
      border-style: solid;
      border-color: var(--un-default-border-color, #e5e7eb);
    }

    :host {
      line-height: 1.5;
      -webkit-text-size-adjust: 100%;
      font-family:
        ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
        "Noto Color Emoji";
      font-feature-settings: normal;
      font-variation-settings: normal;
      -webkit-tap-highlight-color: transparent;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p {
      margin: 0;
      font-size: inherit;
      font-weight: inherit;
    }

    a {
      color: inherit;
      text-decoration: inherit;
    }

    img {
      display: block;
      max-width: 100%;
      height: auto;
    }

    [hidden]:where(:not([hidden="until-found"])) {
      display: none;
    }
  }
</style>
