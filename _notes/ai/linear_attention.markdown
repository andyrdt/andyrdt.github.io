---
layout: note
title:  "Linear attention"
permalink: /notes/linear_attention
category: ai
---

### The problem with attention

Let's start with a review of standard multi-head attention.
For a single layer and head, we compute $$Q, K, V \in \mathbb{R}^{n_{\text{seq}} \times d_{\text{head}}}$$:

$$
Q = 
\begin{bmatrix}
— & q_1^T & — \\
 & \vdots &  \\
— & q_{n_{\text{seq}}}^T & — \\
\end{bmatrix}, \quad
K = 
\begin{bmatrix}
— & k_1^T & — \\
 & \vdots &  \\
— & k_{n_{\text{seq}}}^T & — \\
\end{bmatrix}, \quad
V = 
\begin{bmatrix}
— & v_1^T & — \\
 & \vdots &  \\
— & v_{n_{\text{seq}}}^T & — \\
\end{bmatrix}.
$$

We can then compute the output as:

$$
O = \text{softmax}(QK^T \odot M ) V,
$$

where $$M \in \mathbb{R}^{n_{\text{seq}} \times n_{\text{seq}}}$$ is the causal mask.[^1]

The big issue with vanilla attention is that it is quadratic in sequence length.
The computational complexity (number of floating point operations) of the matrix multiplication $$QK^T$$ is $$O(n_{\text{seq}}^2 \cdot d_{\text{head}})$$, which is quadratic in the sequence length.
And the memory complexity of storing $$QK^T$$ is $$O(n_{\text{seq}}^2)$$, which is also quadratic in the sequence length.[^2]
This becomes problematic when $$n_{\text{seq}}$$ is large (e.g., think about what happens when sequence length is 1 million tokens).

<details class="collapsible" markdown="1">
<summary>A refresher on the computational complexity of matrix multiplication.</summary>
<div class="content" markdown="1">

Suppose we have two matrices $$A \in \mathbb{R}^{m \times n}$$ and $$B \in \mathbb{R}^{n \times k}$$.

The resulting matrix $$C = AB \in \mathbb{R}^{m \times k}$$ has $$m \cdot k$$ entries.
Each entry $$c_{ij}$$ can be computed as the dot product of the $$i^{\text{th}}$$ row of $$A$$ and the $$j^{\text{th}}$$ column of $$B$$, which consists of $$n$$ multiplications and $$n-1$$ additions.

Thus, the complexity of the matrix multiplication is $$O(m \cdot n \cdot k)$$ floating point operations.

</div>
</details>

### Linear attention

Let's consider the standard attention formulation[^3], but without the softmax operation:

$$
O = (QK^T)V.
$$

Without the softmax operation, attention becomes a linear operation - it's just a bunch of matrix multiplications.
This means that we take advantage of the associative property of matrix multiplication, and write:

$$
O = Q (K^T V).
$$

With this order of operations, the complexity is no longer quadratic in sequence length.
The matrix $$K^T V \in \mathbb{R}^{d_{\text{head}} \times d_{\text{head}}}$$ can be computed using $$O(d_{\text{head}}^2 \cdot n_{\text{seq}})$$ FLOPs, and $$Q (K^T V) \in \mathbb{R}^{n_{\text{seq}} \times d_{\text{head}}}$$ can also be computed using $$O(d_{\text{head}}^2 \cdot n_{\text{seq}})$$ FLOPs.
So the total complexity is $$O(d_{\text{head}}^2 \cdot n_{\text{seq}})$$, which is linear in the sequence length.

One thing we've conveniently ignored is the causal mask $$M \in \mathbb{R}^{n_{\text{seq}} \times n_{\text{seq}}}$$.
When we write linear attention with the causal mask, associativity no longer helps us, as we must apply an element-wise masking operation to the attention scores:

$$
O = (QK^T \odot M) V.
$$

In this parallel view (i.e., when we compute the output for all token positions at once), the causal mask therefore prevents us from computing the output with linear dependence on the sequence length, and we are still stuck with quadratic dependence on the sequence length.
We will see, though, that in the recurrent view (i.e., when we compute one token at a time), linear attention is very nice.
Luckily, there is a way to balance between the two views via something called the *chunkwise parallel form of linear attention*, which we'll describe later.


### The recurrent view

As we've written it above, linear attention can be viewed as a parallel computation - the output is computed for all token positions at once via matrix multiplications.

But with linear attention, it's useful to think about it as a recurrent computation - as some computation that is performed sequentially, one token position at a time (as in autoregressive inference).
In this recurrent view, we think of the $$K^T V \in \mathbb{R}^{d_{\text{head}} \times d_{\text{head}}}$$ as a *memory* matrix, that is built up as we read the sequence.

