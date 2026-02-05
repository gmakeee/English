export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    first_name: string | null
                    balance: number
                    streak: number
                    daily_message_id: number | null
                }
                Insert: {
                    id: string
                    first_name?: string | null
                    balance?: number
                    streak?: number
                    daily_message_id?: number | null
                }
                Update: {
                    id?: string
                    first_name?: string | null
                    balance?: number
                    streak?: number
                    daily_message_id?: number | null
                }
            }
            dictionary: {
                Row: {
                    id: number
                    word: string
                    translation: string
                    example: string | null
                    audio_url: string | null
                    is_rare: boolean
                }
                Insert: {
                    id?: number
                    word: string
                    translation: string
                    example?: string | null
                    audio_url?: string | null
                    is_rare?: boolean
                }
                Update: {
                    id?: number
                    word?: string
                    translation?: string
                    example?: string | null
                    audio_url?: string | null
                    is_rare?: boolean
                }
            }
            user_progress: {
                Row: {
                    user_id: string
                    word_id: number
                    next_review: string | null
                    interval: number | null
                    ease_factor: number | null
                }
                Insert: {
                    user_id: string
                    word_id: number
                    next_review?: string | null
                    interval?: number | null
                    ease_factor?: number | null
                }
                Update: {
                    user_id?: string
                    word_id?: number
                    next_review?: string | null
                    interval?: number | null
                    ease_factor?: number | null
                }
            }
        }
    }
}
