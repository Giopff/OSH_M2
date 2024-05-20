import 'bootstrap/dist/css/bootstrap.min.css';
import './HomePage.css';
import NavbarComponent from './NavbarComponent';
import ResponsiveSwiper from './NewsSwiper';


export function HomePage() {
  return (
    <div id="home-page">
      <NavbarComponent/>
      <ResponsiveSwiper/>
    </div>
  );
}

export default HomePage;
