import React, { useRef, useEffect, useContext } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { AppContext } from '../AppContext';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const navigation = [
  { name: 'First section', target: 'first-section' },
  { name: 'Second section', target: 'second-section' },
  { name: 'Third section', target: 'third-section' },
]

const Link = (props) => {

  const ctx = useContext(AppContext);
  const activeRef = useRef()

  const goToSection = (e) => {
    e.preventDefault()
    const linkTarget = props.to
    gsap.to(window, {
      duration: 0.3,
      scrollTo: `#${linkTarget}`,
    })
  }

  let classNames = props.className;
  if (props.to === ctx.section) {
    classNames += " active";
  }

  return (<a
    ref={activeRef}
    href="#"
    to={props.to}
    className={classNames}
    onClick={goToSection}
  >
    {props.name}
  </a>)
}

const Navbar = () => {
  const navRef = useRef()

  useEffect(() => {
    gsap.fromTo(
      navRef.current, {
      backgroundColor: 'rgba(15, 75, 220,0)',
    },
      {
        backgroundColor: 'rgba(15, 75, 220,0.7)',
        ease: 'power2.inOut',
        duration: 0.3,
        scrollTrigger: {
          trigger: '#supply-chain',
          scrub: 1,
          start: '-100px top',
          end: 'bottom bottom',
          toggleActions: 'restart none none reset',
        },
      },
    )

    gsap.from(navRef.current, {
      duration: 0.3,
      autoAlpha: 0,
      ease: 'power2.inOut',
      delay: 1,
    })
  }, [])

  return (
    <nav ref={navRef} className="flex flex-row main-navbar fixed w-full z-10">
      <div className="flex-1">
        <div className="logo">
          <Link
            to="header"
            name="BRAND"
          />

        </div>
      </div>
      <div className="flex flex-2 justify-center grow p-5 space-x-10">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.target}
            name={item.name}
            className={`navbar-link mt-1 text-gray-100 hover:text-white`}
          />
        ))}
      </div>
      <div className="flex-1"></div>
    </nav>
  )
}

export default Navbar
