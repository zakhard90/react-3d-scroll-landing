import React, { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { nanoid } from 'nanoid'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  OrthographicCamera,
  OrbitControls,
  GradientTexture
} from '@react-three/drei'

import { deg, easeInOut } from '../../Helpers'

gsap.registerPlugin(ScrollTrigger)

const Camera = (props) => {
  const ref = useRef()
  let { position, zoom } = props


  const pivotRef = useRef()
  const pivot = <mesh ref={pivotRef} key={nanoid()} position={[0, 0, 0]}>
    const camera = <OrthographicCamera
      ref={ref}
      key={nanoid()}
      makeDefault
      position={position}
      zoom={zoom}
    />
  </mesh>

  const controls = <OrbitControls
    key={nanoid()}
    enabled={true}
    enableDamping={true}
    dampingFactor={0.001}
    enableRotate={true}
    enableZoom={false}
    enablePan={false}
    minPolarAngle={deg(50)}
    maxPolarAngle={deg(70)}
  />

  useFrame(() => {
    pivotRef.current.rotation.y += deg(0.5)
  })

  return (
    [
      controls,
      pivot
    ]
  )
}

const Block = (props) => {
  const ref = useRef()

  let height = 1
  let length = 1
  let depth = 1

  let block = <mesh
    key={nanoid()}
    {...props}
    ref={ref}
    scale={1}
    position={props.position}
  >
    <boxGeometry args={[depth, height, length]} />
    <meshPhysicalMaterial>
      <GradientTexture
        stops={[0, 1]}
        colors={["#f33829", "#ba261a"]}
        size={1024}
        rotation={deg(-90)}
      />
    </meshPhysicalMaterial>
  </mesh>
  return (block)
}

const Cube = (props) => {
  let arr = [-1, 0, 1]
  let s = 1.4
  let blocks = arr.map(x => arr.map(y => arr.map(z => {

    return (
      <group key={nanoid()} axis={new THREE.Vector3(1, 0, 0)} angle={0} gx={x} gy={y} gz={z}>
        <Block key={nanoid()} position={[x * s, y * s, z * s]} />
      </group>
    )
  }))).flat(3)

  const cubeRef = useRef()

  const cube = <group ref={cubeRef} key={nanoid()}>
    {blocks}
  </group>

  const rotate = (rotating, axis, position, increment, pauseInterval, rounds) => {

    let { array } = rotating
    let now = new Date().getTime()
    let axes = ["x", "y", "z"]

    if (array == null) {
      array = cubeRef.current.children.filter(b => {
        return (b["g" + axis] === position)
      })
    }

    let stop = false

    let total = deg(90) * rounds
    let degree = 0

    if (!rotating.isRunning && (rotating.lastPause + (pauseInterval * 1000)) < now) {
      rotating.isRunning = true
    }

    for (let f = 1; f <= increment; f++) {
      if (rotating.isRunning) {
        let a = (f * (1 - easeInOut(rotating.rotated / total, 2)) / 5)
        if (a < 0.05) {
          a = 0.07
        }
        let n = deg(a)
        if ((rotating.rotated + n) >= total) {
          degree = total - rotating.rotated
          rotating.isRunning = false
          rotating.rotated = 0
          rotating.lastPause = now
          stop = true
        } else {
          degree = n
        }
        rotating.rotated += degree

        if (true) {

          if (rotating.rotated <= total) {
            array.forEach((b) => {
              b.rotateOnWorldAxis(
                new THREE.Vector3(
                  axis == "x" ? 1 : 0,
                  axis == "y" ? 1 : 0,
                  axis == "z" ? 1 : 0),
                degree)
            })
            if (rotating.rotated <= total) {
              rotating.array = array
            }
          }
        }

        if (stop) {
          cubeRef.current.children.forEach((b) => {
            let vec = new THREE.Vector3()
            for (let c of axes) {
              let p = b.children[0].getWorldPosition(vec)[c]
              let v = Math.round((Math.round(p * 100) / 100) / s)
              b["g" + c] = v
            }
          })
          rotating.array = null
        }
      }
    }

    return rotating
  }

  const sequence = [["x", 1, 2], ["y", 1, 3], ["z", 0, 2], ["y", 0, 1], ["x", -1, 1], ["z", 1, 3]]

  const [animate, setAnimate] = useState(true)

  let step = 0
  let last = null
  let angularSpeed = 20
  let rotating = { array: null, revolutions: 0, isRunning: true, lastPause: 0, rotated: 0 }
  let decimals = 2
  let precision = Math.pow(10, decimals)
  let pauseInterval = 1
  useFrame(({ clock }) => {
    if (step >= 0) {
      let time = clock.getElapsedTime()
      let sec = Math.floor(time * precision)
      if (sec > 3 && sec != last) {
        let [axis, position, rounds] = sequence[step]
        rotating = rotate(rotating, axis, position, angularSpeed, pauseInterval, rounds)
        last = sec

        if (!rotating.isRunning) {
          if (!animate) {
            step = -1
          } else {
            step = (step > sequence.length - 2) ? 0 : step + 1
          }
          pauseInterval = Math.random()
          angularSpeed = 15 + (5 * Math.random())
        }
      }
    }

  })

  useEffect(() => {
    gsap.timeline({
      scrollTrigger: {
        trigger: "#header",
        start: "-20% top",
        endTrigger: "#header",
        end: "100% bottom",
        // markers: true,
        scrub: 0.8,
        onStart: () => {
          setAnimate(false)
        }
      }
    })
  }, []);

  return (cube)
}

const Header = (props) => {
  return (
    <section className="bg-primary w-full h-screen">
      <Canvas
        colorManagement
      >
        <Camera position={[90, 90, 90]} zoom={60} duration={6} />
        <ambientLight intensity={0.9} color="#ffc5b5" />
        <fog attach="fog" args={['#ff7751', 153, 159]} />
        <directionalLight
          position={[-10, 5, -10]}
          intensity={1}
        />
        <pointLight intensity={0.5} position={[10, 50, 10]} color="#4975da" />
        <pointLight intensity={0.9} position={[30, -10, 0]} color="#fff" />
        <directionalLight
          position={[-10, 5, 10]}
          intensity={0.9}
          color="#bbc3ed"
        />
        <Cube />
      </Canvas>
      <div className="hero">
        <h1 className="typewriter-1">Main header</h1>
        <h2 className="typewriter-2">Your fancy subheader</h2>
      </div>
      <div className="mouse-scroll"></div>
    </section>
  )
}

export default Header
