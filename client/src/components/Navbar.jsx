import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../img/logo192.png";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import Button from "react-bootstrap/Button";

function NavbarApp() {
  const [user] = useAuthState(auth);
  const [name, setName] = useState("");
  const [roles, setRoles] = useState([]);

  const fetchUsername = useCallback(async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
      setRoles(data.roles);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUsername();
    }
  }, [user, fetchUsername]);

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
          {user && (
            <Fragment>
              <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
              </Nav>
              {roles?.includes("admin") && (
                <Nav className="me-auto">
                  <Nav.Link href="/admin">Admin</Nav.Link>
                </Nav>
              )}
              {roles?.includes("seller") && (
                <Nav className="me-auto">
                  <Nav.Link href="/seller">Seller</Nav.Link>
                </Nav>
              )}
              <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>Signed in as: {name}</Navbar.Text>
                <Button className="dashboard__btn" onClick={logout}>
                  Logout
                </Button>
              </Navbar.Collapse>
            </Fragment>
          )}
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarApp;
