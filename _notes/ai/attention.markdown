---
layout: note
title:  "Attention"
permalink: /notes/attention
category: ai
---

### Query, key, and value projections

Let $$x \in \mathbb{R}^{n_\text{seq} \times d_\text{model}}$$ represent the model's activations at a particular layer - each $$x_i \in \mathbb{R}^{d_\text{model}}$$ is the activation at token position $$i \in [n_{\text{seq}}]$$.

For each attention head $$h$$, we project each activation $$x_i$$ to corresponding query, key, and value vectors:

$$
\begin{align*}
q_i^{(h)} &= W_Q^{(h)} x_i, \quad k_i^{(h)} = W_K^{(h)} x_i, \quad v_i^{(h)} = W_V^{(h)} x_i.
\end{align*}
$$

These vectors $$q_i, k_i, v_i \in \mathbb{R}^{d_{\text{head}}}$$ live in a much lower-dimensional space than the original activations (i.e. $$d_{\text{head}} \ll d_{\text{model}}$$).
The linear maps $$W_Q^{(h)}, W_K^{(h)}, W_V^{(h)} \in \mathbb{R}^{d_{\text{head}} \times d_{\text{model}}}$$ are learned parameters.

Inuitively, we can think of the projections as follows:
- The query vector $$q_i^{(h)}$$ represents what information $$x_i$$ is *looking for*.
- The key vector $$k_i^{(h)}$$ represents what information $$x_i$$ *contains*.
- The value vector $$v_i^{(h)}$$ represents what information $$x_i$$ should *propagate*.

### Attention mechanism

The motivation behind the attention mechanism is to transfer information between token positions.

In order to determine which information should be transfered to activation $$x_i$$ at position $$i$$, we check to see which past activations $$\{ x_j \mid j \leq i \}$$ contain information that $$x_i$$ is looking for.

We can reformulate this using the language of query and key vectors: we check to see which past key vectors $$\{ k_j^{(h)} \mid j \leq i \}$$ are similar to the query vector $$q_i^{(h)}$$.

We compute the similarity between a query vector and key vector by simply taking their dot product:

$$
\begin{align*}
\text{score}_{ij}^{(h)} = \frac{q_i^{(h)} \cdot k_j^{(h)}}{\sqrt{d_{\text{head}}}}.
\end{align*}
$$

Note that we divide by $$\sqrt{d_{\text{head}}}$$ to ensure that the dot products don't grow with $$d_{\text{head}}$$.[^1] Larger dot products would cause the softmax function to saturate, resulting in [vanishing gradients](https://en.wikipedia.org/wiki/Vanishing_gradient_problem).

For causal attention, we set $$\text{score}_{ij}^{(h)} = -\infty$$ for all $$j > i$$. This effectively prevents future token positions from transferring information to past token positions.

We then apply a softmax function to the scores to obtain the attention weights:

$$
\text{attention}_{ij}^{(h)} = \text{softmax}(\text{score}_{ij}^{(h)}) = \frac{\exp(\text{score}_{ij}^{(h)})}{\sum_{k=1}^{n_{\text{seq}}} \exp(\text{score}_{ik}^{(h)})}
$$

Intuitively, $$\text{attention}_{ij}^{(h)}$$ describes how strongly information from token position $$j$$ should be transferred to token position $$i$$. We operationalize this by weighting each value vector $$v_{j}^{(h)}$$ by $$\text{attention}_{ij}^{(h)}$$:

$$
\begin{align*}
\text{weighted_value}_i^{(h)} = \sum_{j=1}^{n_{\text{seq}}} \text{attention}_{ij}^{(h)} v_j^{(h)}.
\end{align*}
$$

Finally, we map this vector $$\text{weighted_value}_i^{(h)} \in \mathbb{R}^{d_{\text{head}}}$$ back to the original dimension $$d_{\text{model}}$$:

$$
\begin{align*}
\text{attention_out}_i^{(h)} = W_O^{(h)} \text{weighted_value}_i^{(h)} + b_O^{(h)},
\end{align*}
$$

where $$W_O^{(h)} \in \mathbb{R}^{d_{\text{model}} \times d_{\text{head}}}$$ and $$b_O^{(h)} \in \mathbb{R}^{d_{\text{model}}}$$ are learned parameters.

### Multi-head attention

The above description focused on a single attention head $$h$$. In practice, we use multiple attention heads.

For each head $$h \in H$$, we compute the attention output $$\text{attention_out}_i^{(h)}$$ as described above.
We then sum the outputs across all heads:

$$
\begin{align*}
\text{multi_attention_out}_i = \sum_{h \in H} \text{attention_out}_i^{(h)}.
\end{align*}
$$

It is usually the case that $$d_{\text{model}} = d_{\text{head}} \cdot n_{\text{heads}}$$. For example, the original paper uses $$d_{\text{model}} = 512$$ with $$n_{\text{heads}} = 8$$ and $$d_{\text{head}} = 64$$.

<!-- ### Grouped-query attention -->

<!-- [TODO] -->

### Sources

- [Attention Is All You Need](https://arxiv.org/abs/1706.03762) - Vaswani et al., 2017
- [A Mathematical Framework for Transformer Circuits](https://transformer-circuits.pub/2021/framework/index.html) - Elhage et al., 2021
- [The Annotated Transformer](https://nlp.seas.harvard.edu/annotated-transformer/) - Huang et al., 2022
- [An Analogy for Understanding Transformers](https://www.lesswrong.com/posts/euam65XjigaCJQkcN) - Callum McDougall, 2023

### Footnotes
[^1]: If we assume $$q_i^{(h)}$$ and $$k_i^{(h)}$$ to be drawn from $$\mathcal{N}(0, 1)$$, then $$q_i^{(h)} \cdot k_i^{(h)}$$ has a mean of 0 and variance of $$d_{\text{head}}$$, whereas $$\frac{q_i^{(h)} \cdot k_i^{(h)}}{\sqrt{d_{\text{head}}}}$$ has a mean of 0 and variance of 1. This illustrates how scaling by $$\frac{1}{\sqrt{d_{\text{head}}}}$$ prevents the dot products from growing with $$d_{\text{head}}$$.