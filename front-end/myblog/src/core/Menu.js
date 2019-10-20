import React, {useState, useEffect, Fragment} from 'react'
import {Link, withRouter} from 'react-router-dom'
import NProgress from 'nprogress'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink, } from 'reactstrap';
import {signout, isAuthenticated} from '../auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPowerOff } from '@fortawesome/free-solid-svg-icons'



  
  const Menu = ({history}) => {
    
    useEffect(() => {
    NProgress.start() 
    NProgress.set(0.4) 
    NProgress.inc() 
    NProgress.done() 
    }, []);

    const [isOpen, setIsOpen] = useState(false);
  
    const toggle = () => setIsOpen(!isOpen);
  
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand tag={Link} to="/">MusicBlog</NavbarBrand>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="ml-auto" navbar>
                <NavItem>
                    <NavLink tag={Link} to="/">Home</NavLink>
                </NavItem>
                {isAuthenticated() && isAuthenticated().user.role === 0 && (
                  <NavItem>
                    <NavLink tag={Link} to="/user/dashboard">Mon compte</NavLink>
                  </NavItem>
                )}
                {isAuthenticated() && isAuthenticated().user.role === 1 && (
                  <NavItem>
                    <NavLink tag={Link} to="/admin/dashboard">Mon compte</NavLink>
                  </NavItem>
                )}
                {!isAuthenticated() && (
                <Fragment>
                  <NavItem>
                    <NavLink tag={Link} to="/signin">Se Connecter</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink tag={Link} to="/signup">S'inscrire</NavLink>
                  </NavItem>
              </Fragment>
              )}
              {isAuthenticated() && (
                <NavItem>
                  <NavLink tag={Link} to="/signin" onClick={()=>
                  signout(() => {
                    history.push('/');
                  })}>
                  <FontAwesomeIcon icon={faPowerOff}/></NavLink>
               </NavItem> 
              )}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
  
export default withRouter(Menu);
