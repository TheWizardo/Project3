import Copyright from "../Copyright/Copyright";
import NavBar from "../NavBar/NavBar";
import Router from "../Router/Router";
import "./Layout.css";

function Layout(): JSX.Element {
    return (
        <div className="Layout">
        <header>
            <NavBar />
        </header>
        <main>
            <Router />
        </main>
        <footer>
            <Copyright />
        </footer>
        </div>
    );
}

export default Layout;
