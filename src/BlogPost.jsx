import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { BLOG_POSTS } from './Blog'
import { useState, useEffect, useRef, useMemo } from 'react'
import GlossaryTooltip from './components/GlossaryTooltip'
import RnnVsTransformerDiagram from './posts/attention-for-vibe-coders/RnnVsTransformerDiagram'
import QkvDiagram from './posts/attention-for-vibe-coders/QkvDiagram'
import MultiHeadDiagram from './posts/attention-for-vibe-coders/MultiHeadDiagram'

const mdxModules = import.meta.glob('./posts/**/index.mdx')

const BlogPost = ({ theme }) => {
  const { id } = useParams()
  const post = BLOG_POSTS.find((p) => p.id === id)
  const [MdxContent, setMdxContent] = useState(null)
  const contentRef = useRef(null)

  useEffect(() => {
    if (!post) return
    const loader = mdxModules[`./posts/${id}/index.mdx`]
    if (loader) {
      loader().then((mod) => setMdxContent(() => mod.default))
    }
  }, [id, post])

  const glossaryTerms = post?.glossary || []

  // Build a regex that matches any glossary term (whole word, case-insensitive)
  const termPattern = useMemo(() => {
    if (glossaryTerms.length === 0) return null
    const escaped = glossaryTerms.map((g) =>
      g.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    )
    return new RegExp(`\\b(${escaped.join('|')})\\b`, 'i')
  }, [glossaryTerms])

  // Custom components available in MDX
  const customComponents = useMemo(() => ({
    RnnVsTransformerDiagram: (props) => <RnnVsTransformerDiagram {...props} theme={theme} />,
    QkvDiagram: (props) => <QkvDiagram {...props} theme={theme} />,
    MultiHeadDiagram: (props) => <MultiHeadDiagram {...props} theme={theme} />,
  }), [theme])

  // MDX component overrides to add hover tooltips on glossary terms
  const mdxComponents = useMemo(() => {
    if (!termPattern) return customComponents

    const highlightText = (children) => {
      if (typeof children === 'string') {
        const parts = children.split(termPattern)
        if (parts.length === 1) return children
        return parts.map((part, i) => {
          if (termPattern.test(part)) {
            const entry = glossaryTerms.find(
              (g) => g.term.toLowerCase() === part.toLowerCase()
            )
            if (entry) {
              return (
                <GlossaryTooltip
                  key={i}
                  term={entry.term}
                  definition={entry.definition}
                  theme={theme}
                >
                  {part}
                </GlossaryTooltip>
              )
            }
          }
          return part
        })
      }
      return children
    }

    const wrapElement = (Tag) => {
      const Component = ({ children, ...props }) => {
        const processed = Array.isArray(children)
          ? children.map((child) =>
              typeof child === 'string' ? highlightText(child) : child
            )
          : highlightText(children)
        return <Tag {...props}>{processed}</Tag>
      }
      return Component
    }

    return {
      ...customComponents,
      p: wrapElement('p'),
      li: wrapElement('li'),
      td: wrapElement('td'),
    }
  }, [termPattern, theme, glossaryTerms, customComponents])

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

  if (!MdxContent) {
    return (
      <div
        className="w-full mx-auto self-start"
        style={{ maxWidth: '32rem', paddingTop: '6rem', paddingBottom: '4rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}
      />
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full mx-auto self-start"
        style={{ maxWidth: '32rem', paddingTop: '6rem', paddingBottom: '4rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}
      >
        <article
          className="w-full"
          style={{ fontFamily: "'Karla', sans-serif" }}
        >
          <Link
            to="/blog"
            className={`flex items-center gap-1.5 text-sm mb-6 ${theme === 'dark' ? 'text-white/50 hover:text-white' : 'text-black/50 hover:text-black'}`}
            style={{ fontFamily: "'Karla', sans-serif", transition: 'color 0.15s' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            back
          </Link>
          <h1
            className={`text-3xl sm:text-4xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}
            style={{ fontFamily: "'Gowun Batang', serif" }}
          >
            {post.title}
          </h1>
          <div
            className={`flex items-center gap-2 mt-3 text-sm ${theme === 'dark' ? 'text-white/50' : 'text-black/50'}`}
            style={{ fontFamily: "'Karla', sans-serif" }}
          >
            <span>{post.author}</span>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime} min read</span>
          </div>

          {post.cover && (
            <>
              <img
                src={post.cover}
                alt=""
                draggable={false}
                className="w-full rounded-lg select-none"
                style={{ objectFit: 'cover', marginTop: '0.75rem', marginBottom: '0' }}
              />
              <hr
                className={theme === 'dark' ? 'border-white/10' : 'border-black/10'}
                style={{ marginTop: '1.5rem', marginBottom: '-1rem' }}
              />
            </>
          )}

          <div
            ref={contentRef}
            className={`prose max-w-none ${
              theme === 'dark' ? 'prose-invert' : ''
            }`}
          >
            <MdxContent components={mdxComponents} />
          </div>
        </article>
      </motion.div>
    </>
  )
}

export default BlogPost
