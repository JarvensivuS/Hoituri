import React from 'react'

const AlertsNotifications = () => {
    const notifications = [
        { id: 1, type: "alert", message: "Mummo kaatunut" },
        { id: 2, type: "notification", message: "Lääkkeet klo 11" },
        { id: 3, type: "alert", message: "Hätäpainike painettu" },
        { id: 4, type: "notification", message: "Päivystyskäynti ok" }
    ];

    return (
        <div>
            <h2>Hälytykset ja ilmoitukset</h2>
            <ul>
                {notifications.map((item) => (
                    <li key={item.id} style={{ color: item.type === "alert" ? "red" : "black" }}>
                        {item.message}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AlertsNotifications;