import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email
      });
    }
    localStorage.setItem("username", user.displayName);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    try {
      const q = query(
        collection(db, "users"),
        where("uid", "==", auth.currentUser.uid)
      );
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      localStorage.setItem("username", data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  localStorage.removeItem("username");
  signOut(auth);
};

const displayAvailableDates = async (type_rdv) => {
  const data = [];
  const today = new Date();
  const workingDays = [];
  const endOfWeek = new Date();

  today.setDate(today.getDate());
  endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));

  let workingDaysRemaining = 0;

  for (let date = new Date(today.getFullYear(), today.getMonth(), today.getDate()); date <= endOfWeek; date.setDate(date.getDate() + 1)) {
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      workingDaysRemaining++;
    }
  }

  for (let i = 0; i < workingDaysRemaining; i++) {
    let newDate = new Date();

    newDate.setDate(today.getDate() + i);
    workingDays.push(newDate.toLocaleDateString());
  }

  try{
    const q = query(collection(db, "consultantHasRdv"), where('date_rdv', 'in', workingDays), where('type_rdv', "==", type_rdv));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let date_rdv = doc.data("date_rdv")

      data.push(date_rdv.date_rdv)
    });
  } catch (error) {
      console.error('Error getting documents: ', error);
  };

  // On récupère toutes les dates de la semaine qui ne sont pas dans data
  var workingDaysAvailable = workingDays.filter(day => !(data.includes(day)));

  // Si pas de jours dispos cette semaine on affiche la semaine suivante
  if (workingDaysAvailable.length === 0) {
    let nextMonday = new Date(today);

    while (nextMonday.getDay() !== 1) {
        nextMonday = new Date(nextMonday.getTime() + 24 * 60 * 60 * 1000);
    }
    for (let i = 0; i < 5; i++) {
      workingDaysAvailable.push(nextMonday.toLocaleDateString());
      nextMonday = new Date(nextMonday.getTime() + 24 * 60 * 60 * 1000);
    }

  }

  const options = []

  for (let i = 0; i < workingDaysAvailable.length; i++) {
    let obj = { value: i, label: workingDaysAvailable[i], trigger:  () => {
      Promise.resolve(addRdv(workingDaysAvailable[i], type_rdv))
      return '12'
    }}
    options.push(obj)
  }
  
  return options;
}

const addRdv = async (date_rdv, type_rdv) => {
  try {
    await addDoc(collection(db, "consultantHasRdv"), {
      date_rdv: date_rdv,
      type_rdv: type_rdv
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}; 


export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  displayAvailableDates,
  addRdv
};
