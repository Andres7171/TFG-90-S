import { motion } from 'framer-motion'
import '../styles/Blog.css'

const STORY = [
  {
    heading: 'El origen: tres tíos, un sótano y demasiado rap',
    text: `Todo empezó en 2024 en una clase de un grado universitario donde tres estudiantes — Andrés, Sergio y Alvaro — coincidieron en un trabajo final de grado que no sabían muy bien cómo enfocar. Ninguno quería hacer algo aburrido. Los tres compartían algo más que la carrera: una obsesión por la cultura hip-hop, por los 90, por esa época en la que la ropa no era solo ropa sino un manifiesto. Wu-Tang Clan, Tupac, Notorious B.I.G., Nas, AZ, Mobb Deep. Pantalones anchos, bomber jackets, Timberlands, snapbacks. Una estética que había moldeado generaciones y que, según ellos, nunca había tenido el reconocimiento que merecía en España. Así que en vez de presentar un proyecto genérico, decidieron construir algo real: una tienda online dedicada exclusivamente a ropa de estilo retro de los años 80 y 90, inspirada en la cultura del hip-hop y el streetwear de aquella época. Le pusieron nombre esa misma tarde, casi por broma: RetroWear. El nombre lo decía todo.`
  },
  {
    heading: 'Construyendo desde cero: código, tela y mucha cafeína',
    text: `Los primeros meses fueron caóticos. Andrés se encargó del desarrollo web, aprendiendo React y Supabase mientras la plataforma tomaba forma. Marco llevaba el diseño — pasaba horas buscando referencias de lookbooks de los 90, catálogos de Supreme de 2003, fotos de videoclips de Jay-Z en Timberlands y chaquetas FUBU. Rubén gestionaba los contactos con proveedores de ropa vintage, viajando a mercadillos, ferias de segunda mano y almacenes en Madrid y Barcelona para encontrar piezas auténticas. La web se construyó con una filosofía clara: negro, amarillo, tipografía de impacto. Sin florituras. Como la música que los inspiraba. Cada producto tenía su historia, su década, su contexto cultural. No vendían camisetas — vendían fragmentos de una época que mucha gente quería recuperar y otra quería descubrir por primera vez.`
  },
  {
    heading: 'Los referentes: de las calles de Nueva York a las pantallas de España',
    text: `La cultura que inspira RetroWear no nació en ningún laboratorio de tendencias. Nació en el Bronx, en Compton, en Harlem, en las calles donde la música y la moda eran el único lenguaje que no necesitaba traducción. Run-DMC popularizó las Adidas sin cordones y convirtió las zapatillas deportivas en un símbolo cultural. LL Cool J con su cazadora de cuero y su cadena gruesa. Salt-N-Pepa rompiendo moldes de género con outfits que hoy siguen siendo referencia. La película Juice de 1992 con Tupac. Menace II Society. Boyz n the Hood. Cada fotograma era un catálogo de estilo. Más tarde llegaron las revistas: The Source, Vibe, XXL. Y con internet, el streetwear dejó de ser cosa de barrio y se convirtió en lenguaje global. Supreme, Stüssy, FUBU, Karl Kani, Cross Colours. Todas esas marcas dejaron una huella que RetroWear recoge, respeta y reinterpreta para el consumidor europeo del siglo XXI.`
  },
  {
    heading: 'El marketplace: más que una tienda',
    text: `Lo que empezó como un proyecto universitario evolucionó rápidamente hacia algo más ambicioso. Cuando la plataforma estuvo lista y los primeros pedidos empezaron a llegar, quedó claro que había un nicho enorme sin cubrir en España: gente que amaba el estilo de los 90 pero no tenía un lugar de referencia donde encontrar producto curado, auténtico y con contexto cultural. RetroWear se convirtió en un marketplace: no solo vendían piezas propias, sino que abrieron la plataforma a vendedores y marcas que compartían la misma visión estética. Coleccionistas de ropa vintage, diseñadores independientes inspirados en el hip-hop, marcas emergentes de streetwear español. Todo bajo un mismo techo digital, con la misma identidad visual: negra, amarilla, ruidosa y directa como un beat de DJ Premier.`
  },
  {
    heading: 'Colaboraciones y crecimiento: cuando las grandes marcas llamaron a la puerta',
    text: `El crecimiento fue orgánico pero imparable. Las redes sociales hicieron el resto — contenido sin filtros, sin poses corporativas, solo cultura. Un post sobre la historia de los bomber jackets en el hip-hop llegó a 200.000 personas en 48 horas. Una colección cápsula inspirada en el álbum Illmatic de Nas se agotó en tres días. Fue entonces cuando las primeras marcas grandes empezaron a contactarles. Colaboraciones con distribuidores europeos de ropa vintage certificada, acuerdos con DJs y productores musicales para colecciones exclusivas, presencia en festivales de hip-hop y cultura urbana como el Madrid Urban Music Festival. RetroWear dejó de ser un TFG para convertirse en una empresa real, con almacén, con equipo y con una comunidad de miles de personas que compartían la misma pasión por una época que, claramente, nunca murió del todo.`
  },
  {
    heading: 'Hoy: el marketplace más innovador de España',
    text: `En 2025, RetroWear es reconocida como la plataforma de referencia del streetwear y la moda retro en España. No solo por el catálogo — que incluye miles de piezas de los años 80 y 90, desde camisetas gráficas hasta chaquetas de cuero pasando por accesorios y calzado — sino por la experiencia que ofrece. Cada producto viene con contexto: qué artista lo llevó, en qué videoclip apareció, qué significa dentro de la cultura. Comprar en RetroWear no es solo adquirir una prenda, es conectar con una historia. La innovación no se detiene: realidad aumentada para probarse las prendas, sistema de valoración de autenticidad para piezas vintage, guías de estilo basadas en décadas y subgéneros musicales. Todo construido con la misma energía con la que tres estudiantes se juntaron una tarde a hablar de rap y terminaron cambiando la forma en que España consume moda urbana. Esto no es nostalgia — es el futuro del streetwear.`
  }
]

export function Blog() {
  return (
    <div className="blog-page">
      <div className="container py-5">

        <motion.h1
          className="blog-title mb-1"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          NUESTRA HISTORIA
        </motion.h1>

        <motion.p
          className="blog-eyebrow mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          De un TFG a el marketplace de streetwear más innovador de España
        </motion.p>

        {STORY.map((section, i) => (
          <motion.div
            key={i}
            className="blog-section mb-5"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="blog-section-title">{section.heading}</h2>
            <p className="blog-text">{section.text}</p>
          </motion.div>
        ))}

      </div>
    </div>
  )
}
