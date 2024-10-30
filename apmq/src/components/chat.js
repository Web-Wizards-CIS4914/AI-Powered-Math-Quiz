import React, { useState } from "react";

function Chat() {
    const [userMessage, setUserMessage] = useState("");
    const [response, setResponse] = useState("");
    const [error, setError] = useState(null);

    const handleChat = async (e) => {
        e.preventDefault();
        setError(null);
        
        try {
            const res = await fetch("http://localhost:5000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: userMessage }),
            });

            if (res.ok) {
                const data = await res.json();
                setResponse(data.response);
            } else {
                setError("An error occurred while getting the response.");
            }
        } catch (err) {
            setError("Unable to connect to the server.");
        }
    };

    return (
        <div>
            <h2>Chat with GPT-2</h2>
            <form onSubmit={handleChat}>
                <input
                    type="text"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Type your message..."
                    required
                />
                <button type="submit">Send</button>
            </form>
            {response && <p><strong>GPT-2:</strong> {response}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default Chat;
