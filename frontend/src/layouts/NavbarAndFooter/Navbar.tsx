import { Link, useNavigate } from 'react-router-dom';


export const Navbar = () => {

    const navigate = useNavigate();

    const handleGologinClick = () => {
        navigate('/logins');
      };

      const handleScrollToServices = () => {
        const footerElement = document.getElementById('services');
        if (footerElement) {
          footerElement.scrollIntoView({ behavior: 'smooth' });
        }
      };
    return (
        <nav className='navbar navbar-expand-lg navbar-dark main-color py-3 '>
            <div className='container-fluid'>
                <span className='navbar-brand'>Service Desk </span>
                <button className='navbar-toggler' type='button'
                    data-bs-toggle='collapse' data-bs-target='#navbarNavDropdown'
                    aria-controls='navbarNavDropdown' aria-expanded='false'
                    aria-label='Toggle Navigation'
                >
                    <span className='navbar-toggler-icon'></span>
                </button>
                <div className='collapse navbar-collapse' id='navbarNavDropdown'>
                    <ul className='navbar-nav'>
                        <li className='nav-item'>
                            <a className='nav-link' href='/'>Home</a>
                        </li>
                        <li className='nav-item'>
                            {/* <a className='nav-link' href='/' onClick={handleScrollToFooter}>Services</a> */}
                            <Link className='nav-link' to="/" onClick={handleScrollToServices}> Services</Link>
                        </li>
                    </ul>

                    <ul className='navbar-nav ms-auto' >
                        <li className='nav-item m-1'>
                            <a type='button' className='btn btn-outline-light' onClick={handleGologinClick}>Login</a>
                            {/* <button type='button' className='btn main-color btn-lg' onClick={handleGoChgClick}>Go</button> */}
                        </li>

                    </ul>

                </div>
            </div>
        </nav>
    );
}