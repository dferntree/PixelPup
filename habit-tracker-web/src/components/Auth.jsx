import { useState } from 'react'
import { signUpUser, loginUser } from '../firebase'

function Auth({ onAuthSuccess }) { //use onAuthSuccess as a prop to let App know when user is authenticated
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false) //tracks whether user is signing up or logging in
    const [error, setError] = useState('') // will store error messages to show user
    const [loading, setLoading] = useState(false) // use to show loading button

    const handleSubmit = async (e) => {
        e.preventDefault() // Stops page from refreshing when form submits, page reloads and loses state otherwise

        setError('') // clear error messages

        setLoading(true) //disable submit to show loading

        try {

            if (isSignUp){
                await signUpUser(email, password) // if sign up create a new account
            } else {
                await loginUser(email, password)
            }

            onAuthSuccess() // to tell App that user is now logged in

        } catch (error)  {
            if(error.code === 'auth/email-already-in-use'){
                setError('Email already in use')
            } else if(error.code === 'auth/weak-password'){
                setError('Password should be at least 6 characters')
            } else if (error.code === 'auth/invalid-email') {
                setError('Invalid email address')
            } else if (error.code === 'auth/user-not-found') {
                setError('No account found with this email')
            } else if (error.code === 'auth/wrong-password') {
                setError('Incorrect password')
            } else {
                setError(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className = "auth-container">
            <div className = "auth-box">
                <h1> PixelPup </h1>
                <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email" //browser validates email format
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} //update email state when the user types
                        required
                    />

                    <input
                        type="password" //hides characters
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && <p className="error">{error}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? 'Loading...' : isSignUp? 'Sign Up' : 'Log In'}
                    </button>
                </form>

                <p>
                    {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                    <button
                        type="button"
                        onClick={() => {
                            setIsSignUp(!isSignUp)
                            setError('')
                        }}
                        className="link-button"
                    >
                        {isSignUp ? 'Log In' : 'Sign Up'}
                    </button>
                </p>
            </div> 
        </div>
    )
}

export default Auth