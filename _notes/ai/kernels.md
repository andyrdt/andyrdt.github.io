---
layout: note
title:  "Kernels"
permalink: /notes/kernels
category: ai
---

### Linear regression setup

Consider a regression task.
We are given a training set $$\{(x^{(i)}, y^{(i)}) \}_{i=1}^n$$, where $$x^{(i)} \in \mathbb{R}^d$$ and $$y^{(i)} \in \mathbb{R}$$.

In vanilla linear regression, for a given input $$x = [x_1, x_2, \ldots, x_d]^T \in \mathbb{R}^d$$, we model the output as a linear combination of the features of $$x$$, where each feature $$x_i$$ is weighted by a parameter $$\theta_i$$:

$$
\begin{align*}
f(x; \theta) &= \theta_1 x_1 + \theta_2 x_2 + \ldots + \theta_d x_d \\
&= \theta^T x.
\end{align*}
$$

To quantify how well a model $$f(x; \theta)$$ fits the training data, we use mean squared error loss:

$$
\begin{align*}
\mathcal{L}(\theta) &= \frac{1}{n} \sum_{i=1}^n \ell(f(x^{(i)}; \theta), y^{(i)})\\
&= \frac{1}{n} \sum_{i=1}^n \frac{1}{2} \left( f(x^{(i)}; \theta) - y^{(i)} \right)^2\\
&= \frac{1}{n} \sum_{i=1}^n \frac{1}{2} \left(\theta^T x^{(i)} - y^{(i)} \right)^2.
\end{align*}
$$

We then find a parameterization $$\theta$$ that minimizes loss $$\mathcal{L}(\theta)$$.
This optimal parameterization $$\theta$$ can be computed in closed form using the normal equations, or found using gradient descent.

### Feature maps

Rather than fitting a linear model over the $$d$$-dimensional inputs, we can first transform the inputs to a higher-dimensional space using a "feature map", and then fit a linear model over these transformed inputs.
We can roughly think of a feature map as *enriching* the input - it extracts *additional features* of the input, which can then be used directly by the linear model for prediction.

Formally, a feature map is simply a function $$\phi : \mathbb{R}^d \to \mathbb{R}^k$$, where $$k$$ is the dimensionality of the "feature space".[^1]
We now model the output as a linear combination of the *features* computed by the feature map:

$$
\begin{align*}
f(x; \theta) &= \theta_1 \phi_1(x) + \theta_2 \phi_2(x) + \ldots + \theta_k \phi(x)_k \\
&= \theta^T \phi(x).
\end{align*}
$$

Our aim then becomes finding a parameterization $$\theta \in \mathbb{R}^k$$ such that the following loss is minimized:

$$
\begin{align*}
\mathcal{L}(\theta) &= \frac{1}{n} \sum_{i=1}^n \ell(f(x^{(i)}; \theta), y^{(i)})\\
&=\frac{1}{n} \sum_{i=1}^n \frac{1}{2} \left( f(x^{(i)}; \theta) - y^{(i)} \right)^2\\
&= \frac{1}{n} \sum_{i=1}^n \frac{1}{2} \left(\theta^T \phi(x^{(i)}) - y^{(i)} \right)^2.
\end{align*}
$$

Let's work through a gradient descent update step.
First we compute the gradient of the loss function with respect to $$\theta$$:

$$
\begin{align*}
\nabla_{\theta} \mathcal{L}(\theta) &= \nabla_{\theta} \frac{1}{n} \sum_{i=1}^n \frac{1}{2} \left( \theta^T \phi(x^{(i)}) - y^{(i)} \right)^2\\
&= \frac{1}{n} \sum_{i=1}^n \left( \theta^T \phi(x^{(i)}) - y^{(i)} \right) \phi(x^{(i)}).
\end{align*}
$$

The gradient descent update step is then:

$$
\begin{align*}
\theta &\leftarrow \theta - \eta \cdot \nabla_{\theta} \mathcal{L}(\theta) \\
&= \theta - \eta \cdot \frac{1}{n} \sum_{i=1}^n \left( \theta^T \phi(x^{(i)}) - y^{(i)} \right) \phi(x^{(i)}).
\end{align*}
$$

Notice that each update to $$\theta$$ is a linear combination of the transformed training samples $$\{\phi(x^{(i)}) \}$$.
If we initialize $$\theta_0 = 0$$, then after each update, $$\theta$$ will remain in the span of $$\{\phi(x^{(i)}) \}$$.
Thus, we can express $$\theta$$ as:

