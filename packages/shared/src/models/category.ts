export interface Category {
  id: string;
  parent_id?: string;
  name: string;
  attribute_schema?: unknown; // JSON schema
}

