import React, { useEffect, useState } from "react";
import "../App.css"
import dd from "../../public/Vector.png"
import top from "../../public/top.png"
type User = {
    name: string;
    email: string;
};

type Note = {
    _id: string;

    content: string;
};

export default function Welcome() {
    const [myuser, setMyUser] = useState<User | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [note, setNote] = useState({ content: "" });

    const token = localStorage.getItem("token");

    const authUser = async () => {
        try {
            const response = await fetch("http://localhost:5000/getuser", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            console.log("User:", data);
            setMyUser(data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchNotes = async () => {
        try {
            const res = await fetch("http://localhost:5000/notes", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setNotes(data);
        } catch (err) {
            console.log(err);
        }
    };

    const addNote = async () => {
        if (!note.content) return alert("Add something to note ");

        const res = await fetch("http://localhost:5000/notes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(note),
        });
        const data = await res.json();
        setNotes((prev) => [...prev, data.note]);
        setNote({ content: "" });
    };

    const deleteNote = async (id: string) => {
        await fetch(`http://localhost:5000/notes/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        setNotes((prev) => prev.filter((n) => n._id !== id));
    };
    const signout=()=>{
        localStorage.removeItem("token");
        window.location.href="/login"
    }

    useEffect(() => {
        authUser();
        fetchNotes();
    }, []);

    return (
        <div className="well" >
            <div style={{ display: "flex", justifyContent: "space-between", width: "20rem", alignItems: "center" }}>

              <img style={{marginRight:"-6rem",width:"10%"}} src={top} alt="" />  <h3>Dashboard</h3>
                <button onClick={signout} className="signout">signout</button>
            </div>


            {myuser && (
                <div className="card">
                    <span className="bold">Welcome,</span> <span className="bold">   {myuser.name}</span>
                    <p>Email: {myuser.email}</p>
                </div>
            )}


            <button className="button" onClick={addNote}>Create Note</button>

            <input style={{ width: "21rem", height: "2rem", margin: "1rem 0rem" }}
                placeholder="Content"
                value={note.content}
                onChange={(e) => setNote({ ...note, content: e.target.value })}
            />

            <ul style={{ marginLeft: "-2rem",overflowY:"scroll",height:"10rem" }}>
                {Array.isArray(notes) ? (
                    notes.map((n) => (
                        <li style={{marginTop:"1rem"}} className="styless" key={n._id}>
                            <div style={{ margin: "0.5rem 0rem" }}>

                                {n.content}
                            </div>
                            <button onClick={() => deleteNote(n._id)}><img src={dd}></img></button>
                        </li>
                    ))
                ) : (
                    <p style={{ color: "red" }}>Error in loading notes</p>
                )}
            </ul>
        </div>
    );
}
