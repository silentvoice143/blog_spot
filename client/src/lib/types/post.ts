export interface Author {
    _id: string;
    name: string;
}

export interface Comment {
    // add fields later based on your comment schema
}

export interface Post {
    _id: string;
    title: string;
    description: string;
    content: string;
    picture: string;
    author: Author;
    tags: string[];
    view: number;
    status: "draft" | "publish" | "scheduled";
    scheduledFor: string | null;
    publishedAt: string | null;
    lastSavedAt: string | null;
    comments: Comment[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}