"use client";

import { useEffect, useState } from "react";
import { db, auth, provider } from "@/lib/firebase";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) fetchNotes(u.uid);
    });

    return () => unsub();
  }, []);

  const login = async () => {
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setNotes([]);
  };

  const fetchNotes = async (uid: string) => {
    const snap = await getDocs(collection(db, `users/${uid}/notes`));
    setNotes(
      snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
  };

  const addNote = async () => {
    if (!user || !title || !body) return;

    if (editId) {
      await deleteDoc(doc(db, `users/${user.uid}/notes`, editId));
      setEditId(null);
    }

    await addDoc(collection(db, `users/${user.uid}/notes`), {
      title,
      body,
    });

    setTitle("");
    setBody("");
    fetchNotes(user.uid);
  };

  const deleteNote = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, `users/${user.uid}/notes`, id));
    fetchNotes(user.uid);
  };

  const startEdit = (note: any) => {
    setTitle(note.title);
    setBody(note.body);
    setEditId(note.id);
  };

  /* ---------------- LOGIN ---------------- */
  if (!user) {
    return (
      <main
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial",
          background: "#FCF6D9",
        }}
      >
        <div
          style={{
            textAlign: "center",
            background: "#fffdf5",
            padding: "50px",
            borderRadius: "18px",
            border: "1px solid #e8dec0",
            boxShadow: "0 20px 40px rgba(69,40,41,0.15)",
          }}
        >
          <h1
            style={{
              fontSize: "46px",
              fontWeight: "900",
              color: "#452829",
            }}
          >
            📒 Notes App
          </h1>

          <p style={{ color: "#452829", opacity: 0.7, marginBottom: "20px" }}>
            Coffee • Calm • Classic Journal
          </p>

          <button
            onClick={login}
            style={{
              padding: "12px 22px",
              background: "#452829",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "16px",
            }}
          >
            Login with Google
          </button>
        </div>
      </main>
    );
  }

  /* ---------------- MAIN UI ---------------- */
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "30px",
        fontFamily: "Arial",
        background: "#FCF6D9",
      }}
    >
      <div style={{ maxWidth: "720px", margin: "auto" }}>
        {/* HEADER */}
        <div
          style={{
            background: "#fffdf5",
            padding: "22px",
            borderRadius: "16px",
            border: "1px solid #e8dec0",
            boxShadow: "0 10px 25px rgba(69,40,41,0.12)",
            marginBottom: "20px",
          }}
        >
          <h1 style={{ color: "#452829", fontSize: "32px" }}>
            📒 My Notes
          </h1>

          <p style={{ color: "#452829", opacity: 0.7 }}>
            Logged in as: <b>{user.email}</b>
          </p>

          <button
            onClick={logout}
            style={{
              marginTop: "10px",
              background: "#452829",
              color: "#fff",
              border: "none",
              padding: "8px 14px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>

        {/* INPUT */}
        <div
          style={{
            background: "#fffdf5",
            padding: "22px",
            borderRadius: "16px",
            border: "1px solid #e8dec0",
            marginBottom: "20px",
          }}
        >
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "10px",
              border: "1px solid #e8dec0",
              outline: "none",
              color: "#452829",
              background: "#FCF6D9",
            }}
          />

          <input
            placeholder="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "10px",
              border: "1px solid #e8dec0",
              outline: "none",
              color: "#452829",
              background: "#FCF6D9",
            }}
          />

          <button
            onClick={addNote}
            style={{
              width: "100%",
              padding: "12px",
              background: "#452829",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            {editId ? "Update Note ✏️" : "Add Note"}
          </button>
        </div>

        {/* NOTES */}
        {notes.length === 0 ? (
          <p style={{ textAlign: "center", color: "#452829" }}>
            No notes yet ✨
          </p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              style={{
                background: "#fffdf5",
                padding: "16px",
                borderRadius: "16px",
                marginBottom: "12px",
                border: "1px solid #e8dec0",
                boxShadow: "0 8px 18px rgba(69,40,41,0.10)",
              }}
            >
              <h3 style={{ color: "#452829" }}>{note.title}</h3>
              <p style={{ color: "#452829", opacity: 0.8 }}>
                {note.body}
              </p>

              <button
                onClick={() => startEdit(note)}
                style={{
                  marginRight: "8px",
                  background: "#452829",
                  color: "#fff",
                  border: "none",
                  padding: "6px 10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>

              <button
                onClick={() => deleteNote(note.id)}
                style={{
                  background: "#7a3e3e",
                  color: "#fff",
                  border: "none",
                  padding: "6px 10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </main>
  );
}