import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCnVoyXHd-3NQ4VcvjXdjncoyaTnqDjHVA",
  authDomain: "music-reviews-2fe39.firebaseapp.com",
  projectId: "music-reviews-2fe39",
  storageBucket: "music-reviews-2fe39.appspot.com",
  messagingSenderId: "524571811015",
  appId: "1:524571811015:web:501fe3d7b447dc58abb2e2",
  measurementId: "G-MHKTNCJV3R"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const API_KEY = "ed6ec23ae7bb84b65fab1f7bf168e979";
const mainContent = document.getElementById("main-content");
const loginForm = document.getElementById("login-form");
const reviewsList = document.getElementById("reviews-list");
const registerForm = document.getElementById("register-form");
const registerBtn = document.getElementById("register-btn");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const switchToLogin = document.getElementById("switch-to-login");
const switchToRegister = document.getElementById("switch-to-register");
const profileSection = document.getElementById("profile-section");
const saveProfileBtn = document.getElementById("save-profile");
const displayNameInput = document.getElementById("display-name");
const photoFileInput = document.getElementById("photo-file");
const profileInfo = document.getElementById("profile-info");
const photoPreview = document.getElementById("profile-photo-preview");
const userDisplay = document.getElementById("user-display");
const userHeader = document.getElementById("user-header");
const userNameDisplay = document.getElementById("user-name");
const userAvatar = document.getElementById("user-avatar");
let photoUrlInput = { value: "" }
const fileInput = document.getElementById("photo-file");
const closeProfileBtn = document.getElementById("close-profile");

if (fileInput) {
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        photoPreview.src = e.target.result;
        photoPreview.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });
}
if (switchToLogin) switchToLogin.onclick = () => {
  loginForm.style.display = "block";
  registerForm.style.display = "none";
};

if (switchToRegister) switchToRegister.onclick = () => {
  loginForm.style.display = "none";
  registerForm.style.display = "block";
};

if (registerBtn) registerBtn.onclick = async () => {
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (e) {
    alert("Ошибка регистрации: " + e.message);
  }
};

if (loginBtn) loginBtn.onclick = async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    alert("Ошибка входа: " + e.message);
  }
};

if (logoutBtn) logoutBtn.onclick = async () => {
  try {
    await signOut(auth);
  } catch (e) {
    alert("Ошибка выхода: " + e.message);
  }
};

onAuthStateChanged(auth, async (user) => {
 async function loadUsers() {
  const usersContainer = document.getElementById("users-list");
  if (!usersContainer) return;

  try {
    const snapshot = await getDocs(collection(db, "users"));
    usersContainer.innerHTML = "";

    snapshot.docs.forEach(docSnap => {
      const user = docSnap.data();
      const uid = user.uid;

      // Пропускаем текущего пользователя
      if (uid === auth.currentUser.uid) return;

      const userDiv = document.createElement("div");
      userDiv.className = "user-card";
      userDiv.innerHTML = `
        <img src="${user.photoURL || 'https://via.placeholder.com/40'}" style="width: 40px; border-radius: 50%; margin-right: 8px;">
        <span>${user.displayName || 'Без имени'}</span>
        <a href="?uid=${uid}" class="view-profile-link">Профиль</a>
        <br>
        <input type="text" class="message-input" placeholder="Введите сообщение..." style="margin-top: 5px; width: 70%;" data-uid="${uid}">
        <button class="send-message-btn" data-uid="${uid}">📩</button>
      `;
      usersContainer.appendChild(userDiv);

      const sendBtn = userDiv.querySelector(".send-message-btn");
      const input = userDiv.querySelector(".message-input");

      sendBtn.addEventListener("click", async () => {
        const text = input.value.trim();
        if (!text) return;
        await sendMessage(auth.currentUser.uid, uid, text);
        input.value = "";
        alert("Сообщение отправлено!");
      });
    });
  } catch (error) {
    console.error("Ошибка при загрузке пользователей:", error);
  }
}
async function sendMessage(fromUid, toUid, text) {
  await addDoc(collection(db, "messages"), {
    from: fromUid,
    to: toUid,
    text: text,
    timestamp: serverTimestamp()
  });
}

  async function syncUserProfile(user) {
  if (!user || !user.uid) return;

  const userDocRef = doc(db, "users", user.uid);

  await setDoc(userDocRef, {
    uid: user.uid,
    userId: user.uid,
    name: user.displayName || "Anonymous",
    photoURL: user.photoURL || null,
  }, { merge: true });
}
  if (user) {
    syncUserProfile(user);
    loginForm.style.display = "none";
    registerForm.style.display = "none";
    mainContent.style.display = "block";

      const publicProfile = document.getElementById("public-profile");
  publicProfile.style.display = "none";
  

    userHeader.style.display = "flex";
    userNameDisplay.textContent = user.displayName || "Профиль";
    if (user.photoURL) {
      userAvatar.src = user.photoURL;
      userAvatar.style.display = "inline-block";
       photoPreview.src = user.photoURL;
    photoPreview.style.display = "block";
    }

    displayNameInput.value = user.displayName || "";
    

    loadReviews();
    updateProfileInfo();
    const currentSnap = await getDoc(doc(db, "users", user.uid));
const currentUserData = currentSnap.exists() ? currentSnap.data() : null;
loadUsers(currentUserData);

  } else {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    mainContent.style.display = "none";
    userHeader.style.display = "none";
    profileSection.style.display = "none";
  }
});

