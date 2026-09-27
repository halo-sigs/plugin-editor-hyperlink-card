import { axiosInstance } from "@halo-dev/api-client";
import { ConsoleApiHyperlinkHaloRunV1alpha1LinkApi } from "./generated";

export const hyperlinkApi = new ConsoleApiHyperlinkHaloRunV1alpha1LinkApi(
  undefined,
  "",
  axiosInstance
);
