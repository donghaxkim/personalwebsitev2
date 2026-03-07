import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { BLOG_POSTS } from './Blog'

const BlogPost = ({ theme }) => {
  const { id } = useParams()
  const post = BLOG_POSTS.find((p) => p.id === id)

  if (!post) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-2xl mx-auto"
        style={{ paddingTop: '6rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}
      >
        <p className={theme === 'dark' ? 'text-white/80' : 'text-black/80'}>Post not found.</p>
        <Link to="/blog" className={`mt-4 inline-block underline ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
          Back to Blog
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
      style={{ paddingTop: '6rem', paddingBottom: '4rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', fontFamily: "'Karla', sans-serif" }}
    >
      <Link
        to="/blog"
        className={`text-sm underline ${theme === 'dark' ? 'text-white/70 hover:text-white' : 'text-black/70 hover:text-black'}`}
      >
        ← Back to Blog
      </Link>
      <time className={`block mt-4 text-sm opacity-70 ${theme === 'dark' ? 'text-white/70' : 'text-black/70'}`}>
        {post.date}
      </time>
      <h1
        className={`mt-2 text-3xl sm:text-4xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}
        style={{ fontFamily: "'Gowun Batang', serif" }}
      >
        {post.title}
      </h1>
      <p className={`mt-6 ${theme === 'dark' ? 'text-white/80' : 'text-black/80'}`}>{post.body || post.excerpt}</p>
    </motion.article>
  )
}

export default BlogPost
