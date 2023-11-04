import React from "react";
import "./CountDown.scss";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";

const CountDown = (props) => {
    const [timerDays, setTimerDays] = useState("--");
    const [timerHours, setTimerHours] = useState("--");
    const [timerMinutes, setTimerMinutes] = useState("--");
    const [timerSeconds, setTimerSeconds] = useState("--");
    let interval = useRef(null);
    const startTimer = () => {
        // 'November 01, 2023 00:00:00'
        const countdownDate = new Date(props.exp * 1000).getTime();
        interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = countdownDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (distance < 0) {
                clearInterval(interval?.current);
            } else {
                setTimerDays(days);
                setTimerHours(hours);
                setTimerMinutes(minutes);
                setTimerSeconds(seconds);
            }
        }, 1000);
    };

    useEffect(() => {
        if (props.exp !== "expired") {
            startTimer();
        }

        return () => {
            if (props.exp !== "expired") {
                clearInterval(interval?.current);
            }
        };
    });
    return (
        <section className="timer">
            <h3 style={{ textAlign: "center" }}>{props.title}</h3>
            {props.exp == "expired" ||
                (timerDays == 0 &&
                    timerMinutes == 0 &&
                    timerHours == 0 &&
                    timerSeconds == 0) ? (
                <p style={{ textAlign: "center" }}>Expired</p>
            ) : (
                <div>
                    <section>
                        <p>{timerDays}</p>
                        <p>
                            <small>Days</small>
                        </p>
                    </section>
                    <span>:</span>
                    <section>
                        <p>{timerHours}</p>
                        <p>
                            <small>Hours</small>
                        </p>
                    </section>
                    <span>:</span>
                    <section>
                        <p>{timerMinutes}</p>
                        <p>
                            <small>Minutes</small>
                        </p>
                    </section>
                    <span>:</span>
                    <section>
                        <p>{timerSeconds}</p>
                        <p>
                            <small>Seconds</small>
                        </p>
                    </section>
                </div>
            )}
        </section>
    );
};

export default CountDown;
