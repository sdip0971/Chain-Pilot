import { parseAsInteger, parseAsString } from "nuqs/server";
import { pagination } from "@/config/constants";
export const workflowParams = {
  page: parseAsInteger
    .withDefault(pagination.Default_Page)
    .withOptions({ clearOnDefault: true }),
  // means that when page hits default route i.e page =1
  //all other searchparams are cleared
  // ?search="electronics"?page=3 to ?page=1
  // then it clears page=1 because it is default

  pageSize: parseAsInteger
    .withDefault(pagination.Default_Page_Size)
    .withOptions({ clearOnDefault: true }),

  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
};
export const CredentialParams = {
  page: parseAsInteger
    .withDefault(pagination.Default_Page)
    .withOptions({ clearOnDefault: true }),
  // means that when page hits default route i.e page =1
  //all other searchparams are cleared
  // ?search="electronics"?page=3 to ?page=1
  // then it clears page=1 because it is default

  pageSize: parseAsInteger
    .withDefault(pagination.Default_Page_Size)
    .withOptions({ clearOnDefault: true }),

  search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
};
export const ExecutionParams = {
  page: parseAsInteger
    .withDefault(pagination.Default_Page)
    .withOptions({ clearOnDefault: true }),
  // means that when page hits default route i.e page =1
  //all other searchparams are cleared
  // ?search="electronics"?page=3 to ?page=1
  // then it clears page=1 because it is default

  pageSize: parseAsInteger
    .withDefault(pagination.Default_Page_Size)
    .withOptions({ clearOnDefault: true }),


};