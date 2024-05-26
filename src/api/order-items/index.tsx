import {useMutation} from "@tanstack/react-query";
import {supabase} from "@/src/lib/supabase";
import {InsertTables} from "@/src/types";

export const useInsertOrderItems = () => {
    return useMutation({
        async mutationFn(data: InsertTables<'order_items'>[]) {
            const { error, data: newOrderItems } = await supabase
                .from('order_items')
                .insert(data)
                .select();

            if (error) {
                throw new Error(error.message);
            }

            return newOrderItems;
        },
        onError(error) {
            console.log(error);
        },
    });
};
