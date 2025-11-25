<svelte:options
    customElement={{
        tag: "hyperlink-inline-card",
        props: {
            href: { reflect: true, type: "String", attribute: "href" },
            target: { reflect: true, type: "String", attribute: "target" },
            customTitle: { reflect: true, type: "String", attribute: "custom-title" },
        },
    }}
/>

<script lang="ts">
    import { onMount } from "svelte";
    import type { SiteData } from "./types";

    let {
        href,
        target = "_self",
        customTitle,
    }: {
        href: string;
        target: "_blank" | "_self";
        customTitle?: string;
    } = $props();

    let loading = $state(false);
    let siteData = $state<SiteData>();

    async function fetchSiteData() {
        try {
            loading = true;
            const response = await fetch(`/apis/api.hyperlink.halo.run/v1alpha1/link-detail?url=${href}`);

            if (!response.ok) {
                throw new Error("Failed to fetch site data");
            }

            siteData = (await response.json()) as SiteData;
        } finally {
            loading = false;
        }
    }

    onMount(() => {
        fetchSiteData();
    });
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
    >
        {#if !!siteData.icon || !!siteData.image}
            <img
                class="size-4 rounded-sm"
                src={siteData.icon || siteData.image || ""}
                alt={siteData.title}
                referrerpolicy="no-referrer"
            />
        {/if}
        <span>{customTitle || siteData.title || href}</span>
        {#if !href.startsWith(location.origin)}
            <span class="i-tabler-external-link text-inline-title"></span>
        {/if}
    </a>
{:else}
    <a class="text-indigo-600" {href} {target}>
        {customTitle || href}
    </a>
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
            font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
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
