import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import {InsertTables, OrderStatus, Tables, UpdateTables} from "@/src/types";
import {useAuth} from "@/src/providers/AuthProvider";

export const useAdminOrderList = ({ archived = false}) => {
    const statuses: OrderStatus[] = archived
        ? ['Delivered']
        : ['New', 'Cooking', 'Delivering'];

    return useQuery<Tables<'orders'>[]>({
        queryKey: ['orders', { archived }],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .in('status', statuses)
                .order('created_at', { ascending: false });
            if (error) {
                throw new Error(error.message);
            }
            return data;
        },
    });
};

export const useMyOrderList = () => {
    const { session } = useAuth();
    const id = session?.user.id

    return useQuery<Tables<'orders'>[]>({
        queryKey: ['orders', { userId: id }],
        queryFn: async () => {
            if (!id) return [];

            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', id)
                .order('created_at', { ascending: false });
            if (error) {
                throw new Error(error.message);
            }
            return data;
        },
    });
};

export const useOrderDetails = (id: number) => {
    return useQuery({
        queryKey: ['order', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('orders')
                .select('*, order_items(*, products(*))')
                .eq('id', id)
                .single();

            if (error) {
                throw new Error(error.message);
            }

            return data;
        },
    });
};

export const useInsertOrder = () => {
    const queryClient = useQueryClient();
    const { session } = useAuth();
    const id = session?.user.id

    return useMutation({
        async mutationFn(data: InsertTables<'orders'>) {
            const { error, data: newOrder } = await supabase
                .from('orders')
                .insert({
                    ...data,
                    user_id: id
                })
                .select()
                .single();

            if (error) {
                throw new Error(error.message);
            }

            return newOrder
        },
        async onSuccess() {
            await queryClient.invalidateQueries({ queryKey: ['orders']});
        },
        onError(error) {
            console.log(error);
        },
    });
};

export const useUpdateOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        async mutationFn(
            {
                id,
                updatedFields
            }: {
                id: number,
                updatedFields: UpdateTables<'orders'>
            })
        {
            const { data: updatedOrder, error } = await supabase
                .from('orders')
                .update(updatedFields)
                .eq('id', id)
                .select();

            if (error) {
                throw error;
            }
            return updatedOrder;
        },
        async onSuccess(_, { id }) {
            await queryClient.invalidateQueries({queryKey: ['orders']});
            await queryClient.invalidateQueries({queryKey: ['order', id]});
        },
        onError(error) {
            console.log(error);
        },
    });
};
