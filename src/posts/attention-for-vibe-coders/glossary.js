const glossary = [
  { term: 'transformer', definition: 'a neural network architecture that processes all tokens simultaneously using attention, rather than reading them one at a time. the foundation behind GPT, Claude, Gemini, and every major language model.' },
  { term: 'transformers', definition: 'a neural network architecture that processes all tokens simultaneously using attention, rather than reading them one at a time. the foundation behind GPT, Claude, Gemini, and every major language model.' },
  { term: 'token', definition: 'the smallest unit a model reads. usually a word or a piece of a word. "unbelievable" might become ["un", "believ", "able"].' },
  { term: 'RNN', definition: 'a neural network that reads words one at a time, left to right, updating a single summary at each step. each step overwrites the previous summary, which is why early context gets lost in long sentences.' },
  { term: 'RNNs', definition: 'a neural network that reads words one at a time, left to right, updating a single summary at each step. each step overwrites the previous summary, which is why early context gets lost in long sentences.' },
  { term: 'LSTMs', definition: 'long short-term memory networks. an improvement over basic RNNs that adds gates to control what gets remembered and what gets discarded. better at retaining earlier context but still sequential.' },
  { term: 'GRUs', definition: 'gated recurrent units. a simplified version of LSTMs with fewer gates. faster to train, similar performance on most tasks.' },
  { term: 'recursion', definition: 'when a function calls itself to solve a problem by breaking it into smaller versions of the same problem.' },
  { term: 'backpropagation', definition: 'the algorithm used to train neural networks. it works backward through the network, calculating how much each weight contributed to the error, then adjusting accordingly.' },
  { term: 'embedding', definition: "a vector of numbers that represents a token's meaning. tokens with similar meanings end up with similar vectors. \"king\" and \"queen\" are close together, \"king\" and \"toaster\" are far apart." },
  { term: 'softmax', definition: 'a function that takes a list of raw scores and converts them into weights between 0 and 1 that sum to 1. larger inputs get larger weights.' },
  { term: 'gradient descent', definition: 'how models learn. calculate how wrong the output is, figure out which direction to adjust each weight, take a small step in that direction, repeat billions of times.' },
  { term: 'weight matrices', definition: 'grids of learnable numbers that transform vectors into other vectors. in attention, there are separate weight matrices for producing queries, keys, and values.' },
  { term: 'hidden state', definition: "the RNN's running summary of everything it has read so far. gets overwritten at every step, which is why early context is lost." },
  { term: 'coreference', definition: 'when two different expressions in a sentence refer to the same entity. "the musician" and "her" pointing to the same person.' },
]

export default glossary
