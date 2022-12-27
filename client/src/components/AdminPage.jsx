import React, {useCallback, useEffect, useState} from 'react'
import { useAuthState } from "react-firebase-hooks/auth";
import {useNavigate} from "react-router-dom"
import { query, collection, getDocs, where } from "firebase/firestore";
import { auth, db } from "../firebase";;

const AdminPage = () => {
    const navigate = useNavigate()
    const [user, loading] = useAuthState(auth);
    const [currentUserRoles, setCurrentUserRoles] = useState([]);
    const [isCurrentUserDatasFetched, setIsCurrentUserDatasFetched] = useState(false);
    const [allUsers, setAllUsers] = useState([]);

    const fetchCurrentUserDatas = useCallback(async () => {
      try {
        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        const doc = await getDocs(q);
        const data = doc.docs[0].data();
        setCurrentUserRoles(data.roles);
        setIsCurrentUserDatasFetched(true);
      } catch (err) {
        console.error(err);
        alert("An error occured while fetching user data");
      }
    }, [user]);

    // fetch all users datas
    const fetchAllUsersDatas = useCallback(async () => {
      try {
        const q = query(collection(db, "users"));
        const doc = await getDocs(q);
        doc.forEach((doc) => {
          setAllUsers(prev => [...prev, doc.data()])
        });
      } catch (err) {
        console.error(err);
        alert("An error occured while fetching user data");
      }
    }, []);

    useEffect(() => {
      console.log(allUsers);
    }, [allUsers])

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

    // Check if user has admin role
    useEffect(() => {
      if (isCurrentUserDatasFetched && !currentUserRoles?.includes('admin')) {
        navigate('/')
      }
      if (isCurrentUserDatasFetched && currentUserRoles?.includes('admin')) {
        fetchAllUsersDatas()
      }
    }, [currentUserRoles, navigate, isCurrentUserDatasFetched, fetchAllUsersDatas])

  return (
    <div className="home__container">
        <h1>Panel admin</h1>
        <table className="admin_table_all_users">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Roles</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user) => {
              return (
                <tr key={user.uid}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user?.roles?.map((role) => {
                    return (role + " ")
                  })}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
    </div>
  )
}

export default AdminPage;