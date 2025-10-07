export type Teacher = {
    id: number | string;
    user?: any;
    name: string;
    subject: string;
    description: string;
    image?: string | null;
    rating?: number | null;
    blocked?: boolean;
    linkedin?: string;
    instagram?: string;
};

export type Filters = {
    status: 'all' | 'active' | 'blocked';
    minRating: number | null;
    subject: string;
};
