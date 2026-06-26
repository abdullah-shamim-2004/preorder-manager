export type PreorderWhen = "REGARDLESS_OF_STOCK" | "WHEN_OUT_OF_STOCK";
export type SortField = "name" | "createdAt" | "startsAt" | "endsAt";
export type SortOrder = "asc" | "desc";
export type FilterTab = "all" | "active" | "inactive";

export interface Preorder {
  id: string;
  name: string;
  products: number;
  preorderWhen: PreorderWhen;
  startsAt: string;
  endsAt: string | null;
  status: boolean;
}
