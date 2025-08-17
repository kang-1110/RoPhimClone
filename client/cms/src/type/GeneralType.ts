export interface DataGetListType {
  page?: number;
  limit?: number;
  keyword?: string | undefined;
  provinceId?: string;
  address?: string;
  sort_by?: string;
  sort_direction?: 'DESC' | 'ASC';
}

export interface ListResponseTypeObject<T> {
  total: number;
  rows: T[];
}
export interface ListResponseType<T> {
  code: number;
  results: {
    objects: ListResponseTypeObject<T>;
  };
}

export interface DetailResponseType<T> {
  code: number;
  results: {
    object: T;
  };
}