$$
\theta = \sum_{i=1}^n \alpha_i \phi(x^{(i)}),
$$

for some coefficients $$\alpha_i \in \mathbb{R}$$.

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
f(x^{(i)}; \theta) &= \theta^T \phi(x^{(i)}) \\
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

Substituting this back into the prediction function:

$$
\begin{align*}
f(x; \theta) &= \theta^T \phi(x) \\
&= \left( \sum_{i=1}^n \alpha_i \phi(x^{(i)}) \right)^T \phi(x) \\
&= \sum_{i=1}^n \alpha_i \phi(x^{(i)})^T \phi(x) \\
&= \sum_{i=1}^n \alpha_i \langle \phi(x^{(i)}), \phi(x) \rangle.
\end{align*}
$$

Examining this expression, we see that the prediction for a new input $$x$$ is a weighted sum of inner products between $$\phi(x)$$ and each of the training samples $$\phi(x^{(i)})$$.

We've reduced the problem of finding an optimal $$\theta \in \mathbb{R}^k$$ to finding optimal weight coefficients $$[ \alpha_1, \alpha_2, \ldots, \alpha_n ]^T =: \alpha \in \mathbb{R}^n$$.

<details class="collapsible" markdown="1">
<summary>Gradient descent update step for \(\alpha\)</summary>
<div class="content" markdown="1">

We can write the gradient descent update step for $$\alpha$$ in terms of inner products as well:

$$
\begin{align*}
\frac{\partial \mathcal{L}(\alpha)}{\partial \alpha_k} &= \frac{\partial}{\partial \alpha_k} \frac{1}{n} \sum_{i=1}^n \frac{1}{2} \left( \sum_{j=1}^n \alpha_j \langle \phi(x^{(j)}), \phi(x^{(i)}) \rangle - y^{(i)} \right)^2 \\
&= \frac{1}{n} \sum_{i=1}^n \left( \sum_{j=1}^n \alpha_j \langle \phi(x^{(j)}), \phi(x^{(i)}) \rangle - y^{(i)} \right) \langle \phi(x^{(k)}), \phi(x^{(i)}) \rangle.
\end{align*}
$$

$$
\begin{align*}
\alpha_k^{(t+1)} &\leftarrow \alpha_k^{(t)} - \eta \cdot \frac{\partial \mathcal{L}(\alpha^{(t)})}{\partial \alpha_k}\\
&= \alpha_k^{(t)} - \eta \cdot \frac{1}{n} \sum_{i=1}^n \left( \sum_{j=1}^n \alpha_j^{(t)} \langle \phi(x^{(j)}), \phi(x^{(i)}) \rangle - y^{(i)} \right) \langle \phi(x^{(k)}), \phi(x^{(i)}) \rangle.
\end{align*}
$$

</div>
</details>

### The kernel trick

As derived above, the prediction function can be expressed as a weighted sum of inner products between the transformed training samples and a new input:

$$
\begin{align*}
f(x; \theta) &= \sum_{i=1}^n \alpha_i \langle \phi(x^{(i)}), \phi(x) \rangle.
\end{align*}
$$

Computing these inner products naively would require mapping each input $$x^{(i)}$$ and $$x$$ into the high-dimensional feature space $$\mathbb{R}^k$$, which can be computationally expensive or infeasible when $$k$$ is very large or infinite.
Amazingly, for some particular feature maps, we can actually compute the inner products $$\langle \phi(x^{(i)}), \phi(x) \rangle$$ without ever explicitly computing $$\phi(x^{(i)})$$ or $$\phi(x)$$.

We can define a *kernel function* $$K: \mathbb{R}^d \times \mathbb{R}^d \to \mathbb{R}$$ that corresponds to the inner product in feature space:

$$
K(x, z) = \langle \phi(x), \phi(z) \rangle.
$$

Now we can rewrite the prediction function in terms of this kernel function:

$$
f(x; \theta) = \sum_{i=1}^n \alpha_i K(x^{(i)}, x).
$$

In this form, we no longer need to explicitly compute or store $$\phi(x)$$.
Instead, we compute $$K(x^{(i)}, x)$$ directly from $$x^{(i)}$$ and $$x$$, working only in the original input space $$\mathbb{R}^d$$.
This *kernel trick* allows us to effectively operate in high-dimensional feature space, without ever needing to explicitly map inputs to that high-dimensional feature space.

### Examples of kernel functions

