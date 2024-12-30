
import Cursor from "./Cursor"
import Navbar from "./Navbar"
import Main from "./Main"
import Footer from "./Footer"

// import "../styles/theme.css" // prod only
import "../styles/layout.css"
import "../styles/App.css"


const App = () => {
  return (

    <div id="app" className="bg-void relative">
      <Cursor />
      <Navbar />
      <Main />
      <Footer />
    </div>
  )
}

export default App
