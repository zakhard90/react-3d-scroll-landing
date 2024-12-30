import React, { useRef, useEffect, useContext } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Header from './sections/Header'
import First from './sections/First'
import Second from './sections/Second'
import Third from './sections/Third'
import { AppContext } from '../AppContext';
gsap.registerPlugin(ScrollTrigger)

const Section = (props) => {
  const ref = useRef(null)

  const ctx = useContext(AppContext)

  useEffect(() => {
    let prev = ref.current.previousElementSibling != null ? ref.current.previousElementSibling.getAttribute("id") : null
    let next = ref.current.nextElementSibling != null ? ref.current.nextElementSibling.getAttribute("id") : null

    gsap.to(
      ref.current,
      {
        y: 0,
        ease: 'power2.inOut',
        duration: 0.3,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom top',
          toggleActions: 'play pause resume reverse',
          scrub: 0.5,
          snap: true
        },
      },
    )

    gsap.to(
      ref.current,
      {
        y: 0,
        ease: 'power2.inOut',
        duration: 0.3,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top center',
          end: 'bottom center',
          toggleActions: 'play pause resume reverse',
          scrub: 0.5,
          onUpdate: ({ isActive, direction }) => {
            if (!isActive) {
              if (direction === 1 && next !== null) {
                ctx.setSection(next)
              } else if (direction === -1 && prev != null) {
                ctx.setSection(prev)
              }
            }
          }
        },
      },
    )
  })
  return <div id={props.tag} ref={ref}>{props.children}</div>
}

const Main = () => {
  return (
    <div className="main-container">
      <Section tag="header" >
        <Header />
      </Section>
      <Section tag="first-section">
        <First />
      </Section>
      <Section tag="second-section">
        <Second />
      </Section>
      <Section tag="third-section" >
        <Third />
      </Section>
    </div>
  )
}

export default Main
