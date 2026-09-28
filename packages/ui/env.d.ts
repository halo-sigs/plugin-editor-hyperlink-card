/// <reference types="vite/client" />
/// <reference types="unplugin-icons/types/vue" />

import "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    mute?: boolean;
  }
}

declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
