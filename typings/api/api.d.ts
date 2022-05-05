interface PaginationOptions {
  page: number;
  maxPerPage: number;
  sort?: string;
  direction?: "asc" | "dsc";
}

interface PaginationsRes {
  page: number;
  max_per_page: number;
  from: number;
  to: number;
  total: number;
}

interface PaginationReq {
  limit: number;
  offset: number;
}
