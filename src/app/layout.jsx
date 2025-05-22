// eslint-disable-next-line camelcase
import { Alfa_Slab_One, Karla } from 'next/font/google';
import './globals.css';
import PropTypes from 'prop-types';

const karla = Karla({
  variable: '--font-karla',
  subsets: ['latin'],
});

const alfaslabone = Alfa_Slab_One({
  variable: '--font-alfaslabone',
  subsets: ['latin'],
  weight: ['400'],
});

export const metadata = {
  title: 'Wordle',
  description: 'A clone of the popular word game Wordle',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${alfaslabone.variable} ${karla.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
