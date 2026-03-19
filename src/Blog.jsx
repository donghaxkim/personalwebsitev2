import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import attentionGlossary from './posts/attention-for-vibe-coders/glossary'

export const BLOG_POSTS = [
  {
    id: 'attention-for-vibe-coders',
    title: "attention for vibe coders",
    date: '2026-03-19',
    author: 'dongha kim',
    readTime: 14,
    cover: '/attention-cover.jpg',
    excerpt: "you've read papers, you've seen the diagrams, you've frequently come across the word attention. but what the hell is attention?",
    techStack: ['#AI', '#NLP', '#transformers'],
    glossary: attentionGlossary,
  },
]

const Blog = ({ theme }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full mx-auto h-full overflow-y-auto"
      style={{ maxWidth: '32rem', paddingTop: '6rem', paddingBottom: '4rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}
    >
      <h1
        className="text-4xl md:text-5xl font-semibold tracking-tighter text-left mb-[0.5rem]"
        style={{ fontFamily: "'Gowun Batang', serif" }}
      >
        blog
      </h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-12 md:space-y-16"
        style={{ fontFamily: "'Karla', sans-serif", marginTop: '0.5rem' }}
      >
        {BLOG_POSTS.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
            className={`${
              theme === 'dark' ? 'text-white/80' : 'text-black/80'
            }`}
          >
            <Link to={`/blog/${post.id}`} className="group block">
              <div className="flex items-center gap-3 mb-1 md:mb-2">
                <h2
                  className={`text-xl md:text-2xl font-medium group-hover:underline ${
                    theme === 'dark' ? 'group-hover:text-white' : 'group-hover:text-black'
                  }`}
                  style={{ fontFamily: "'Karla', sans-serif" }}
                >
                  {post.title}
                </h2>
              </div>
              <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-white/50' : 'text-black/50'}`}>
                {post.date}
              </p>
            </Link>

            <div className="flex flex-wrap gap-2">
              {post.techStack.map((tech) => (
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
