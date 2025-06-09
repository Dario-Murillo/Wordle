import PropTypes from 'prop-types';
import React from 'react';
import Header from '../../components/Header';

export default function GameLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}

GameLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
