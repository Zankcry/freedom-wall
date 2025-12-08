export interface Post {
  id: number;
  created_at: string;
  message: string;
  images: string[] | null;
  codename: string;
  is_approved: boolean;
  is_deleted?: boolean;
}

export interface PostInsert {
  message: string;
  images?: string[] | null;
  codename: string;
  is_approved?: boolean;
}

export interface Like {
  id: number;
  post_id: number;
  user_identifier: string;
  created_at: string;
}

export interface Comment {
  id: number;
  post_id: number;
  codename: string;
  message: string;
  created_at: string;
  is_approved: boolean;
}

export interface CommentInsert {
  codename: string;
  message: string;
}
