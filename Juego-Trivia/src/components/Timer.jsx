import { useEffect, useRef } from "react";

function Timer({ timeLeft, onTimeUp }) {
    const hasFinished = useRef(false);

    useEffect(() => {
        if (timeLeft > 0) {
            hasFinished.current = false;
            return;
        }

        if (!hasFinished.current) {
            hasFinished.current = true;
            onTimeUp();
        }
    }, [timeLeft, onTimeUp]);

    return (
        <div className="timer">
            Tiempo: <strong>{timeLeft}s</strong>
        </div>
    );
}

export default Timer;
