import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const Header = () => (
  <header>
    <nav>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/department">Departments</Link>
        </li>
        <li>
          <Link href="/project">Projects</Link>
        </li>
        <li>
          <Link href="/employee">Employees</Link>
        </li>
        <li>
          <Link href="/report">Report</Link>
        </li>
      </ul>
    </nav>
  </header>
);

const Layout = ({ children }) => (
  <div>
    <Header />
    {children}
  </div>
);

export default Layout;