First, we note that $$K^T V$$ can be written as a sum of outer products:

$$
K^T V = \sum_{i=1}^{n_{\text{seq}}} k_i v_i^T.
$$

With this view, we can think of the *memory* matrix being updated with a single key-value pair $$(k_i, v_i)$$ for each token position $$i$$.

Let's now define $$S_t$$ to be the *memory* matrix at time $$t$$ (e.g., up to and including token position $$t$$):

$$
S_t = \sum_{i=1}^{t} k_i v_i^T.
$$

It is easy to define a recurrence relation for $$S_t$$:

$$
S_{t} = S_{t-1} + k_{t} v_{t}^T.
$$

That's basically all there is to it.
With the recurrent view, we maintain a constant-size memory matrix $$S_t$$ that gets updated with a new key-value pair at each time step.
Note that, once the memory matrix has been built up, additional tokens can be generated with constant time complexity ($$O(d_{\text{head}}^2)$$) and constant memory complexity (also $$O(d_{\text{head}}^2)$$), without dependence on the sequence length.

### Chunkwise parallel form of linear attention

As we've seen so far, when viewed as recurrent computation, linear attention is very nice; however, when viewed as parallel computation, we still have quadratic dependence on sequence length (due to the causal mask).

*Chunkwise parallel form* is a way to balance between the two views, and to make parallel computation not entirely quadratic in sequence length.

The idea is to break up the sequence into chunks, each of length $$n_{\text{chunk}}$$.
Within each chunk ("intra-chunk"), we use the parallel view and use quadratic attention, incurring a cost of $$O(n_{\text{chunk}}^2 \cdot d_{\text{head}})$$.
Between chunks ("inter-chunk"), we use the recurrent view and use linear attention, incurring a cost of $$O(d_{\text{head}}^2 \cdot n_{\text{chunk}})$$.

Let's first split the input sequence of length $$n_{\text{seq}}$$ into $$\frac{n_{\text{seq}}}{n_{\text{chunk}}}$$ non-overlapping chunks.
We'll use subscript $$[\cdot]$$ to denote chunk-level quantities.
For chunk $$i$$, we have:
- $$Q_{[i]}, K_{[i]}, V_{[i]} \in \mathbb{R}^{n_{\text{chunk}} \times d_{\text{head}}}$$: query, key, and value vectors for chunk $$i$$,
- $$S_{[i]} \in \mathbb{R}^{d_{\text{head}} \times d_{\text{head}}}$$: memory matrix after processing chunks $$0, 1, \ldots, i-1$$.

**Inter-chunk memory matrix recurrence**

For the inter-chunk recurrence, we compute the current chunk's memory matrix from the previous chunk's memory matrix:

$$
S_{[i]} = S_{[i-1]} + K_{[i-1]}^T V_{[i-1]},
$$

where $$K_{[i-1]}^T V_{[i-1]} = \sum_{j \in \text{chunk } i-1} k_j v_j^T$$ is the sum of outer products for all tokens in chunk $$i-1$$.

**Computing the output for a chunk**

For each chunk $$i$$, we compute the output as:

$$
O_{[i]} = \underbrace{Q_{[i]} S_{[i]}}_{\text{inter-chunk}} + \underbrace{(Q_{[i]} K_{[i]}^T \odot M) V_{[i]}}_{\text{intra-chunk}},
$$

where $$M \in \mathbb{R}^{n_{\text{chunk}} \times n_{\text{chunk}}}$$ is the causal mask applied within the chunk.

The first term (inter-chunk) allows each token in chunk $$i$$ to attend to all tokens in previous chunks via the memory matrix $$S_{[i]}$$.
The second term (intra-chunk) allows each token to attend to previous tokens within the same chunk using standard attention.

**Complexity of chunkwise parallel form**

Let's analyze the complexity for processing a single chunk:

- Inter-chunk memory matrix recurrence computation: we're multiplying a $$d_{\text{head}} \times n_{\text{chunk}}$$ matrix by a $$n_{\text{chunk}} \times d_{\text{head}}$$ matrix, for a total cost of $$O(n_{\text{chunk}} \cdot d_{\text{head}}^2)$$.
- Computing the output for a chunk:
  - Inter-chunk output: we're multiplying a $$n_{\text{chunk}} \times d_{\text{head}}$$ matrix by a $$d_{\text{head}} \times d_{\text{head}}$$ matrix, for a total cost of $$O(n_{\text{chunk}} \cdot d_{\text{head}}^2)$$.
  - Intra-chunk output: this is the standard quadratic attention computation, which is $$O(n_{\text{chunk}}^2 \cdot d_{\text{head}})$$.

