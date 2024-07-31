import logo from "../assets/studyscriptlogo.png";
import { navItems } from "../constants";
import { useRef } from 'react';

const Navbar = () => {
  const section1 = useRef(null)
  const section2 = useRef(null)
  const section3 = useRef(null)

  const scrollToSection = (elementRef) => {
    window.scrollTo({
      top: elementRef.current.offsetTop,
      behavior: "smooth",
    });
  };

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between  items-center">
          <div className="flex items-center flex-shrink-0">
            <img className="h-10 w-10 mr-1" src={logo} alt='logo'/>
            <span className="text-xl tracking-tight">StudyScript</span>
          </div>
          <ul className="hidden lg:flex ml-14 space-x-12">
            {navItems.map((item, index) => (
              <li key={index} className="hover:text-neutral-400 transition-color duration-300 onClick={() => scrollToSection(section1)}">
                <a href={item.href}>{item.label}</a>
              </li>
            ))} 
          </ul>
        </div>
      </div>    
    </nav>
  );
}

export default Navbar 
