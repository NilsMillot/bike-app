import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "../img/logo192.png";
import React, { Fragment, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import Button from 'react-bootstrap/Button';

function NavbarApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) {
      setLoggedIn(false) 
      return navigate("/login")
    }
    if(user) setLoggedIn(true)
    fetchUserName();
  }, [user, loading]);

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">
          <img
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="logo"
            />
          </Navbar.Brand>
          {loggedIn && (
            <Fragment>
              <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
              </Nav>
              <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                  Signed in as: {name}
                </Navbar.Text>
                <Button className="dashboard__btn" onClick={logout}>Logout</Button>
              </Navbar.Collapse>
            </Fragment>
          )}
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarApp;