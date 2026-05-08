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

  /* ---------------- AUTH ---------------- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);

      if (u) {
        fetchNotes(u.uid);
      }
    });

    return () => unsub();
  }, []);

  /* ---------------- LOGIN ---------------- */
  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      setUser(result.user);

      fetchNotes(result.user.uid);
    } catch (error: any) {
      console.log(error);

      alert(error.message);
    }
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = async () => {
    await signOut(auth);

    setUser(null);

    setNotes([]);
  };

  /* ---------------- FETCH NOTES ---------------- */
  const fetchNotes = async (uid: string) => {
    const snap = await getDocs(collection(db, `users/${uid}/notes`));

    setNotes(
      snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
  };

  /* ---------------- ADD NOTE ---------------- */
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

  /* ---------------- DELETE NOTE ---------------- */
  const deleteNote = async (id: string) => {
    if (!user) return;

    await deleteDoc(doc(db, `users/${user.uid}/notes`, id));

    fetchNotes(user.uid);
  };

  /* ---------------- EDIT NOTE ---------------- */
  const startEdit = (note: any) => {
    setTitle(note.title);

    setBody(note.body);

    setEditId(note.id);
  };

  /* ---------------- LOGIN PAGE ---------------- */
  if (!user) {
    return (
      <>
        <main
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#FCF6D9",
            fontFamily: "Arial",
          }}
        >
          <div
            style={{
              textAlign: "center",
              background: "#fffdf5",
              padding: "50px",
              borderRadius: "20px",
              border: "1px solid #e8dec0",
              boxShadow: "0 20px 40px rgba(69,40,41,0.15)",
              width: "90%",
              maxWidth: "420px",
            }}
          >
            <h1
              style={{
                fontSize: "52px",
                color: "#452829",
                marginBottom: "10px",
                fontWeight: "900",
              }}
            >
              📒 Notes App
            </h1>

            <p
              style={{
                color: "#452829",
                opacity: 0.7,
                marginBottom: "30px",
                fontSize: "16px",
              }}
            >
              Coffee • Calm • Classic Journal
            </p>

            <button
              onClick={login}
              style={{
                padding: "14px 24px",
                background: "#452829",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "17px",
                width: "100%",
              }}
            >
              Login with Google
            </button>
          </div>
        </main>

        <style jsx global>{`
          .custom-input::placeholder {
            color: #555 !important;
            opacity: 1;
          }
        `}</style>
      </>
    );
  }

  /* ---------------- MAIN APP ---------------- */
  return (
    <>
      <main
        style={{
          minHeight: "100vh",
          padding: "30px",
          background: "#FCF6D9",
          fontFamily: "Arial",
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
              marginBottom: "20px",
              boxShadow: "0 10px 20px rgba(69,40,41,0.08)",
            }}
          >
            <h1
              style={{
                color: "#452829",
                fontSize: "34px",
                marginBottom: "10px",
              }}
            >
              📒 My Notes
            </h1>

            <p style={{ color: "#452829", opacity: 0.7 }}>
              Logged in as: <b>{user.email}</b>
            </p>

            <button
              onClick={logout}
              style={{
                marginTop: "14px",
                background: "#452829",
                color: "#fff",
                border: "none",
                padding: "10px 16px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "700",
              }}
            >
              Logout
            </button>
          </div>

          {/* INPUT AREA */}
          <div
            style={{
              background: "#fffdf5",
              padding: "22px",
              borderRadius: "16px",
              marginBottom: "20px",
              boxShadow: "0 10px 20px rgba(69,40,41,0.08)",
            }}
          >
            <input
              className="custom-input"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "14px",
                marginBottom: "12px",
                borderRadius: "10px",
                border: "1px solid #e8dec0",
                fontSize: "16px",
                outline: "none",
                color: "#000000",
                backgroundColor: "#ffffff",
                WebkitTextFillColor: "#000",
                opacity: 1,
              }}
            />

            <textarea
              className="custom-input"
              placeholder="Write your note..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              style={{
                width: "100%",
                padding: "14px",
                marginBottom: "12px",
                borderRadius: "10px",
                border: "1px solid #e8dec0",
                fontSize: "16px",
                outline: "none",
                resize: "none",
                color: "#000000",
                backgroundColor: "#ffffff",
                WebkitTextFillColor: "#000",
                opacity: 1,
              }}
            />

            <button
              onClick={addNote}
              style={{
                width: "100%",
                padding: "14px",
                background: "#452829",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "16px",
              }}
            >
              {editId ? "Update Note ✏️" : "Add Note"}
            </button>
          </div>

          {/* NOTES */}
          {notes.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                color: "#452829",
                fontSize: "18px",
              }}
            >
              No notes yet ✨
            </p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                style={{
                  background: "#fffdf5",
                  padding: "18px",
                  borderRadius: "16px",
                  marginBottom: "14px",
                  border: "1px solid #e8dec0",
                  boxShadow: "0 10px 20px rgba(69,40,41,0.08)",
                }}
              >
                <h3
                  style={{
                    color: "#452829",
                    fontSize: "24px",
                    marginBottom: "8px",
                  }}
                >
                  {note.title}
                </h3>

                <p
                  style={{
                    color: "#452829",
                    opacity: 0.8,
                    marginBottom: "14px",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {note.body}
                </p>

                <button
                  onClick={() => startEdit(note)}
                  style={{
                    marginRight: "8px",
                    background: "#452829",
                    color: "#fff",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "700",
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
                    padding: "8px 12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "700",
                  }}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </main>

      <style jsx global>{`
        .custom-input::placeholder {
          color: #555 !important;
          opacity: 1;
        }
      `}</style>
    </>
  );
}