import React, { useCallback, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import {
  query,
  collection,
  getDocs,
  where,
  doc,
  deleteDoc,
  setDoc,
  addDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";

const AdminPage = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [currentUserRoles, setCurrentUserRoles] = useState([]);
  const [isCurrentUserDatasFetched, setIsCurrentUserDatasFetched] =
    useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [allRooms, setAllRooms] = useState([]);

  const [newRoom, setNewRoom] = useState({
    name: "",
    maxUsers: 0,
  });
  const [roomModified, setRoomModified] = useState({
    name: "",
    maxUsers: 0,
  });

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
      setAllUsers(doc.docs.map((doc) => doc.data()));
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  }, []);

  // fetch all rooms datas
  const fetchAllRooms = useCallback(async () => {
    try {
      const q = query(collection(db, "rooms"));
      const doc = await getDocs(q);
      setAllRooms(doc.docs.map((doc) => doc.data()));
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  }, []);

  // If user is not authenticated by firebase, redirect to login page
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
  }, [user, loading, navigate]);

  // Fetch currentUserDatas when user is authenticated by firebase
  useEffect(() => {
    if (user) {
      fetchCurrentUserDatas();
    }
  }, [user, fetchCurrentUserDatas]);

  // Check if user has admin role
  useEffect(() => {
    if (isCurrentUserDatasFetched && !currentUserRoles?.includes("admin")) {
      navigate("/");
    }
    if (isCurrentUserDatasFetched && currentUserRoles?.includes("admin")) {
      fetchAllUsersDatas();
      fetchAllRooms();
    }
  }, [
    currentUserRoles,
    navigate,
    isCurrentUserDatasFetched,
    fetchAllUsersDatas,
    fetchAllRooms,
  ]);

  const deleteRoomDoc = useCallback(
    async (roomName) => {
      try {
        const q = query(collection(db, "rooms"), where("name", "==", roomName));
        const docFetched = await getDocs(q);
        const idRoom = docFetched.docs[0].id;
        await deleteDoc(doc(db, "rooms", idRoom));
        setAllRooms(allRooms.filter((room) => room.name !== roomName));
      } catch (err) {
        console.error(err);
        alert("An error occured while deleting room");
      }
    },
    [allRooms]
  );

  const addRoom = useCallback(async () => {
    try {
      if (newRoom.name === "") {
        alert("Room name is required");
        return;
      }
      if (newRoom.maxUsers === 0) {
        alert("Max users need to be greater than 0");
        return;
      }
      const q = query(
        collection(db, "rooms"),
        where("name", "==", newRoom.name)
      );
      const docFetched = await getDocs(q);
      if (docFetched.docs.length > 0) {
        alert("Room already exists");
      } else {
        await addDoc(collection(db, "rooms"), {
          name: newRoom.name,
          maxUsers: newRoom.maxUsers,
        });
        setNewRoom({
          name: "",
          maxUsers: 0,
        });
        allRooms.push(newRoom);
      }
    } catch (err) {
      console.error(err);
      alert("An error occured while adding room");
    }
  }, [newRoom, allRooms]);

  const modifyRoom = useCallback(
    async (previousRoomId) => {
      try {
        if (roomModified.name === "") {
          alert("Room name is required");
          return;
        }
        if (roomModified.maxUsers === 0) {
          alert("Max users need to be greater than 0");
          return;
        }
        const q = query(
          collection(db, "rooms"),
          where("name", "==", roomModified.name)
        );
        const docFetched = await getDocs(q);
        if (docFetched.docs.length > 0) {
          alert("Room already exists");
        } else {
          await setDoc(doc(db, "rooms", previousRoomId), {
            name: roomModified.name,
            maxUsers: roomModified.maxUsers,
          });
          setRoomModified({
            name: "",
            maxUsers: 0,
          });
          // allRooms.push(roomModified);
        }
      } catch (err) {
        console.error(err);
        alert("An error occured while adding room");
      }
    },
    [roomModified]
  );

  return (
    <div className="home__container">
      <h1>Panel admin</h1>
      <h2>All users of our app</h2>
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
                {/* TODO: display roles as checkboxes */}
                <td>
                  {/* {user?.roles?.map((role) => {
                    return role + " ";
                  })} */}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* ROOMS PART */}
      <h2 style={{ marginTop: "20px" }}>All chat rooms</h2>
      <table className="admin_table_all_users">
        <thead>
          <tr>
            <th>Name</th>
            <th>MaxUsers</th>
          </tr>
        </thead>
        <tbody>
          {allRooms.map((room) => {
            return (
              <tr key={room.name}>
                <td>
                  {roomModified === room ? (
                    <input
                      type="text"
                      value={roomModified.name}
                      onChange={(e) =>
                        setRoomModified((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    room.name
                  )}
                </td>
                <td>
                  {roomModified === room ? (
                    <>
                      <input
                        type="number"
                        value={roomModified.maxUsers}
                        onChange={(e) =>
                          setRoomModified((prev) => ({
                            ...prev,
                            maxUsers: e.target.value,
                          }))
                        }
                      />
                      <button
                        onClick={() => {
                          modifyRoom(room.name);
                        }}
                        style={{ position: "absolute", right: "5px" }}
                      >
                        ok
                      </button>
                    </>
                  ) : (
                    <>
                      {room.maxUsers}
                      <button
                        onClick={() => {
                          setRoomModified(room);
                        }}
                        style={{ position: "absolute", right: "5px" }}
                      >
                        modify
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      deleteRoomDoc(room.name);
                    }}
                    style={{ position: "absolute", right: "-60px" }}
                  >
                    delete
                  </button>
                </td>
              </tr>
            );
          })}
          <tr>
            <td>
              <input
                type="text"
                value={newRoom.name}
                onChange={(e) =>
                  setNewRoom((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </td>
            <td>
              <input
                type="number"
                value={newRoom.maxUsers}
                onChange={(e) =>
                  setNewRoom((prev) => ({ ...prev, maxUsers: e.target.value }))
                }
              />
              <button
                onClick={() => {
                  addRoom();
                }}
                style={{ position: "absolute", right: "5px" }}
              >
                add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
