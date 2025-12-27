<script lang="ts">
  import type { SiteData } from "../types";

  let {
    siteData,
    customTitle,
    customDescription,
    customImage,
  }: { siteData?: SiteData; customTitle?: string; customDescription?: string; customImage?: string } = $props();

  let isOnlyIcon = $derived(!siteData?.image && !customImage && siteData?.icon);
  let image = $derived(customImage || siteData?.image);
  let title = $derived(customTitle || siteData?.title);
  let description = $derived(customDescription || siteData?.description);
</script>

<div
  class="items-center w-full flex sm:flex-row relative p-2 gap-3"
  class:flex-row={isOnlyIcon}
  class:flex-col={!isOnlyIcon}
>
  {#if image}
    <div
      class="h-full z-0 w-full rounded-b-none absolute inset-0 rounded-t-md bg-cover bg-center bg-no-repeat"
      style:background-image={`var(--halo-hyperlink-card-bg-gradient,linear-gradient(#f2f2f2, #f2f2f2), linear-gradient(#000000, #000000)), url('${image || siteData?.icon}')`}
      style:background-blend-mode="luminosity, overlay, normal"
      style:transform="scale(1.5) translate3d(0, 0, 0)"
      style:filter="blur(64px) saturate(4) contrast(90%)"
    ></div>
    <div class="aspect-16/9 w-full sm:w-56 flex-none z-[1]">
      <img class="rounded-lg size-full object-cover" src={image} alt={title} referrerpolicy="no-referrer" />
    </div>
  {/if}

  {#if isOnlyIcon}
    <div class="aspect-square w-18 flex-none z-[1]">
      <img class="rounded-lg size-full object-cover" src={siteData?.icon} alt={title} referrerpolicy="no-referrer" />
    </div>
  {/if}

  <div class="flex-auto shrink space-y-1 z-[1] text-ellipsis overflow-hidden w-full">
    <div>
      <span class="text-link text-xs line-clamp-1">{siteData?.url}</span>
    </div>
    <div>
      <h2 class="font-semibold text-base text-title line-clamp-2 lg:line-clamp-1">
        {title}
      </h2>
    </div>
    <p class="text-sm text-description ${isOnlyIcon ? 'line-clamp-1' : 'line-clamp-2'}">
      {description}
    </p>
  </div>
</div>

<style>
  :host {
    display: inline-block;
    width: 100%;
  }
</style>