if (saveProfileBtn) {
  saveProfileBtn.onclick = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const newName = displayNameInput.value.trim();
let finalPhotoURL = user.photoURL || "";

const file = fileInput?.files[0];
if (file) {
  const storagePath = `avatars/${user.uid}/${file.name}`;
  const imageRef = storageRef(storage, storagePath);
  await uploadBytes(imageRef, file);
  finalPhotoURL = await getDownloadURL(imageRef);
}

    try {
      await updateProfile(user, {
        displayName: newName,
        photoURL: finalPhotoURL
      });

      alert("Профиль обновлён!");

      userAvatar.src = finalPhotoURL || "https://via.placeholder.com/40";
      userNameDisplay.textContent = newName || "Профиль";
      photoPreview.src = finalPhotoURL;
      photoPreview.style.display = "block";
      photoUrlInput.value = finalPhotoURL;

    } catch (error) {
      alert("Ошибка при обновлении профиля: " + error.message);
    }
  };
}



window.showUserProfile = function(uid, name, photo) {
  alert(`Профиль пользователя: ${name}`);
};
async function showUserProfile(userId, userName, photoURL) {
  const container = document.getElementById("public-profile");
  container.innerHTML = `<h2>Профиль: ${userName}</h2>
    <img src="${photoURL || 'https://via.placeholder.com/80'}" style="width: 80px; border-radius: 50%; margin-bottom: 10px;">
    <div id="user-reviews"></div>`;
  container.style.display = "block";

  const reviewsSnapshot = await getDocs(collection(db, "reviews"));
  const userReviews = reviewsSnapshot.docs
    .map(doc => doc.data())
    .filter(r => r.userId === userId);

  const reviewsDiv = container.querySelector("#user-reviews");
  reviewsDiv.innerHTML = "";

  userReviews.forEach(review => {
    const reviewDiv = document.createElement("div");
    reviewDiv.className = "review";
    reviewDiv.innerHTML = `
      <strong>${review.title}</strong> (${review.year})<br>
      Автор: ${review.author}<br>
      Песен: ${review.trackCount} | Оценка: ${review.rating}/10<br>
      <div class="comment-text">${review.comment}</div>
    `;
    reviewsDiv.appendChild(reviewDiv);
  });

  // Скрываем личный профиль и форму
  document.getElementById("profile-section").style.display = "none";
}
async function showFullPublicProfile(uid) {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (!userDoc.exists()) {
  await setDoc(doc(db, "users", uid), {
    uid,
    displayName: "Без имени",
    photoURL: "",
    friends: [],
    friendRequestsSent: [],
    friendRequestsReceived: []
  });
}

  const user = userDoc.data();
  document.getElementById("main-content").style.display = "block";
  document.getElementById("profile-section").style.display = "none";
  document.getElementById("public-profile").style.display = "block";

  document.getElementById("public-name").textContent = user.displayName || "Без имени";
  document.getElementById("public-photo").src = user.photoURL || "https://via.placeholder.com/80";

  const openChatBtn = document.createElement("button");
openChatBtn.textContent = "Открыть чат";
openChatBtn.onclick = () => openChatWithUser(uid, user.displayName || "Пользователь");
const nameContainer = document.getElementById("public-name");
const chatBtn = document.createElement("button");
chatBtn.textContent = "💬 Открыть чат";
chatBtn.className = "chat-btn";
chatBtn.onclick = () => openChatWithUser(uid, user.displayName || "Пользователь");
nameContainer.parentElement.insertBefore(chatBtn, nameContainer.nextSibling);

  const snapshot = await getDocs(collection(db, "reviews"));
  const userReviews = snapshot.docs
    .map(doc => doc.data())
    .filter(r => r.userId === uid);

  document.getElementById("public-review-count").textContent = userReviews.length;

  const recentEl = document.getElementById("public-recent-reviews");
  recentEl.innerHTML = userReviews.length > 0
    ? userReviews.map(r => `<li>${r.title} (${r.year}) — ${r.rating}/10: ${r.comment}</li>`).join("")
    : "<li>Нет отзывов</li>";

  const likedTracks = new Set();
  userReviews.forEach(r => (r.likedTracks || []).forEach(t => likedTracks.add(t)));

  document.getElementById("public-liked-tracks-count").textContent = likedTracks.size;
  const likedList = document.getElementById("public-liked-tracks-list");
  likedList.innerHTML = likedTracks.size > 0
    ? [...likedTracks].map(t => `<li>${t}</li>`).join("")
    : "<li>Нет любимых треков</li>";
}

