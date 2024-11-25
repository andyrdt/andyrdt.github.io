---
layout: note
title:  "Kernels"
permalink: /notes/kernels
category: ai
---

### Linear regression setup

Consider a regression task.
We are given a training set $$\{(x^{(i)}, y^{(i)}) \}_{i=1}^n$$, where $$x^{(i)} \in \mathbb{R}^d$$ and $$y^{(i)} \in \mathbb{R}$$.

In vanilla linear regression, we find a parameter vector $$\theta \in \mathbb{R}^d$$ such that $$y^{(i)} \approx \theta^{T} x^{(i)}$$ for all $$i \in [n]$$ by minimizing the mean squared error loss:


$$
\begin{align*}
\theta^* &= \min_{\theta \in \mathbb{R}^d}L(\theta)\\
&= \min_{\theta \in \mathbb{R}^d} \frac{1}{n} \sum_{i=1}^n \frac{1}{2} \left(\theta^T x^{(i)} - y^{(i)} \right)^2.
\end{align*}
$$

### Feature maps

Rather than fitting a linear model over the $$d$$-dimensional inputs, we can first transform the inputs to a higher-dimensional space using a *feature map*, and then fit a linear model over the transformed inputs.

Define a feature map $$\phi : \mathbb{R}^d \to \mathbb{R}^k$$, with $$k \gg d$$.
Our aim then becomes finding a parameter vector $$\theta \in \mathbb{R}^k$$ such that $$y^{(i)} \approx \theta^T \phi(x^{(i)})$$ for all $$i \in [n]$$ by minimizing the mean squared error loss:

$$
\begin{align*}
\theta^* &= \min_{\theta \in \mathbb{R}^k} L(\theta)\\
&= \min_{\theta \in \mathbb{R}^k} \frac{1}{n} \sum_{i=1}^n \frac{1}{2} \left( \theta^T \phi(x^{(i)}) - y^{(i)} \right)^2.
\end{align*}
$$

Let's work through a gradient descent update step.
First we compute the gradient of the loss function with respect to $$\theta$$:

$$
\begin{align*}
\nabla_{\theta} L(\theta) &= \nabla_{\theta} \frac{1}{n} \sum_{i=1}^n \frac{1}{2} \left( \theta^T \phi(x^{(i)}) - y^{(i)} \right)^2\\
&= \frac{1}{n} \sum_{i=1}^n \left( \theta^T \phi(x^{(i)}) - y^{(i)} \right) \phi(x^{(i)}).
\end{align*}
$$

The gradient descent update step is then:

$$
\begin{align*}
\theta &\leftarrow \theta - \eta \nabla_{\theta} L(\theta) \\
&= \theta - \eta \frac{1}{n} \sum_{i=1}^n \left( \theta^T \phi(x^{(i)}) - y^{(i)} \right) \phi(x^{(i)}).
\end{align*}
$$

Notice that each update to $$\theta$$ is a linear combination of the transformed training samples $$\{\phi(x^{(i)}) \}$$.
If we initialize $$\theta_0 = 0$$, then after each update, $$\theta$$ will remain in the span of $$\{\phi(x^{(i)}) \}$$.
Thus, we can express $$\theta$$ as:

$$
\theta = \sum_{i=1}^n \alpha_i \phi(x^{(i)}),
$$

for some coefficients $$\alpha_i \in \mathbb{R}$$.

Substituting this back into the prediction function:

$$
\begin{align*}
\hat{y}(x) &= \theta^T \phi(x) \\
&= \left( \sum_{i=1}^n \alpha_i \phi(x^{(i)}) \right)^T \phi(x) \\
&= \sum_{i=1}^n \alpha_i \phi(x^{(i)})^T \phi(x) \\
&= \sum_{i=1}^n \alpha_i \langle \phi(x^{(i)}), \phi(x) \rangle.
\end{align*}
$$

