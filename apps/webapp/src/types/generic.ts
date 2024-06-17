export interface PaginatedResponse<T> {
  page_number: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  data: T;
}

export type ObjectInObject = Record<number, Record<number, string>>;
