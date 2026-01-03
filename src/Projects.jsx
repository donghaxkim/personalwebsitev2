import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

const Projects = ({ theme }) => {
  const projects = [
    {
      name: "3D Renderer",
      techStack: ["Python", "Pygame", "NumPy"],
      description: "An interactive wireframe editor that allows you to construct, manipulate, and rotate 3D mesh structures in real-time through a perspective-accurate workspace.",
      github: "https://github.com/donghaxkim/3DRenderer"
    },
    {
      name: "Personal Website v2",
      techStack: ["Next.js", "React", "Vite", "Tailwind CSS", "Framer Motion"],
      description: "This one :)",
      github: "https://github.com/donghaxkim/personalwebsitev2"
    },
    {
      name: "Bayesian Blackwell BlackJack Engine",
      techStack: ["NumPy", "SciPy", "Typing", "Functools", "Pathlib", "Dataclasses"],
      description: "A quantitative blackjack advisor that uses statistical modeling to provide real-time optimal play recommendations by analyzing shifting shoe probabilities and expected value.",
      github: "https://github.com/donghaxkim/Bayesian-BlackJack-Engine"
    },
    {
      name: "Personal Website v1",
      techStack: ["React", "Tailwind CSS", "Framer Motion", "Vite"],
      description: "My first website.",
      github: "https://personalwebsitev1-sable.vercel.app/"
    },
    {
      name: "Langton's Ant Sim",
      techStack: ["Python", "NumPy", "Matplotlib"],
      description: "An interactive cellular automaton simulation that visualizes emergent complexity by tracking multiple autonomous agents.",
      github: "https://github.com/donghaxkim/LangtonsAnt"
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto h-full overflow-y-auto px-4"
      style={{ paddingTop: '6rem', paddingBottom: '4rem' }}
    >
      <h1 
        className="text-6xl md:text-6xl font-semibold tracking-tighter text-left mb-[0.88rem]" 
        style={{ fontFamily: "'Gowun Batang', serif" }}
      >
        Projects
      </h1>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-12 md:space-y-16"
        style={{ fontFamily: "'Karla', sans-serif", marginTop: '0.88rem' }}
      >
        {projects.map((project, index) => (
          <motion.div
            key={project.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
            className={`${
              theme === 'dark' ? 'text-white/80' : 'text-black/80'
            }`}
          >
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <h2 className="text-xl md:text-2xl font-medium" style={{ fontFamily: "'Karla', sans-serif" }}>
                {project.name}
              </h2>
              <a 
                href={project.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-60 transition-opacity"
              >
                <ExternalLink size={18} strokeWidth={1.5} />
              </a>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className={`px-3 py-1 text-xs md:text-sm rounded-full font-light ${
                    theme === 'dark' 
                      ? 'bg-white/10 text-white/70' 
                      : 'bg-black/5 text-black/70'
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>
            
            <p className="text-sm md:text-base font-light leading-normal">
              {project.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default Projects