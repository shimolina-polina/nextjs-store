import styles from "./page.module.css";
import { MainPanel } from "src/components/main-panel/MainPanel";
import { ProductsList } from "src/components/products-list/ProductsList";

export default async function Home() {
  const products = (await (await fetch('http://localhost:3000/api/products/normal')).json()).products;

  const childrenProducts = (await (await fetch('http://localhost:3000/api/products/children')).json()).products;


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
