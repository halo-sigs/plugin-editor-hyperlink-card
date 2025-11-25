<svelte:options
    customElement={{
        tag: "hyperlink-card",
        props: {
            href: { reflect: true, type: "String", attribute: "href" },
            target: { reflect: true, type: "String", attribute: "target" },
            theme: { reflect: true, type: "String", attribute: "theme" },
            customTitle: { reflect: true, type: "String", attribute: "custom-title" },
            customDescription: { reflect: true, type: "String", attribute: "custom-description" },
        },
    }}
/>

<script lang="ts">
    import { onMount } from "svelte";
    import GridLoading from "./themes/GridLoading.svelte";
    import RegularLoading from "./themes/RegularLoading.svelte";
    import SmallLoading from "./themes/SmallLoading.svelte";
    import type { SiteData } from "./types";

    let {
        href,
        target = "_self",
        theme = "regular",
        customTitle,
        customDescription,
    }: {
        href: string;
        target: "_blank" | "_self";
        theme: "small" | "regular" | "grid";
        customTitle?: string;
        customDescription?: string;
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

    const themes = {
        regular: {
            component: import("./themes/Regular.svelte"),
            loadingComponent: RegularLoading,
        },
        grid: {
            component: import("./themes/Grid.svelte"),
            loadingComponent: GridLoading,
        },
        small: {
            component: import("./themes/Small.svelte"),
            loadingComponent: SmallLoading,
        },
    };

    let ThemeComponent = $derived(themes[theme as keyof typeof themes].component);
    let LoadingComponent = $derived(themes[theme as keyof typeof themes].loadingComponent);
</script>

<a
    {href}
    {target}
    class="border w-full border-card relative flex rounded-xl overflow-hidden border-hover-card bg-card transition-all"
>
    {#if loading}
        <LoadingComponent />
    {:else if siteData}
        {#await ThemeComponent}
            <LoadingComponent />
        {:then { default: Component }}
            <Component {siteData} {customTitle} {customDescription} />
        {/await}
    {:else}
        <span class="text-link text-xs p-1 px-2">{customTitle || href}</span>
    {/if}
</a>

<style>
    :host {
        display: inline-block;
        width: 100%;
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
