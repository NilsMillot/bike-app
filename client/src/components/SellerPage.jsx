import React, {useCallback, useEffect, useState} from 'react'
import { useAuthState } from "react-firebase-hooks/auth";
import {useNavigate} from "react-router-dom"
import { query, collection, getDocs, where } from "firebase/firestore";
import { auth, db } from "../firebase";;

const SellerPage = () => {
  const navigate = useNavigate()
  const [user, loading] = useAuthState(auth);
  const [currentUserRoles, setCurrentUserRoles] = useState([]);
  const [isCurrentUserFetched, setIsCurrentUserFetched] = useState(false);
  const [commercialInfo, setCommercialInfo] = useState("");

  const fetchCurrentUserDatas = useCallback(async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setCurrentUserRoles(data.roles);
      setIsCurrentUserFetched(true);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  }, [user]);

  const sendCommerCialInfo = () => {
    const requestBody = { message: commercialInfo }

    fetch('http://localhost:4000/api/send-notif', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    setCommercialInfo("");
  }

  // If user is not authenticated by firebase, redirect to login page
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
  }, [user, loading, navigate]);

  // Fetch currentUserDatas when user is authenticated by firebase
  useEffect(() => {
    if (user) {
      fetchCurrentUserDatas()
    }
  }, [user, fetchCurrentUserDatas])

  useEffect(() => {
    // If currentUser is not a seller, redirect to home page
    if (isCurrentUserFetched && !currentUserRoles?.includes('seller')) {
      navigate('/')
    }
  }, [currentUserRoles, navigate, isCurrentUserFetched])

  if (currentUserRoles?.includes('seller')) {
    return (
      <div className="home__container">
        <h1>Panel seller</h1>
        <section>
          <input type="text" value={commercialInfo} onChange={(e) => setCommercialInfo(e.target.value)} />
          <button type="submit" onClick={sendCommerCialInfo}>Send</button>
        </section>
        <p>Here you can add your commercial information</p>
      </div>
    )
  } 
}

export default SellerPage;