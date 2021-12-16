<template>
  <div id="all">
    <h1> Dijkstra</h1>
    <div id="container"></div>
  </div>
</template>

<script>
import * as Three from 'three'
export default {
  name: 'Dijkstra',
  data () {
    return {
      scene: undefined,
      camera: undefined,
      renderer: undefined
    }
  },
  methods: {
    init: function () {
      let container = document.getElementById('container')
      let tailleTab = 16
      this.camera = new Three.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 20)
      this.camera.position.z = 15
      this.camera.position.x = tailleTab / 2
      this.camera.position.y = tailleTab / 2

      this.scene = new Three.Scene()
      let tab = []
      let tile = []
      let path = []
      let pathTab = []

      const geometry = new Three.PlaneGeometry(1, 1)
      const terre = new Three.MeshBasicMaterial({color: 0x32CD32, side: Three.DoubleSide})
      const lave = new Three.MeshBasicMaterial({color: 0xed0000, side: Three.DoubleSide})
      const pas = new Three.MeshBasicMaterial({color: 0x4CC8FF, side: Three.DoubleSide})
      const pathGeometry = new Three.PlaneGeometry(0.7, 0.7)

      // generation map

      for (let i = 0; i < tailleTab; i++) {
        tab[i] = []
        tile[i] = []
        path[i] = []

        for (let j = 0; j < tailleTab; j++) {
          let mat = terre
          tab[i][j] = 'terre'
          if (Math.floor(Math.random() * 3) === 0) {
            mat = lave
            tab[i][j] = 'lave'
          }
          tile[i][j] = new Three.Mesh(geometry, mat)
          this.scene.add(tile[i][j])
          // console.log(i + "  " +j)
          tile[i][j].position.x = i
          tile[i][j].position.y = j
        }
      }
      let xkey = Math.floor(Math.random() * tailleTab)
      let ykey = Math.floor(Math.random() * tailleTab)
      tab[xkey][ykey] = 'key'
      tile[xkey][ykey].material = new Three.MeshBasicMaterial({color: 0xffff00, side: Three.DoubleSide})
      // generation hero
      let x = xkey
      let y = ykey
      while (x === xkey && y === ykey) {
        x = Math.floor(Math.random() * tailleTab)
        y = Math.floor(Math.random() * tailleTab)
      }
      tab[x][y] = 'Hero'
      tile[x][y].material = new Three.MeshBasicMaterial({color: 0xf4fefe, side: Three.DoubleSide})

      function addPath (scene, x, y) {
        // direction
        for (let dir = 0; dir < 4; dir++) {
          let newX = x
          let newY = y
          // right
          if (dir === 0 && newX < tailleTab - 1) {
            newX = newX + 1
          }
          // left
          if (dir === 1 && newX > 1) {
            newX = newX - 1
          }
          // up
          if (dir === 2 && newY < tailleTab - 1) {
            newY = newY + 1
          }

          // down
          if (dir === 3 && newY > 1) {
            newY = newY - 1
          }
          if (!pathTab[newX]) {
            pathTab[newX] = []
          }
          if (pathTab[newX][newY] === 'path') {
            delete pathTab[newX][newY]
            return
          }

          if (tab[newX][newY] === 'key') {
            pathTab[newX][newY] = 'trouve'
            return
          }
          if (tab[newX][newY] === 'terre') {
            pathTab[newX][newY] = 'path'
            path[newX][newY] = new Three.Mesh(pathGeometry, pas)
            scene.add(path[newX][newY])
            path[newX][newY].position.x = newX
            path[newX][newY].position.y = newY
          }
        }

        // Object.keys(pathTab).map((x) => Object.keys(pathTab[x]).map((y) => addPath(scene, x, y)))
      }

      // GENERATING PATH
      let xpath = x
      let ypath = y
      let trouve = false
      addPath(this.scene, xpath, ypath)
      let counter = 0
      console.log(pathTab)

      while (!trouve && counter < 5000) {
        Object.keys(pathTab).forEach((x) => {
          counter++        
          Object.keys(pathTab[x]).forEach((y) => {
            let parsedX = parseInt(x, 10)
            let parsedY = parseInt(y, 10)
            if (pathTab[parsedX][parsedY] === 'trouve') {
              trouve = true
              return
            }
            if (pathTab[parsedX][parsedY] === 'path') addPath(this.scene, parsedX, parsedY)
          })
        })
      }

      console.log(trouve ? 'trouvé' : 'pas trouvé')
      console.log('clé en ', xkey, ykey, 'trouvée en ', counter, ' itérations')

      function HighlightCheckCase (scene, tiletab) {
        for (let i = 0; i < tiletab.length; i++) {
          const plane = new Three.Mesh(pathGeometry, pas)
          scene.add(plane)
          plane.position.x = tiletab[i][0]
          plane.position.y = tiletab[i][1]
        }
      }

      // ------------------------------------------------------------------------------------------------------------------
      this.renderer = new Three.WebGLRenderer({antialias: true})
      this.renderer.setSize(container.clientWidth, container.clientHeight)
      container.appendChild(this.renderer.domElement)
    },
    animate: function () {
      requestAnimationFrame(this.animate)
      // this.mesh.rotation.x += 0.01;
      // this.mesh.rotation.y += 0.02;
      this.renderer.render(this.scene, this.camera)
    }

  },
  mounted () {
    this.init()
    this.animate()
  }

}
</script>

<style scoped>
  #container{
    width: 1000px;
    height: 700px;
    margin-left: auto;
    margin-right: auto;
  }

</style>
