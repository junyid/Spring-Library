import {Link, NavLink} from "react-router-dom";
import {useOktaAuth} from "@okta/okta-react";
import {SpinnerLoading} from "../Utils/SpinnerLoading";

export const Navbar = () => {
    const {oktaAuth, authState} = useOktaAuth();

    if (!authState) return <SpinnerLoading/>;

    const handleLogout = async () => {
        await oktaAuth.signOut();
    }

    console.log(authState);


    return (
        <nav className='navbar navbar-expand-lg navbar-dark main-color py-3'>
            <div className='container-fluid'>
                <Link className='navbar-brand' to='/home'>
                    <span> &nbsp; <img
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg"
                        height={34}/>    &nbsp;The Spring
                    Library</span>
                </Link>
                <button
                    className='navbar-toggler'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#navbarNavDropdown'
                    aria-controls='navbarNavDropdown'
                    aria-expanded='false'
                    aria-label='Toggle navigation'
                >
                    <span className='navbar-toggler-icon'></span>
                </button>
                <div className='collapse navbar-collapse' id='navbarNavDropdown'>
                    <ul className='navbar-nav'>
                        <li className='nav-item'>
                            <NavLink className='nav-link' to='/home'>
                                Home
                            </NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink className='nav-link' to='/search'>
                                Search Books
                            </NavLink>
                        </li>

                        {authState.isAuthenticated &&
                            <li className={'nav-item'}>
                                <NavLink className={'nav-link'} to={'/shelf'}>My Bookshelf</NavLink>
                            </li>}
                    </ul>
                    <ul className='navbar-nav ms-auto'>
                        {authState.isAuthenticated ?
                            <li className='nav-item'>
                                <a type='button' className='btn btn-dark' onClick={handleLogout}>
                                    Sign Out
                                </a>
                            </li> :
                            <li className='nav-item'>
                                <Link type='button' className='btn btn-outline-light' to={'/login'}>
                                    Sign In
                                </Link>
                            </li>
                        }
                    </ul>
                </div>
            </div>
        </nav>
    );
};
