export interface ICart {
    user_id: number;
    items: ICartItem[];
    total_items: number;
    total_price: number;
    created_at: Date;
    updated_at: Date;
}

export interface ICartItem {
    product_id: number;
    quantity: number;
    price: number;
    name: string;
    imageUrl: string;
    added_at: Date;
    updated_at?: Date;
}

export interface IFavourite {
    user_id: number;
    product_ids: number[];
    updated_at: Date;
}