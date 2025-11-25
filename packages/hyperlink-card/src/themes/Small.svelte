<script lang="ts">
  import type { SiteData } from "../types";

  let {
    siteData,
    customTitle,
    customDescription,
  }: { siteData?: SiteData; customTitle?: string; customDescription?: string } =
    $props();
</script>

<div class="items-center w-full relative flex p-2 gap-3">
  {#if siteData?.image || siteData?.icon}
    <div class="flex-none w-8 z-[1] aspect-square">
      <img
        class="rounded-lg size-full object-cover"
        src={siteData?.icon || siteData?.image || ""}
        alt={siteData?.title}
        referrerpolicy="no-referrer"
      >
    </div>
  {/if}

  <h2 class="font-semibold text-base whitespace-nowrap truncate text-title">
    {customTitle || siteData?.title}
  </h2>
  <p class="text-sm truncate text-description">
    {customDescription || siteData?.description}
  </p>
</div>

<style>
  :host {
    display: inline-block;
    width: 100%;
  }
</style>
