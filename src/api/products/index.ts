import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import {Tables} from "@/src/types";

export const useProductList = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const { data, error } = await supabase.from('products').select('*');
            if (error) {
                throw new Error(error.message);
            }
            return data;
        },
    });
};

export const useProduct = (id: number) => {
    return useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();
            if (error) {
                throw new Error(error.message);
            }
            return data;
        },
    });
};


export const useInsertProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        async mutationFn(data: Omit<Tables<'products'>, 'id'>) {
            const { error, data: newProduct } = await supabase.from('products').insert({
                name: data.name,
                price: data.price,
                image: data.image,
            });

            if (error) {
                throw new Error(error.message);
            }

            return newProduct
        },
        async onSuccess() {
            await queryClient.invalidateQueries({ queryKey: ['products']});
        },
        onError(error) {
            console.log(error);
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        async mutationFn({ id, ...update }: Tables<'products'>) {
            const { data, error } = await supabase
                .from('products')
                .update(update)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                throw new Error(error.message);
            }
            return data;
        },
        async onSuccess(_, { id }) {
            await queryClient.invalidateQueries({queryKey: ['products']});
            await queryClient.invalidateQueries({ queryKey: ['product', id]});
        },
        onError(error) {
            console.log(error);
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        async mutationFn(id: Tables<'products'>['id']) {
            const { data, error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) {
                throw new Error(error.message);
            }
            return data;
        },
        async onSuccess(_, id) {
            await queryClient.invalidateQueries({queryKey: ['products']});
            await queryClient.invalidateQueries({ queryKey: ['product', id]});
        },
        onError(error) {
            console.log(error);
        },
    });
};
