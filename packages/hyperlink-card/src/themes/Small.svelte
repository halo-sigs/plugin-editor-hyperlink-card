<script lang="ts">
  import type { SiteData } from "../types";

  let { siteData }: { siteData?: SiteData } = $props();

  let image = $derived(siteData?.icon || siteData?.image);
</script>

<div class="items-center w-full relative flex p-2 gap-3">
  {#if image}
    <div class="flex-none w-8 z-[1] aspect-square">
      <img class="rounded-lg size-full object-cover" src={image} alt={siteData?.title} referrerpolicy="no-referrer" />
    </div>
  {/if}

  <h2 class="font-semibold text-base whitespace-nowrap truncate text-title">
    {siteData?.title}
  </h2>
  <p class="text-sm truncate text-description">
    {siteData?.description}
  </p>
</div>

<style>
  :host {
    display: inline-block;
    width: 100%;
  }
</style>
