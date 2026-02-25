"use client";

import { useEffect, useState } from "react";

export default function WelcomeUser() {
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const user = sessionStorage.getItem("user");
        if (user) {
            setUsername(JSON.parse(user).username);
        }
    }, []);

    if (!username) {
        return (
            <span className="text-primary"> </span>
        );
    }

    return (
        <span className="text-primary">, {username}</span>
    );
}
