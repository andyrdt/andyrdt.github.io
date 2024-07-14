---
layout: note
title:  "Layer normalization"
permalink: /notes/layernorm
category: ai
---

### Layer normalization

Let $$\vec{x} \in \mathbb{R}^{n}$$ be an activation vector.

We first compute the mean $$\mu_{\vec{x}}$$ and variance $$\sigma_{\vec{x}}^2$$ of the activation vector as follows:

$$
\begin{align*}
\mu_{\vec{x}} &= \frac{1}{n} \sum_{i=1}^{n} x_i, \quad \sigma_{\vec{x}}^2 = \frac{1}{n} \sum_{i=1}^{n} (x_i - \mu_{\vec{x}})^2.
\end{align*}
$$

The $$\text{LayerNorm}$$ operation is then defined as follows:

$$
\begin{align*}
\text{LayerNorm}(\vec{x}) &= \vec{g} \odot \frac{\vec{x} - \mu_{\vec{x}}}{\sqrt{\sigma_{\vec{x}}^2 + \epsilon}} + \vec{b}
\end{align*}
$$

where $$\vec{g}, \vec{b} \in \mathbb{R}^{n}$$ are learnable parameters, $$\epsilon$$ is a small constant, and $$\odot$$ denotes the element-wise multiplication.

### Geometric interpretation

We can break down the $$\text{LayerNorm}$$ operation into three distinct steps.

**1. Mean-centering**

We first subtract the mean $$\mu_{\vec{x}}$$ from the activation vector $$\vec{x}$$:

$$
\begin{align*}
\vec{x}^{(1)} = \vec{x} - \mu_{\vec{x}}.
\end{align*}
$$

This can equivalently be thought of as projecting the activation vector onto the all-ones direction $$\hat{1}$$, and subtracting this component away:

$$
\begin{align*}
\vec{x}^{(1)} &= \vec{x} - \mu_{\vec{x}}\\
&= \vec{x} - \mu_{\vec{x}} \vec{1}\\
&= \vec{x} - \left(\frac{1}{n} \sum_{i=1}^{n} x_i \right) \vec{1}\\
&= \vec{x} - \left( \frac{1}{n} \vec{x} \cdot \vec{1} \right) \vec{1}\\
&= \vec{x} - \left( \vec{x} \cdot \frac{\vec{1}}{\sqrt{n}} \right) \frac{\vec{1}}{\sqrt{n}}\\
&= \vec{x} - \underbrace{\left( \vec{x} \cdot \hat{1} \right) \hat{1}}_{\text{proj}_{\hat{1}}(\vec{x})}.
\end{align*}
$$

Thus, mean-centering can be thought of as projecting the $$n$$-dimensional activation onto an $$(n-1)$$-dimensional subspace, namely the orthogonal complement of $$\hat{1}$$.

**2. Variance normalization**

After mean-centering, we normalize the variance of the activation vector:

$$
\begin{align*}
\vec{x}^{(2)} = \frac{\vec{x}^{(1)}}{\sqrt{\sigma_{\vec{x}}^2 + \epsilon}}.
\end{align*}
$$

Note that $$\epsilon$$ is a small constant ($$\approx 10^{-5}$$) to prevent division by zero, and to improve numerical stability.

Variance normalization can equivalently be thought of as projecting the activation onto the $$\sqrt{n}$$-radius sphere.

To see this, first note that the variance of the original activation vector $$\vec{x}$$ is equal to the variance of the mean-centered activation vector $$\vec{x}^{(1)}$$, since [variance is invariant under translation](https://en.wikipedia.org/wiki/Variance#Addition_and_multiplication_by_a_constant):

$$
\begin{align*}
\sigma_{\vec{x}}^2 = \sigma_{\vec{x}^{(1)}}^2.
\end{align*}
$$

Next, notice that the variance of a mean-centered vector can be expressed in terms of its squared norm:

$$
\begin{align*}
\sigma_{\vec{x}^{(1)}}^2 &= \frac{1}{n} \sum_{i=1}^{n} \left(x_i^{(1)} - \mu_{\vec{x}^{(1)}}\right)^2\\
&= \frac{1}{n} \sum_{i=1}^{n} \left(x_i^{(1)}\right)^2\\
&= \frac{1}{n} \left\lvert \left\lvert \vec{x}^{(1)} \right\rvert \right\rvert^2.
\end{align*}
$$

Putting things together:

$$
\begin{align*}
\vec{x}^{(2)} &= \frac{\vec{x}^{(1)}}{\sqrt{\sigma_{\vec{x}}^2 + \epsilon}}\\
&\approx \frac{\vec{x}^{(1)}}{\sqrt{\sigma_{\vec{x}}^2}}\\
&= \frac{\vec{x}^{(1)}}{\sqrt{\sigma_{\vec{x}^{(1)}}^2}}\\
&= \frac{\vec{x}^{(1)}}{\sqrt{\frac{1}{n} \left\lvert \left\lvert \vec{x}^{(1)} \right\rvert \right\rvert^2}}\\
&= \sqrt{n} \frac{\vec{x}^{(1)}}{\left\lvert \left\lvert \vec{x}^{(1)} \right\rvert \right\rvert}.
\end{align*}
$$

**3. Affine transformation**

Finally, we apply an affine transformation, scaling by a learned gain $$\vec{g} \in \mathbb{R}^{n}$$, and shifting by a learned bias vector $$\vec{b} \in \mathbb{R}^{n}$$:

$$
\begin{align*}
\vec{x}^{(3)} = \vec{g} \odot \vec{x}^{(2)} + \vec{b}.
\end{align*}
$$

### Root mean squared layer normalization

Root Mean Square Layer Normalization is a simplification of Layer Normalization that only performs variance normalization without centering the mean.

We first compute the *root mean square* of the activation vector as follows:

$$
\begin{align*}
\text{RMS}(\vec{x}) &= \sqrt{\frac{1}{n} \sum\nolimits_{i=1}^{n} x_i^2}.
\end{align*}
$$

The $$\text{RMSNorm}$$ operation is defined as follows:

$$
\begin{align*}
\text{RMSNorm}(\vec{x}) &= \vec{g} \odot \frac{\vec{x}}{\text{RMS}(\vec{x})} + \vec{b}.
\end{align*}
$$

### Sources

- [Layer Normalization](https://arxiv.org/abs/1607.06450) - Ba et al., 2016
- [Geometry and Dynamics of LayerNorm](https://arxiv.org/abs/2405.04134) - Paul Riechers, 2024
- [What is LayerNorm Folding?](https://github.com/TransformerLensOrg/TransformerLens/blob/main/further_comments.md#weight-processing) - Neel Nanda, 2022
- [Root Mean Square Layer Normalization](https://arxiv.org/abs/1910.07467) - Zhang et al., 2019