Many commonly used kernels, such as the polynomial or Gaussian kernel, provide a way to compute the inner product $$\langle \phi(x), \phi(z) \rangle$$ directly in the input space (i.e. working in $$\mathbb{R}^d$$).
These kernels are efficient to compute, whereas explicitly constructing the corresponding feature map $$\phi$$ would often be computationally expensive or impossible, in particular when $$\phi$$ maps to a very high- or infinite-dimensional space.

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

Note that the effective number of features in the feature space is $${d+p \choose p}$$[^2].
Writing this out and fixing the degree $$p$$, we see that the effective dimensionality grows with $$\Omega(d^p)$$:

$$
\begin{align*}
{d+p \choose p} &= \frac{(d+p)!}{d! \cdot p!} \\
&= \frac{(d+p)(d+p-1) \cdots (d+1)}{p!} \\
&> \frac{d^p}{p!}.
\end{align*}
$$

By using the kernel trick for polynomials of degree $$p$$, we can effectively operate in a feature space of dimension $$\Omega(d^p)$$, while working only in the original input space $$\mathbb{R}^d$$.

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
A function $$K: \mathbb{R}^d \times \mathbb{R}^d \to \mathbb{R}$$ is a valid (Mercer) kernel if and only if for any finite set $$\{ x^{(1)}, \ldots, x^{(n)} \}$$, the corresponding kernel matrix $$\mathbf{K}$$ is symmetric positive semi-definite, where the kernel matrix is defined as $$\mathbf{K}_{ij} = K(x^{(i)}, x^{(j)})$$:

$$
\begin{align*}
\mathbf{K} &= \begin{bmatrix}
K(x^{(1)}, x^{(1)}) & \cdots & K(x^{(1)}, x^{(n)}) \\
\vdots & \ddots & \vdots \\
K(x^{(n)}, x^{(1)}) & \cdots & K(x^{(n)}, x^{(n)})
\end{bmatrix}.
\end{align*}
$$

</div>

### Neural tangent kernel (NTK)

Now let's consider the case where our model $$f(x; \theta): \mathbb{R}^{d} \rightarrow \mathbb{R}$$ is a very simple neural network with a single hidden layer, and a single-dimensional output:

$$
f(x; \theta) = W_{\text{out}} \sigma(W_{\text{in}} x + b_{\text{in}}),
$$

where $$W_{\text{in}} \in \mathbb{R}^{h \times d}$$, $$W_{\text{out}} \in \mathbb{R}^{1 \times h}$$, $$b_{\text{in}} \in \mathbb{R}^h$$, and $$\sigma$$ is an element-wise nonlinear activation function.
We use $$\theta$$ to denote a flattened vector of all parameters in the network.

Let's say the network is initialized with parameters $$\theta_0$$, and it is then trained via gradient descent to minimize empirical loss $$\mathcal{L}(\theta)$$.

Now, let's assume that the weights of the network don't shift too much during training, i.e. $$\theta \approx \theta_0$$.[^3]
In this regime, where the weights don't shift too much from their initial values, we can use a first-order Taylor expansion to approximate the prediction function:

$$
\begin{align*}
f(x; \theta) &\approx f(x; \theta_0) + (\theta - \theta_0)^T \nabla_{\theta} f(x; \theta_0).
\end{align*}
$$

We can rearrange this expression to group terms that are constant after initialization:

$$
\begin{align*}
f(x; \theta) &\approx f(x; \theta_0) + (\theta - \theta_0)^T \nabla_{\theta} f(x; \theta_0)\\
&= \underbrace{f(x; \theta_0) - \theta_0^T \nabla_{\theta} f(x; \theta_0)}_{\text{constant after initialization}} + \underbrace{\theta^T \nabla_{\theta} f(x; \theta_0)}_{\text{linear function of } \theta}.
\end{align*}
$$

Let's write $$c(x; \theta_0) := f(x; \theta_0) - \theta_0^T \nabla_{\theta} f(x; \theta_0)$$, and $$\phi(x; \theta) := \nabla_{\theta} f(x; \theta)$$:

$$
\begin{align*}
f(x; \theta) &\approx f(x; \theta_0) - \theta_0^T \nabla_{\theta} f(x; \theta_0) + \theta^T \nabla_{\theta} f(x; \theta_0)\\
&= c(x; \theta_0) + \theta^T \phi(x; \theta_0).
\end{align*}
$$

