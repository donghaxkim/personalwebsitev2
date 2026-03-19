import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export const BLOG_POSTS = [
  {
    id: 'attention',
    title: "attention for vibe coders",
    date: '2026-03-17',
    author: 'dongha kim',
    readTime: 14,
    cover: '/attention-cover.jpg',
    excerpt: "you've read papers, you've seen the diagrams, you've frequently come across the word attention. but what the hell is attention?",
    techStack: ['#AI', '#NLP', '#transformers'],
    glossary: [
      { term: 'transformer', definition: 'a neural network architecture that processes all tokens simultaneously using attention, rather than reading them one at a time. the foundation behind GPT, Claude, Gemini, and every major language model.' },
      { term: 'transformers', definition: 'a neural network architecture that processes all tokens simultaneously using attention, rather than reading them one at a time. the foundation behind GPT, Claude, Gemini, and every major language model.' },
      { term: 'token', definition: 'the smallest unit a model reads. usually a word or a piece of a word. "unbelievable" might become ["un", "believ", "able"].' },
      { term: 'RNN', definition: 'a neural network that reads words one at a time, left to right, updating a single summary at each step. each step overwrites the previous summary, which is why early context gets lost in long sentences.' },
      { term: 'RNNs', definition: 'a neural network that reads words one at a time, left to right, updating a single summary at each step. each step overwrites the previous summary, which is why early context gets lost in long sentences.' },
      { term: 'LSTMs', definition: 'long short-term memory networks. an improvement over basic RNNs that adds gates to control what gets remembered and what gets discarded. better at retaining earlier context but still sequential.' },
      { term: 'GRUs', definition: 'gated recurrent units. a simplified version of LSTMs with fewer gates. faster to train, similar performance on most tasks.' },
      { term: 'recursion', definition: 'when a function calls itself to solve a problem by breaking it into smaller versions of the same problem.' },
      { term: 'backpropagation', definition: 'the algorithm used to train neural networks. it works backward through the network, calculating how much each weight contributed to the error, then adjusting accordingly.' },
      { term: 'embedding', definition: 'a vector of numbers that represents a token\'s meaning. tokens with similar meanings end up with similar vectors. "king" and "queen" are close together, "king" and "toaster" are far apart.' },
      { term: 'softmax', definition: 'a function that takes a list of raw scores and converts them into weights between 0 and 1 that sum to 1. larger inputs get larger weights.' },
      { term: 'gradient descent', definition: 'how models learn. calculate how wrong the output is, figure out which direction to adjust each weight, take a small step in that direction, repeat billions of times.' },
      { term: 'weight matrices', definition: 'grids of learnable numbers that transform vectors into other vectors. in attention, there are separate weight matrices for producing queries, keys, and values.' },
      { term: 'hidden state', definition: 'the RNN\'s running summary of everything it has read so far. gets overwritten at every step, which is why early context is lost.' },
      { term: 'coreference', definition: 'when two different expressions in a sentence refer to the same entity. "the musician" and "her" pointing to the same person.' },
    ],
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
