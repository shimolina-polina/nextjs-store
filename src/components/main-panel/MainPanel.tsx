import Image from 'next/image'
import styles from './MainPanel.module.css'
import Link from 'next/link'

export const MainPanel = () => {
    return (
        <section className={styles.container}>
            <h1 className={styles.heading}>healthcare. real&nbsp;results</h1>
            <div className={styles.contentWrapper}>
                <div className={styles.left}>
                    <p className={styles.lead}>
                        Take a step towards a more active and balanced life — discover premium supplements created with care for your health.
                    </p>

                    <div className={styles.ctaRow}>
                        <a className={styles.learn} href="#">Learn more</a>
                        <Link className={styles.shop} href="#products">
                            <span>Shop now</span>
                            <div className={styles.shopIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.175 13H4V11H16.175L10.575 5.4L12 4L20 12L12 20L10.575 18.6L16.175 13Z" fill="#1D1B20"/>
                                </svg>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className={styles.center}>
                    <div className={styles.bottleWrap}>
                        <Image
                            src="/content/package.png"
                            alt="Supplement bottle"
                            width={360}
                            height={420}
                            sizes="(max-width: 900px) 80vw, (max-width: 1200px) 40vw, 360px"
                            className={styles.bottle}
                            priority={true}
                        />
                    </div>
                    <div className={styles.ingredientsBadge}>
                        <span className={styles.plusIngredients}>+</span>
                        <span className={styles.badgeIngredients}>premium ingredients</span>
                    </div>
                    <div className={styles.nonGmoBadge}>
                        <span className={styles.plusGmo}>+</span>
                        <span className={styles.badgeGmo}>non-GMO</span>
                    </div>
                    <div className={styles.allergenFreeBadge}>
                        <span className={styles.badgeAllergen}>allergen free</span>
                        <span className={styles.minusAllergen}>+</span>
                    </div>
                </div>
                <div className={styles.right}>
                    Our products are carefully formulated using only the highest quality ingredients, ensuring you receive the best nature has to offer.
                </div>
            </div>
        </section>
    )
}