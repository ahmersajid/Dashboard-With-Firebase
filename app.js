import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1C81GDT364Mz1kSpl0DvB_8ITV9T1yvI",
  authDomain: "dashboard-6ee05.firebaseapp.com",
  projectId: "dashboard-6ee05",
  storageBucket: "dashboard-6ee05.firebasestorage.app",
  messagingSenderId: "863699704148",
  appId: "1:863699704148:web:d9e601124542b5ee3a50c1",
  measurementId: "G-7RC2MD316L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, (user) => {
  const currentPage = window.location.pathname.split('/').pop();

  if (user) {
    console.log("User logged in:", user.email);

    if (currentPage === 'index.html' || currentPage === 'Sign-up.html') {
      if (currentPage === 'index.html') {
        window.location.href = 'Dashboard.html';
      }
    }
  } else {
    console.log("User logged out");

    if (currentPage === 'Dashboard.html') {
      window.location.href = 'index.html';
    }
  }
});

const signUpBtn = document.querySelector('#Sbtn');
if (signUpBtn) {
  signUpBtn.addEventListener('click', () => {
    const name = document.querySelector('#Sname').value.trim();
    const email = document.querySelector('#Semail').value.trim();
    const password = document.querySelector('#Spass').value.trim();

    if (!name || !email || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all required fields!',
      });
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        document.querySelector('#Sname').value = '';
        document.querySelector('#Semail').value = '';
        document.querySelector('#Spass').value = '';

        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'Please login with your credentials',
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          window.location.href = 'index.html';
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: error.message,
        });
      });
  });
}

const loginBtn = document.querySelector('#Lbtn');
if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    const email = document.querySelector('#Lemail').value.trim();
    const password = document.querySelector('#Lpass').value.trim();

    if (!email || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all required fields!',
      });
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        document.querySelector('#Lemail').value = '';
        document.querySelector('#Lpass').value = '';

        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          window.location.href = 'Dashboard.html';
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error.message,
        });
      });
  });
}

const logoutBtn = document.querySelector('#logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of your account',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        signOut(auth).then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Logged Out Successfully!',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            window.location.href = 'index.html';
          });
        }).catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Logout Failed',
            text: error.message,
          });
        });
      }
    });
  });
}


const readData = async () => {
  const getItems = document.getElementById('Items');
  if (getItems) {
    getItems.innerHTML = "";
    const querySnapshot = await getDocs(collection(db, "Items"));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      getItems.innerHTML += `
        <div class="card" style="width: 18rem;">
          <img src="${data.iImageURL}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">Name: ${data.iname}</h5>
            <p class="card-text">Price: ${data.iprice}</p>
            <p class="card-text">Description: ${data.idescription}</p>
            <button id='Edit' class="btn btn-info">Edit</button>
            <button id='Delete' class="btn btn-danger">Delete</button>
          </div>
        </div>`;
    });
  }
};

const addBtn = document.getElementById('addBtn');
if (addBtn) {
  addBtn.addEventListener('click', async () => {
    const iname = document.getElementById('iname').value.trim();
    const iprice = document.getElementById('iprice').value.trim();
    const idescription = document.getElementById('idescription').value.trim();
    const iImageURL = document.getElementById('iImageURL').value.trim();

    if (!iname || !iprice || !idescription || !iImageURL) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all fields!',
      });
      return;
    }

    try {
      await addDoc(collection(db, "Items"), {
        iname,
        iprice,
        idescription,
        iImageURL,
        Time: Timestamp.now()
      });
      
      document.getElementById('iname').value = '';
      document.getElementById('iprice').value = '';
      document.getElementById('idescription').value = '';
      document.getElementById('iImageURL').value = '';
      
      bootstrap.Modal.getInstance(document.getElementById('exampleModal')).hide();
      
      readData();
      
      Swal.fire({
        icon: 'success',
        title: 'Item Added!',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (e) {
      console.error("Error adding document: ", e);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add item',
      });
    }
  });
}

if (window.location.pathname.split('/').pop() === 'Dashboard.html') {
  readData();
}