let currentChatUid = null;

window.openChatWithUser = async (uid, name) => {
  currentChatUid = uid;
  document.getElementById("chat-title").textContent = `Чат с ${name}`;
  document.getElementById("chat-window").style.display = "block";
  profileSection.style.display = "none";
  await loadMessagesWith(uid);
};

async function loadMessagesWith(uid) {
  const user = auth.currentUser;
  if (!user) return;

  const q = collection(db, "messages");
  const snapshot = await getDocs(q);

  const messages = snapshot.docs
    .map(doc => doc.data())
    .filter(m =>
      (m.from === user.uid && m.to === uid) ||
      (m.from === uid && m.to === user.uid)
    )
    .sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0));

  const messagesContainer = document.getElementById("chat-messages");
  messagesContainer.innerHTML = "";

  messages.forEach(m => {
    const msgDiv = document.createElement("div");
    msgDiv.className = "message " + (m.from === user.uid ? "sent" : "received");
    const time = m.timestamp?.toDate?.().toLocaleTimeString?.("ru-RU", { hour: "2-digit", minute: "2-digit" }) || "";
    msgDiv.textContent = `[${time}] ${m.text}`;
    messagesContainer.appendChild(msgDiv);
  });

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
document.getElementById("send-chat").addEventListener("click", async () => {
  const user = auth.currentUser;
  const input = document.getElementById("chat-input");
  const text = input.value.trim();
  if (!text || !currentChatUid || !user) return;

  await addDoc(collection(db, "messages"), {
    from: auth.currentUser.uid,
    to: currentChatUid, 
    text: text, 
    timestamp: serverTimestamp()
  });

  input.value = "";
  await loadMessagesWith(currentChatUid);
});
document.getElementById("close-chat").addEventListener("click", () => {
  document.getElementById("chat-window").style.display = "none";
  profileSection.style.display = "block";
});



