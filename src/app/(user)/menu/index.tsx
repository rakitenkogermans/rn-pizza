import {View} from '@/src/components/Themed';
import {products} from "@/assets/data/products";
import {ProductListItem} from "@/src/components/ProductListItem";
import {FlatList, StyleSheet} from "react-native";


export default function MenuScreen() {
  return (
      <View>
        <FlatList
            data={products}
            renderItem={({item}) => <ProductListItem product={item} /> }
            keyExtractor={(item)=>item.name}
            numColumns={2}
            contentContainerStyle={styles.container}
            columnWrapperStyle={styles.columnWrapper}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {gap: 10, padding: 10,},
  columnWrapper: {gap: 10},
})