Examining this expression, we see that the prediction for a new input $$x$$ is a weighted sum of inner products between $$\phi(x)$$ and each of the training samples $$\phi(x^{(i)})$$.

We've reduced the problem of finding an optimal $$\theta \in \mathbb{R}^k$$ to finding optimal weight coefficients $$[ \alpha_1, \alpha_2, \ldots, \alpha_n ]^T =: \alpha \in \mathbb{R}^n$$.

<details class="collapsible" markdown="1">
<summary>What if \(\theta_0 \neq 0\)?</summary>
<div class="content" markdown="1">

Even without initializing $$\theta_0 = 0$$, we can assume that there exists an optimal $$\theta$$ that lies in the span of $$\{\phi(x^{(i)}) \}$$.

Let's decompose $$\theta$$ into components parallel and orthogonal to the span of $$\{\phi(x^{(i)}) \}$$:

$$
\theta = \theta_{\parallel} + \theta_{\perp}.
$$

The component $$\theta_{\perp}$$ does not affect the predictions on the training data:

$$
\begin{align*}
\hat{y}(x^{(i)}) &= \theta^T \phi(x^{(i)}) \\
&= (\theta^T_{\parallel} + \theta^T_{\perp}) \phi(x^{(i)}) \\
&= \theta^T_{\parallel} \phi(x^{(i)}) + \theta^T_{\perp} \phi(x^{(i)}) \\
&= \theta^T_{\parallel} \phi(x^{(i)}) \quad \text{since } \theta^T_{\perp} \phi(x^{(i)}) = 0 \text{ for all } i \in [n].
\end{align*}
$$

Thus, any component $$\theta_{\perp}$$ orthogonal to the span of $$\{\phi(x^{(i)}) \}$$ does not influence the loss:

$$
L(\theta) = L(\theta_{\parallel}).
$$

Therefore, we can, without loss of generality, assume that an optimal $$\theta$$ has $$\theta_{\perp} = 0$$ and express $$\theta$$ as:

$$
\theta = \sum_{i=1}^n \alpha_i \phi(x^{(i)}).
$$

</div>
</details>

### The kernel trick

Above, we noted that the prediction function can be expressed as a weighted sum of inner products between $$\phi(x)$$ and each of the training samples $$\phi(x^{(i)})$$.
The "kernel trick" refers to the observation that we can actually compute the inner product in the transformed space $$\langle \phi(x^{(i)}), \phi(x) \rangle$$ without explicitly computing the feature map $$\phi(x)$$, or working in the high-dimensional space $$\mathbb{R}^k$$.
Instead, we use a *kernel function* $$k: \mathbb{R}^d \times \mathbb{R}^d \to \mathbb{R}$$ that directly computes the inner product in the transformed space:

$$
K(x, z) = \langle \phi(x), \phi(z) \rangle.
$$

Now we can rewrite the prediction function in terms of the kernel function:

$$
\hat{y}(x) = \sum_{i=1}^n \alpha_i K(x^{(i)}, x).
$$

Before using the kernel trick, we would have needed to convert all $$x_i \in \mathbb{R}^d$$ to $$\phi(x_i) \in \mathbb{R}^k$$, as well as $$x$$ to $$\phi(x) \in \mathbb{R}^k$$, and compute all inner products in $$\mathbb{R}^k$$.
For very large $$k$$, this can be extremely computationally expensive.

For many common choices of $$\phi$$, there exist more efficient ways to compute the kernel function $$K$$ than computing the feature map $$\phi$$ and then computing the inner product.

<details class="collapsible" markdown="1">
<summary>Example: the polynomial kernel</summary>
<div class="content" markdown="1">

The **polynomial kernel** of degree $$p$$ is defined as follows:

$$
K(x, z) = (x^T z + 1)^p.
$$

Suppose we have $$x = [x_1, x_2]^T \in \mathbb{R}^2$$, and we would like to consider all monomials up to degree $$p = 2$$.
The corresponding feature map $$\phi(x)$$ would look something like $$\phi(x) = [1, x_1, x_2, x_1^2, x_2^2, x_1 x_2]^T$$.