The $$\theta^T \phi(x; \theta_0)$$ term looks very familiar!
In this form, we can see clearly that the model is fitting a linear model in the feature space defined by $$\phi(x; \theta_0) = \nabla_{\theta} f(x; \theta_0)$$.

The corresponding kernel function is known as the **neural tangent kernel** (NTK):

$$
\begin{align*}
K(x, z; \theta) &= \langle \phi(x; \theta), \phi(z; \theta) \rangle \\
&= \langle \nabla_{\theta} f(x; \theta), \nabla_{\theta} f(z; \theta) \rangle.
\end{align*}
$$

Intuitively, the neural tangent kernel measures the similarity between two inputs $$x$$ and $$z$$ by measuring the similarity of their gradients with respect to parameters $$\theta$$.

### Training dynamics via NTK

Now let's consider how gradient descent updates the parameters $$\theta$$ during training.

In practice, gradient descent makes discrete updates to the parameters $$\theta$$, in the direction of $$- \nabla_{\theta} \mathcal{L}(\theta)$$:

$$
\begin{align*}
\theta^{(t+1)} &= \theta^{(t)} - \eta \nabla_{\theta} \mathcal{L}(\theta^{(t)}).
\end{align*}
$$

Rearranging, we get the following:

$$
\begin{align*}
\frac{\theta^{(t+1)} - \theta^{(t)}}{\eta} &=  - \nabla_{\theta} \mathcal{L}(\theta^{(t)}).
\end{align*}
$$

Taking the limit as the step size $$\eta \to 0$$, we can analyze how the parameters $$\theta$$ change with an *infinitesimally-small step size*.
This is known as the *gradient flow*, and we write it as $$\frac{d \theta}{dt}$$, thinking of it as the change in parameters with respect to continuous time during training:

$$
\begin{align*}
\frac{d \theta}{dt} &= - \nabla_{\theta} \mathcal{L}(\theta).
\end{align*}
$$

Now let's consider how the *function output* $$f(x; \theta)$$ changes with respect to time $$t$$ during training:

$$
\begin{align*}
\frac{d f(x; \theta)}{dt} &= \frac{d f(x; \theta)}{d \theta} \frac{d \theta}{dt} \\
&=  \nabla_{\theta} f(x; \theta)^T \left(- \nabla_{\theta} \mathcal{L}(\theta)\right) \\
&=  \nabla_{\theta} f(x; \theta)^T \left( -\frac{1}{n} \sum_{i=1}^n \nabla_{\theta} \mathcal{\ell}(f(x^{(i)}; \theta), y^{(i)}) \right) \\
&=  \nabla_{\theta} f(x; \theta)^T \left( - \frac{1}{n} \sum_{i=1}^n \nabla_{\theta} f(x^{(i)}; \theta) \nabla_{f} \ell(f(x^{(i)}; \theta), y^{(i)}) \right) \quad (\text{chain rule})\\
&= - \frac{1}{n} \sum_{i=1}^n \underbrace{\nabla_{\theta} f(x; \theta)^T \nabla_{\theta} f(x^{(i)}; \theta)}_{\text{neural tangent kernel: } K(x, x^{(i)}; \theta)} \nabla_{f} \ell(f(x^{(i)}; \theta), y^{(i)}) \\
&= - \frac{1}{n} \sum_{i=1}^n K(x, x^{(i)}; \theta) \nabla_{f} \ell(f(x^{(i)}; \theta), y^{(i)}).
\end{align*}
$$

Another sighting of the neural tangent kernel!

Let's simplify things further.
In our particular case, we're using mean squared error loss.
This allows us to simplify $$\nabla_{f} \ell(f(x^{(i)}; \theta), y^{(i)})$$:

$$
\begin{align*}
\nabla_{f} \ell(f(x^{(i)}; \theta), y^{(i)}) &= \frac{d}{df} \left( \frac{1}{2}(f(x^{(i)}; \theta) - y^{(i)})^2 \right)\\
&= f(x^{(i)}; \theta) - y^{(i)}.
\end{align*}
$$

Plugging this back into the expression for gradient flow, we get:

$$
\begin{align*}
\frac{d f(x; \theta)}{dt} &= - \frac{1}{n} \sum_{i=1}^n K(x, x^{(i)}; \theta) \nabla_{f} \ell(f(x; \theta), y^{(i)}) \\
&= - \frac{1}{n} \sum_{i=1}^n K(x, x^{(i)}; \theta) (f(x^{(i)}; \theta) - y^{(i)}).
\end{align*}
$$

