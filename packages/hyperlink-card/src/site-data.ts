import type { SiteData } from "./types";

declare global {
  interface Window {
    haloHyperlinkCard?: { onlineFetchEnabled?: boolean };
  }
}

export function canFetchOnline(mode?: string) {
  return mode !== "snapshot" && window.haloHyperlinkCard?.onlineFetchEnabled === true;
}

export function savedSiteData(
  href: string,
  title?: string,
  description?: string,
  image?: string,
  icon?: string
): SiteData {
  return { url: href, title: title || href, description, image, icon: icon || image };
}

export async function fetchSiteData(href: string, signal: AbortSignal): Promise<SiteData> {
  const response = await fetch(
    `/apis/api.hyperlink.halo.run/v1alpha1/link-detail?url=${encodeURIComponent(href)}`,
    { signal }
  );
  if (!response.ok) {
    throw new Error("Unable to fetch link information");
  }
  return response.json();
}