let albumTracks = [];
function loadReviews() {
  const user = auth.currentUser;
  if (!user) return;

  getDocs(collection(db, "reviews")).then(snapshot => {
    const reviews = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(r => r.userId === user.uid);

    reviewsList.innerHTML = "";

    reviews.forEach((review, index) => {
      const MAX_LENGTH = 300;
      const isLongComment = review.comment.length > MAX_LENGTH;
      const shortComment = review.comment.slice(0, MAX_LENGTH);

      const reviewDiv = document.createElement("div");
      reviewDiv.className = "review";

      const bgDiv = document.createElement("div");
      bgDiv.className = "review-bg";
      if (review.cover) {
        bgDiv.style.backgroundImage = `url('${review.cover}')`;
      }

      const innerDiv = document.createElement("div");
      innerDiv.className = "review-inner";

      let likedTracksHtml = "";
      if (review.tracks && review.tracks.length > 0) {
        likedTracksHtml = `<strong>Треки:</strong><ul>` +
          review.tracks.map(track => {
            const isLiked = review.likedTracks?.includes(track.name);
            return `<li>${track.name} <span style="color: ${isLiked ? 'red' : '#aaa'}">${isLiked ? '❤️' : ''}</span></li>`;
          }).join("") +
          `</ul>`;
      }

      innerDiv.innerHTML = `
        ${review.cover ? `<img src="${review.cover}" alt="Обложка альбома" class="cover-img">` : ""}
        ${review.genres ? `<div class="genres"><strong>Жанры:</strong> ${review.genres}</div>` : ""}
        <div class="review-content">
          <strong>${review.title}</strong> (${review.year})<br>
          Автор: ${review.author}<br>
          Песен: ${review.trackCount} | Оценка: ${review.rating}/10<br>
          ${likedTracksHtml}
          <div class="comment">
            <span class="comment-text" data-full="${review.comment}">
              ${isLongComment ? `${shortComment}...` : review.comment}
            </span>
            ${isLongComment ? `<button class="toggle-btn">Показать полностью</button>` : ""}
          </div>
          <br>
          <button data-id="${review.id}" class="edit-btn">Редактировать</button>
          <button data-id="${review.id}" class="delete-btn">Удалить</button>
        </div>
      `;

      reviewDiv.appendChild(bgDiv);
      reviewDiv.appendChild(innerDiv);
      reviewsList.appendChild(reviewDiv);
    });

    document.querySelectorAll(".delete-btn").forEach(btn =>
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        await deleteDoc(doc(db, "reviews", id));
        loadReviews();
        loadUsers();
      })
    );

    document.querySelectorAll(".edit-btn").forEach(btn =>
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        const snapshot = await getDoc(doc(db, "reviews", id));
        const review = snapshot.data();
        editIndex = id;

        form.title.value = review.title;
        form.trackCount.value = review.trackCount;
        form.year.value = review.year;
        form.author.value = review.author;
        form.rating.value = review.rating;
        form.comment.value = review.comment;
        albumInput.dataset.cover = review.cover || "";
        albumInput.dataset.genres = review.genres || "";
        albumTracks = review.tracks || [];
        renderTrackList();
      })
    );

    document.querySelectorAll(".toggle-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const textEl = btn.previousElementSibling;
        const fullText = textEl.dataset.full;
        const isExpanded = btn.textContent === "Скрыть";

        if (isExpanded) {
          textEl.textContent = fullText.slice(0, 300) + "...";
          btn.textContent = "Показать полностью";
        } else {
          textEl.textContent = fullText;
          btn.textContent = "Скрыть";
        }
      });
    });
  });
}

async function updateProfileInfo() {
  const user = auth.currentUser;
  if (!user) return;

  const reviewCountEl = document.getElementById("review-count");
  const likedTracksCountEl = document.getElementById("liked-tracks-count");
  const recentReviewsList = document.getElementById("recent-reviews-list");
  const likedTracksList = document.getElementById("liked-tracks-list");

  try {
    const snapshot = await getDocs(collection(db, "reviews"));
    const userReviews = snapshot.docs
      .map(doc => doc.data())
      .filter(r => r.userId === user.uid);
    reviewCountEl.textContent = userReviews.length;
    const likedTracks = new Set();
    userReviews.forEach(r => {
      (r.likedTracks || []).forEach(t => likedTracks.add(t));
    });
    likedTracksCountEl.textContent = likedTracks.size;
    const latest = userReviews.slice(-3).reverse();
    recentReviewsList.innerHTML = latest.map(r => `<li>${r.title} (${r.year})</li>`).join("") || "<li>Нет отзывов</li>";
    likedTracksList.innerHTML = [...likedTracks].slice(0, 5).map(t => `<li>${t}</li>`).join("") || "<li>Нет любимых треков</li>";
  } catch (error) {
    console.error("Ошибка при обновлении профиля:", error);
  }
}
function renderTrackList() {
  const container = document.getElementById("track-list");
  if (!container) return;
  container.innerHTML = "";
  albumTracks.forEach((track, index) => {
    const trackItem = document.createElement("div");
    trackItem.className = "track-item";
    trackItem.innerHTML = `
      <label>
        <input type="checkbox" data-index="${index}" ${track.liked ? "checked" : ""}>
        <i class="fa-solid fa-music" style="color: var(--accent); margin-right: 6px;"></i>
        ${track.name}
      </label>
    `;
    container.appendChild(trackItem);
  });

  container.querySelectorAll("input[type='checkbox']").forEach(input => {
    input.addEventListener("change", (e) => {
      const i = parseInt(e.target.dataset.index);
      albumTracks[i].liked = e.target.checked;
    });
  });
}
userHeader.addEventListener("click", (e) => {
  e.stopPropagation();
  profileSection.style.display = profileSection.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", (e) => {
  const target = e.target;
  if (!target.closest("#profile-section") && !target.closest("#user-header")) {
    profileSection.style.display = "none";
  }
});
closeProfileBtn.onclick = () => {
  profileSection.style.display = "none";
};

