export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            listings: {
                Row: {
                    available: boolean
                    category: string | null
                    condition: string | null
                    createdAt: string
                    currency: string
                    description: string | null
                    id: string
                    images: string[] | null
                    lastChecked: string
                    listingUrl: string
                    marketplace: string
                    marketplaceId: string
                    price: number
                    sellerName: string | null
                    sellerRating: number | null
                    title: string
                    updatedAt: string
                }
                Insert: Record<string, unknown>
                Update: Record<string, unknown>
            }
            recommendations: {
                Row: {
                    createdAt: string
                    dismissedAt: string | null
                    id: string
                    listingId: string
                    priority: number
                    purchasedAt: string | null
                    status: string
                    updatedAt: string
                    userId: string
                    viewedAt: string | null
                }
                Insert: Record<string, unknown>
                Update: Record<string, unknown>
            }
            user_preferences: {
                Row: {
                    categories: string[] | null
                    createdAt: string
                    id: string
                    isActive: boolean
                    keywords: string[] | null
                    marketplaces: string[] | null
                    maxPrice: number | null
                    minPrice: number | null
                    name: string
                    updatedAt: string
                    userId: string
                }
                Insert: Record<string, unknown>
                Update: Record<string, unknown>
            }
        }
    }
}
