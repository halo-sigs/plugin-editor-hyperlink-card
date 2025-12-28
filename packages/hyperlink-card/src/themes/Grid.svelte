<script lang="ts">
  import type { SiteData } from "../types";

  let { siteData }: { siteData?: SiteData } = $props();

  let image = $derived(siteData?.image || siteData?.icon);
</script>

<div class="items-center relative grid grid-cols-12 p-2 gap-3 size-full">
  {#if image}
    <div
      class="h-full z-0 w-full rounded-b-none absolute inset-0 rounded-t-md bg-cover bg-center bg-no-repeat"
      style:background-image={`var(--halo-hyperlink-card-bg-gradient,linear-gradient(#f2f2f2, #f2f2f2), linear-gradient(#000000, #000000)), url('${image}')`}
      style:background-blend-mode="luminosity, overlay, normal"
      style:transform="scale(1.5) translate3d(0, 0, 0)"
      style:filter="blur(64px) saturate(4) contrast(90%)"
    ></div>
    <div class="col-span-12 z-[1]">
      <img class="rounded-lg size-full object-cover aspect-16/9" src={image} alt={siteData?.title} referrerpolicy="no-referrer" />
    </div>
  {/if}

  <div class="col-span-12 space-y-1 z-[1]">
    <div class="text-link text-xs line-clamp-1">{siteData?.url}</div>
    <h2 class="font-semibold text-base text-title line-clamp-2">
      {siteData?.title}
    </h2>
    <p class="text-sm text-description line-clamp-2">
      {siteData?.description}
    </p>
  </div>
</div>

<style>
  :host {
    display: inline-block;
    width: 100%;
  }
</style>
