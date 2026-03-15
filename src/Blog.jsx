import { motion } from 'framer-motion'

/** Empty for now; used by BlogPost for /blog/:id. */
export const BLOG_POSTS = []

const BLOG_PLACEHOLDERS = [
  {
    name: 'Coming soon',
    techStack: ['#soon'],
  },
]

const Blog = ({ theme }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto h-full overflow-y-auto"
      style={{ paddingTop: '6rem', paddingBottom: '4rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}
    >
      <h1
        className="text-6xl md:text-6xl font-semibold tracking-tighter text-left mb-[0.88rem]"
        style={{ fontFamily: "'Gowun Batang', serif" }}
      >
        Blog
      </h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-12 md:space-y-16"
        style={{ fontFamily: "'Karla', sans-serif", marginTop: '0.88rem' }}
      >
        {BLOG_PLACEHOLDERS.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
            className={`${
              theme === 'dark' ? 'text-white/80' : 'text-black/80'
            }`}
          >
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <h2 className="text-xl md:text-2xl font-medium" style={{ fontFamily: "'Karla', sans-serif" }}>
                {item.name}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {item.techStack.map((tech) => (
                <span
                  key={tech}
                  className={`text-xs md:text-sm rounded-full font-light ${
                    theme === 'dark'
                      ? 'bg-white/10 text-white/70'
                      : 'bg-black/5 text-black/70'
                  }`}
                  style={{ padding: '2.8px 3px' }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default Blog