The total complexity per chunk is therefore $$O(n_{\text{chunk}}^2 \cdot d_{\text{head}} + n_{\text{chunk}} \cdot d_{\text{head}}^2)$$.

For the entire sequence with $$\frac{n_{\text{seq}}}{n_{\text{chunk}}}$$ chunks, the total complexity is:

$$
O\left(\frac{n_{\text{seq}}}{n_{\text{chunk}}} (n_{\text{chunk}}^2 \cdot d_{\text{head}} + n_{\text{chunk}} \cdot d_{\text{head}}^2)\right) = O(n_{\text{seq}} \cdot n_{\text{chunk}} \cdot d_{\text{head}} + n_{\text{seq}} \cdot d_{\text{head}}^2).
$$

The chunk size $$n_{\text{chunk}}$$ is effectively a knob to control the tradeoff between parallelism and recurrence:
- When $$n_{\text{chunk}} = n_{\text{seq}}$$, we have the fully parallel form (quadratic complexity, maximally parallel);
- When $$n_{\text{chunk}} = 1$$, we have the fully recurrent form (linear complexity, maximally sequential);
- Intermediate values balance parallelism and complexity.


### Gated delta networks

The gated delta network is a variant of linear attention that makes two additions: (1) a decay gate, and (2) a delta rule.

**Decay gate**

The intuition behind the decay gate is to gradually forget old information as we move forward in the sequence.
This can be implemented by multiplying the memory matrix by a (data-dependent) decay factor $$\alpha_t \in (0, 1)$$:

$$
S_t = \alpha_t S_{t-1} + k_t v_t^T.
$$

**Delta rule**

The intuition behind the delta rule is this: when we update the memory matrix with some key-value pair $$(k_t, v_t)$$, there may already be some conflicting information corresponding to the same key $$k_t$$.
In addition to naively adding $$k_t v_t^T$$ to the memory matrix, we can "clear out" the old information, and update the entry to correspond to a mix of the old and new information.
Notice that we can retrieve the old conflicting value by searching our memory with key $$k_t$$: $$(v_t^{\text{old}})^T = k_t^T S_{t-1}$$.
We can then update the memory matrix to clear out the old information, and then update the entry to correspond to a mix of the old and new information:

$$
\begin{align*}
S_t
&= S_{t-1}
\;\;\underbrace{-\,k_t (v_t^{\text{old}})^T}_{\text{delete old key-value}}
\;+\;
\underbrace{k_t\!\left(\beta_t v_t + (1-\beta_t)\,v_t^{\text{old}}\right)^T}_{\text{write new (blended) key-value}} \\
&= S_{t-1} - k_t k_t^T S_{t-1} + k_t(\beta_t v_t^T + (1 - \beta_t) k_t^TS_{t-1}) \\
&= (I - \beta_t k_t k_t^T) S_{t-1} + \beta_t k_t v_t^T,
\end{align*}
$$

where $$\beta_t \in (0, 1)$$ is a (data-dependent) "writing strength".

**Putting them together**

The gated delta network basically just combines the decay gate and the delta rule.

Putting them together, we have:

$$
S_t = (\alpha_t(I - \beta_t k_t k_t^T)) S_{t-1} + \beta_t k_t v_t^T,
$$

where $$\alpha_t \in (0, 1)$$ is a data-dependent decay factor, and $$\beta_t \in (0, 1)$$ is a data-dependent writing strength.

### Sources

- [Transformers are RNNs: Fast Autoregressive Transformers with Linear Attention](https://proceedings.mlr.press/v119/katharopoulos20a.html) - Katharopoulos et al., 2020
- [Gated Linear Attention Transformers with Hardware-Efficient Training](https://arxiv.org/abs/2312.06635) - Yang et al., 2023
- [Gated Delta Networks: Improving Mamba2 with Delta Rule](https://arxiv.org/abs/2412.06464) - Yang et al., 2024
- [DeltaNet Explained (Part I)](https://sustcsonglin.github.io/blog/2024/deltanet-1/) - Songlin Yang, 2024
- [Linear Transformers Are Secretly Fast Weight Programmers](https://arxiv.org/abs/2102.11174) - Schlag et al., 2021
- [FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness](https://arxiv.org/abs/2205.14135) - Dao et al., 2022

### Footnotes

[^1]: Note that we omit the $$\frac{1}{\sqrt{d_{\text{head}}}}$$ scaling factor for simplicity.
[^2]: Note that some hardware-aware implementations of attention, such as [FlashAttention](https://arxiv.org/abs/2205.14135), can effectively compute attention without materializing the full $$QK^T \in \mathbb{R}^{n_{\text{seq}} \times n_{\text{seq}}}$$ matrix.
[^3]: We'll temporarily ignore the causal mask $$M$$, but will return to it later. It turns out to be very important.