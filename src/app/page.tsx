import styles from "./page.module.css";
import { MainPanel } from "src/components/main-panel/MainPanel";
import { ProductsList } from "src/components/products-list/ProductsList";

export const dynamic = 'force-dynamic';

export default async function Home() {

  const base = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

  const products = (await (await fetch(`${base}/api/products/normal`)).json()).products;

  const childrenProducts = (await (await fetch(`${base}/api/products/children`)).json()).products;


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
