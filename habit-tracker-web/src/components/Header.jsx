function Header({ streak }) {
    const plural = streak === 1 ? " " : "s"
    const fire = streak > 0 ? "🔥" : ""

    return (
        <div>
            <h3> Streak : {streak} day{plural} {fire} </h3>
        </div>
    )
}

export default Header