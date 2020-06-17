export interface Links {
  first: string;
  last: string;
  prev?: string;
  next?: string;
}

export interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface JsonResource<T> {
  data: T;
}

export interface JsonResourceCollection<T> {
  data: T[];
  links: Links;
  meta: Meta;
}

export interface AnonymousJsonResource extends JsonResource<any> {}
export interface AnonymousJsonResourceCollection extends JsonResourceCollection<any> {}