For this case, there's a trick to compute the inner product in this transformed space without explicitly computing $$\phi(x)$$:

$$
K(x, z) = (x^T z + 1)^2.
$$

We can check explicitly that this formula gives the same result as computing the inner product in the transformed space:

$$
\begin{align*}
K(x, z) &= (x^T z + 1)^2 \\
&= (x_1 z_1 + x_2 z_2 + 1)^2 \\
&= 1 + 2 x_1 z_1 + 2 x_2 z_2 + x_1^2 z_1^2 + x_2^2 z_2^2 + 2 x_1 x_2 z_1 z_2 \\
&= \langle [1, \sqrt{2} x_1, \sqrt{2} x_2, x_1^2, x_2^2, \sqrt{2} x_1 x_2]^T, [1, \sqrt{2} z_1, \sqrt{2} z_2, z_1^2, z_2^2, \sqrt{2} z_1 z_2]^T \rangle.
\end{align*}
$$

We can see that the simple kernel function $$K(x, z) = (x^T z + 1)^2$$ is equivalent to computing the inner product for the feature map $$\phi(x) = [1, \sqrt{2} x_1, \sqrt{2} x_2, x_1^2, x_2^2, \sqrt{2} x_1 x_2]^T$$.

More generally, we can use the following formula to consider all monomials up to degree $$p$$:

$$
K(x, z) = \left( x^T z + 1 \right)^p.
$$

</div>
</details>

<details class="collapsible" markdown="1">
<summary>Example: the Gaussian kernel</summary>
<div class="content" markdown="1">

The **Gaussian kernel**, also known as the **radial basis function (RBF) kernel**, is defined as follows:

$$
K(x, z) = \exp\left(-\frac{\|x - z\|_2^2}{2\sigma^2}\right),
$$

where $$\sigma > 0$$ is the "bandwidth" parameter, controlling the "sharpness" of the kernel.

Notice that the kernel computes the "similarity" between two points $$x$$ and $$z$$ based on their Euclidean distance.
If two points $$x$$ and $$z$$ are geometrically close, then $$\|x - z\|_2^2$$ is small, and $$K(x, z)$$ is close to 1.
If two points are far apart, then $$\|x - z\|_2^2$$ is large, and $$K(x, z)$$ is close to 0.
When used for prediction, the Gaussian kernel yields a sort of "local" prediction - points that are close to $$x$$ will have a stronger influence on the prediction for $$x$$ than points that are far away.

Also note that the feature map corresponding to the Gaussian kernel is *infinite dimensional*, and therefore cannot be computed exactly without the kernel trick.

</div>
</details>

### Mercer's theorem

A kernel function $$K$$ is only valid if it corresponds to the inner product in some feature space.
It turns out that there is a simple condition that is necessary and sufficient for a function to be a valid kernel.
The condition is given by Mercer's theorem.

<div class="theorem" markdown="1" text="Mercer's theorem">
Let $$K: \mathbb{R}^d \times \mathbb{R}^d \to \mathbb{R}$$ be given.
Then for $$K$$ to be a valid (Mercer) kernel, it is necessary and sufficient that for any $$\{ x^{(1)}, \ldots, x^{(n)} \}$$, the corresponding kernel matrix is symmetric positive semi-definite, where the kernel matrix is defined as

$$
\begin{align*}
K &= \begin{pmatrix}
K(x^{(1)}, x^{(1)}) & \cdots & K(x^{(1)}, x^{(n)}) \\
\vdots & \ddots & \vdots \\
K(x^{(n)}, x^{(1)}) & \cdots & K(x^{(n)}, x^{(n)})
\end{pmatrix}.
\end{align*}
$$

</div>


### Sources

[CS229 lecture notes](https://cs229.stanford.edu/summer2019/cs229-notes3.pdf) - Andrew Ng, 2019