What does this expression *mean*?

This expression describes how the model output $$f(x; \theta)$$ on some datapoint $$x$$ changes, in terms of its "similarity" to each datapoint $$x^{(i)}$$ (as measured by the neural tangent kernel) and the model's error $$(f(x^{(i)}; \theta) - y^{(i)})$$ on those datapoints.

To gain intuition, consider a simple example.
Let's say, for a given $$\theta^{(t)}$$, $$x$$ is very "similar" to training example $$x^{(1)}$$ and very "dissimilar" to all other training examples:

$$
\begin{align*}
K(x, x^{(1)}; \theta^{(t)}) &\approx 1 \\
K(x, x^{(j)}; \theta^{(t)}) &\approx 0 \quad \text{for all } j \neq 1.
\end{align*}
$$

Let's assume the model's prediction on $$x^{(1)}$$ is *too high*. Concretely, say $$f(x^{(1)}; \theta^{(t)}) - y^{(1)} \approx 10$$.

Plugging values into the expression:

$$
\begin{align*}
\frac{d f(x; \theta)}{dt} &= - \frac{1}{n} \sum_{i=1}^n K(x, x^{(i)}; \theta) \nabla_{f} \ell(f(x; \theta), y^{(i)}) \\
&= - \frac{1}{n} K(x, x^{(1)}; \theta) (f(x^{(1)}; \theta) - y^{(1)}) - \frac{1}{n} \sum_{j \neq 1} K(x, x^{(j)}; \theta) \nabla_{f} \ell(f(x; \theta), y^{(j)}) \\
&\approx - \frac{1}{n} (1) \cdot (10) - \frac{1}{n} \sum_{j \neq 1} (0) \cdot \nabla_{f} \ell(f(x^{(j)}; \theta), y^{(j)}) \\
&= -\frac{10}{n}.
\end{align*}
$$

Here, we can see concretely that the model will update towards *decreasing* its output on $$x$$.
Intuitively, this makes a lot of sense.
The model prediction was too high on $$x^{(1)}$$, and so the gradient update should push it down.
But since $$x$$ is "close" to $$x^{(1)}$$ (in neural tangent kernel feature space), the adjustment will propagate to $$x$$ as well, effectively lowering the prediction on $$x$$.

The neural tangent kernel $$K(x, z; \theta)$$ can thus be thought of as measuring how much a change in the output $$f(z; \theta)$$ impacts the output of $$f(x; \theta)$$.

### Sources

- [CS229 lecture notes](https://cs229.stanford.edu/summer2019/cs229-notes3.pdf) - Andrew Ng, 2019
- [Neural Tangent Kernel: Convergence and Generalization in Neural Networks](https://arxiv.org/abs/1806.07572) - Jacot et al., 2018
- [Lecture 7 - Deep Learning Foundations: Neural Tangent Kernels](https://www.youtube.com/watch?v=DObobAnELkU) - Soheil Feizi, 2020
- [Some Math behind Neural Tangent Kernel](https://lilianweng.github.io/posts/2022-09-08-ntk/) - Lilian Weng, 2022
- [Understanding the Neural Tangent Kernel](https://www.eigentales.com/NTK/) - Rajat Vadiraj Dwaraknath

### Footnotes
[^1]: It is usually the case that $$k \gg d$$: the dimensionality of the "feature space" is usually *much larger* than the dimensionality of the "input space". It is in these cases when the "kernel trick" becomes particularly useful, as we will see later.

[^2]: This can be shown by applying the ["stars and bars" theorem](https://en.wikipedia.org/wiki/Stars_and_bars_(combinatorics)). The number of monomials of degree exactly $$p$$ in $$d$$ variables can be thought of as the number of ways to distribute $$p$$ "stars" into $$d$$ "bins" (one bin per input feature), and this corresponds to $${p+d-1 \choose p}$$. For the number of monomials of degree *at most* $$p$$, we consider $$d+1$$ "bins" (one bin per input feature, plus one bin for unused degrees), and this corresponds to $${p+d \choose p}$$.

[^3]: If you're bothered by this assumption, you're right to be bothered. This assumption that weights remain close to their initial values is known as the "lazy regime". This assumption is valid in the limit as network width approaches $$\infty$$, and is a useful lens for analyzing networks theoretically. However, this assumption does not hold in practice for finite width networks. In practice, weights change more than a negligibly small amount, and networks empirically exhibit [*feature learning*](https://en.wikipedia.org/wiki/Feature_learning).