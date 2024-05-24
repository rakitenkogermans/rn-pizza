import {ProductListItem} from "@/src/components/ProductListItem";
import {ActivityIndicator, FlatList, StyleSheet, Text} from "react-native";
import {useProductList} from "@/src/api/products";


export default function MenuScreen() {
    const { data: products, isLoading, error } = useProductList();

    if (isLoading) {
        return <ActivityIndicator />;
    }
    if (error) {
        return <Text>Failed to fetch products</Text>;
    }

  return (
      <FlatList
          data={products}
          renderItem={({item}) => <ProductListItem product={item} /> }
          keyExtractor={(item)=>item.name}
          numColumns={2}
          contentContainerStyle={styles.container}
          columnWrapperStyle={styles.columnWrapper}
      />
  );
}

const styles = StyleSheet.create({
  container: {gap: 10, padding: 10,},
  columnWrapper: {gap: 10},
})
