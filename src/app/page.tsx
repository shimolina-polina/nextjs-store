import styles from "./page.module.css";
import { MainPanel } from "src/components/main-panel/MainPanel";
import { ProductsList } from "src/components/products-list/ProductsList";
import { getProducts } from "src/lib/products/getProducts";

export const dynamic = 'force-dynamic';

export default async function Home() {

  const products = await getProducts({user_id: 1, isChildren: false}).then(res => res.products);

  const childrenProducts = await getProducts({user_id: 1, isChildren: true}).then(res => res.products);


  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <MainPanel />
        <div className={styles.productsSection}>
          <ProductsList title={"new arrivals"} productsList={products}/>
          <ProductsList title={"for your child"} productsList={childrenProducts}/>

        </div>
      </main>
      <footer className={styles.footer}>
        
      </footer>
    </div>
  );
}
