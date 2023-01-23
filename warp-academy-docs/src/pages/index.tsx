import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx(styles.heroBanner)}>
      <div className={clsx(styles.titleContainer)}>
        <h1 className="hero__title">Warp Academy</h1>
        <p className="hero__subtitle">Learn how to build your first dApps and smart contracts on Arweave</p>
      </div>
      <div className={styles.buttons}>
        <Link className="button button--secondary button--lg" to="/docs/docs-intro">
          Enter
        </Link>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`${siteConfig.title}`} description="A smart contracts academy on Arweave.">
      <HomepageHeader />
      {/* <main>
        <HomepageFeatures />
      </main> */}
    </Layout>
  );
}