// Предотврати всплытие при кликах внутри профиля
profileSection.addEventListener("click", (e) => {
  e.stopPropagation();
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".review-form");
  const reviewsList = document.getElementById("reviews-list");
  const albumInput = document.getElementById("albumInput");
  const suggestionsBox = document.getElementById("suggestions");

  let editIndex = null;
  
  function handleDelete(e) {
    const index = e.target.dataset.index;
    const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    reviews.splice(index, 1);
    localStorage.setItem("reviews", JSON.stringify(reviews));
    loadReviews();
    loadUsers();
  }

  function handleEdit(e) {
    editIndex = e.target.dataset.index;
    const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    const review = reviews[editIndex];

    form.title.value = review.title;
    form.trackCount.value = review.trackCount;
    form.year.value = review.year;
    form.author.value = review.author;
    form.rating.value = review.rating;
    form.comment.value = review.comment;
    albumInput.dataset.cover = review.cover || "";
    albumInput.dataset.genres = review.genres || "";
    albumTracks = review.tracks || [];
    renderTrackList();
  }

  form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const likedTracks = albumTracks.filter(track => track.liked);
  const user = auth.currentUser;
  if (!user) return;

  const review = {
    userId: user.uid,
    title: form.title.value,
    trackCount: form.trackCount.value,
    year: form.year.value,
    author: form.author.value,
    rating: form.rating.value,
    comment: form.comment.value,
    cover: albumInput.dataset.cover || "",
    genres: albumInput.dataset.genres || "",
    tracks: albumTracks,
    likedTracks: likedTracks.map(t => t.name)
  };

  if (editIndex !== null) {
    await updateDoc(doc(db, "reviews", editIndex), review);
    editIndex = null;
  } else {
    await addDoc(collection(db, "reviews"), review);
  }

  form.reset();
  albumInput.dataset.cover = "";
  albumInput.dataset.genres = "";
  albumTracks = [];
  document.getElementById("track-list").innerHTML = "";
  loadReviews();
  loadUsers();
  updateProfileInfo();
});


  albumInput.addEventListener("input", async () => {
    const query = albumInput.value.trim();
    suggestionsBox.innerHTML = "";

    if (query.length < 2) {
      suggestionsBox.style.display = "none";
      return;
    }

    const url = `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${encodeURIComponent(query)}&api_key=${API_KEY}&format=json`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      const matches = data.results.albummatches.album.slice(0, 5);

      if (matches.length === 0) {
        suggestionsBox.style.display = "none";
        return;
      }

      matches.forEach(album => {
        const suggestion = document.createElement("div");
        suggestion.textContent = `${album.name} — ${album.artist}`;
        suggestion.addEventListener("click", async () => {
          albumInput.value = album.name;
          form.author.value = album.artist;
          suggestionsBox.style.display = "none";

          let coverUrl = "";
          let genresList = [];
          albumTracks = [];

          const infoUrl = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${API_KEY}&artist=${encodeURIComponent(album.artist)}&album=${encodeURIComponent(album.name)}&format=json`;

          try {
            const response = await fetch(infoUrl);
            const data = await response.json();

            if (data.album) {
              if (data.album.tracks && data.album.tracks.track) {
                albumTracks = Array.isArray(data.album.tracks.track)
                  ? data.album.tracks.track.map(t => ({ name: t.name, liked: false }))
                  : [{ name: data.album.tracks.track.name, liked: false }];
                form.trackCount.value = albumTracks.length;
              }

              if (data.album.wiki && data.album.wiki.published) {
                const yearMatch = data.album.wiki.published.match(/\d{4}/);
                if (yearMatch) {
                  form.year.value = yearMatch[0];
                }
              }

              const images = data.album.image;
              if (images && images.length > 0) {
                const largeImg = images.find(img => img.size === "extralarge") || images[images.length - 1];
                coverUrl = largeImg["#text"];
              }

              if (data.album.tags && data.album.tags.tag) {
                genresList = data.album.tags.tag.map(tag => tag.name);
              }

              albumInput.dataset.cover = coverUrl;
              albumInput.dataset.genres = genresList.join(", ");
              renderTrackList();
            }
          } catch (error) {
            console.error("Ошибка при получении деталей альбома:", error);
          }
        });
        suggestionsBox.appendChild(suggestion);
      });

      suggestionsBox.style.display = "block";
    } catch (error) {
      console.error("Ошибка при получении альбомов:", error);
    }
  });
  loadReviews();
  const params = new URLSearchParams(window.location.search);
const uidFromUrl = params.get("uid");
if (uidFromUrl) {
  showFullPublicProfile(uidFromUrl);
  history.replaceState(null, "", window.location.pathname);
}
});
