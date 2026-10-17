import type { CmsEnv } from "./types";

export interface RequestSpec {
  url: string;
  headers: Record<string, string>;
}

export function buildRequest(env: CmsEnv): RequestSpec {
  const cleanUrl = (env.apiUrl || "").replace(/\/+$/, "");
  return {
    url: `${cleanUrl}/api/v1/site/config`,
    headers: {
      "X-Site-Id": env.siteId || "",
      "X-Site-Secret": env.siteSecret || "",
      Accept: "application/json",
    },
  };
}
