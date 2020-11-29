import React, { Fragment, useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {

  const authLinks = (
    <Fragment>
      <li>


        <Link to='/SorryDave'>Sorry Dave!</Link>
        <Link to='/'>Dunder!</Link>

      </li>
    </Fragment>
  );



  return (
    <div>
      <div className='navbar bg-primary'>
        <h2>
          <span className='text-dark'>ADDING</span>
          <span className='text-danger lead'>VALUE</span>

        </h2>
        <ul>{authLinks}</ul>
      </div>

    </div>
  );
};

export default Navbar;
