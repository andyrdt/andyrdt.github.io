---
layout: note
title:  "Concentration inequalities"
permalink: /notes/concentration_inequalities
category: probability
---

Concentration inequalities quantify how a random variable $$X$$ *concentrates*, or equivalently *deviates*, around its mean $$\mu$$.
These concentration inequalities usually take the form

$$
\Pr[|X - \mu| \geq t] \leq (\text{a function decreasing in } t).
$$

The specific function on the right-hand side depends on the assumptions made about $$X$$. For example:
- [**Markov's inequality**](#markovs-inequality) makes minimal assumptions about $$X$$ (only that it is non-negative) and yields a bound that decays as $$O\left(\frac{1}{t}\right)$$.
- [**Chebyshev's inequality**](#chebyshevs-inequality) assumes $$X$$ has finite mean $$\mu$$ and variance $$\sigma^2$$, yielding a bound that decays as $$O\left(\frac{1}{t^2}\right)$$.
- [**Chernoff's inequality**](#chernoffs-inequality) further assumes that $$X$$ is the sum of independent random variables, and yields a very tight bound that decay *exponentially* with increasing $$t$$.

### Markov's inequality

<div class="theorem" markdown="1" text="Markov's inequality">
Let $$X$$ be a non-negative random variable.
Then, for any $$t > 0$$, we have

$$
\begin{align*}
\Pr[X \geq t] & \leq \frac{\mathbb{E}[X]}{t}.
\end{align*}
$$

</div>

<div class="proof" markdown="1">
Fix $$t > 0$$.
We can write any real number $$x$$ as

$$
x = \unicode{x1D7D9}_{x<t}x + \unicode{x1D7D9}_{x \geq t}x.
$$

Now consider $$\mathbb{E}[X]$$:

$$
\begin{align*}
\mathbb{E}[X] & = \mathbb{E}\left[\unicode{x1D7D9}_{X<t}X + \unicode{x1D7D9}_{X \geq t}X\right] \\
&= \mathbb{E}\left[\unicode{x1D7D9}_{X<t}X\right] + \mathbb{E}\left[\unicode{x1D7D9}_{X \geq t}X\right] \\
& \geq \mathbb{E}\left[\unicode{x1D7D9}_{X \geq t}X\right] \quad (\text{since } X \text{ non-negative})  \\
& \geq \mathbb{E}\left[\unicode{x1D7D9}_{X \geq t}t\right] \\
& = t \cdot \mathbb{E}[\unicode{x1D7D9}_{X \geq t}] \\
& = t \cdot \Pr[X \geq t].
\end{align*}
$$

Dividing both sides by $$t$$ gives the desired result.
</div>

### Chebyshev's inequality


<div class="theorem" markdown="1" text="Chebyshev's inequality">
Let $$X$$ be a random variable with mean $$\mu$$ and variance $$\sigma^2$$.
Then, for any $$t > 0$$, we have

$$
\Pr\left[|X - \mu| \geq t\right] \leq \frac{\sigma^2}{t^2}.
$$

</div>

<div class="proof" markdown="1">

$$
\begin{align*}
\Pr\left[|X - \mu| \geq t\right] & = \Pr\left[(X - \mu)^2 \geq t^2\right] \\
& \leq \frac{\mathbb{E}[(X - \mu)^2]}{t^2} \quad (\text{Markov's inequality}) \\
& = \frac{\sigma^2}{t^2}.
\end{align*}
$$

</div>

### Chernoff's inequality

<div class="theorem" markdown="1" text="Chernoff's inequality">

Let $$X_i$$ be independent Bernoulli random variables with parameters $$p_i$$.
Consider their sum $$S_N = \sum_{i=1}^N X_i$$, and denote its mean by $$\mu = \mathbb{E}[S_N]$$.
Then, for any $$t > \mu$$, we have

$$
\Pr[S_N \geq t] \leq e^{-\mu}\left(\frac{e\mu}{t}\right)^t.
$$

</div>

<div class="proof" markdown="1">
The proof follows what is known as the "MGF method".
This method generally begins by writing the original inequality, multiplying both sides by a parameter $$\lambda > 0$$, exponentiating both sides, and then applying Markov's inequality:

$$
\begin{align*}
\Pr[S_N \geq t] & = \Pr\left[e^{\lambda S_N} \geq e^{\lambda t}\right] \\
& \leq \frac{\mathbb{E}\left[e^{\lambda S_N}\right]}{e^{\lambda t}} \quad (\text{Markov's inequality}) \\
& = e^{-\lambda t} \mathbb{E}\left[e^{\lambda \sum_{i=1}^{n} X_i}\right] \\
& = e^{-\lambda t} \mathbb{E}\left[\prod_{i=1}^n e^{\lambda X_i}\right] \\
& = e^{-\lambda t} \prod_{i=1}^n\mathbb{E}\left[e^{\lambda X_i}\right] \quad (X_i \text{ are independent}).
\end{align*}
$$

Note that each term inside the product, $$\mathbb{E}\left[e^{\lambda X_i}\right]$$, is the *moment generating function* (MGF) of $$X_i$$.
The problem now reduces to bounding these MGFs.
Recall that $$X_i$$ is a Bernoulli random variable with parameter $$p_i$$.
Thus, we can bound each MGF as follows:

$$
\begin{align*}
\mathbb{E}\left[e^{\lambda X_i}\right] & = p(X_i=1) \cdot e^{\lambda (1)} + p(X_i=0) \cdot e^{\lambda (0)} \\
&= p_i e^{\lambda} + (1-p_i) \\
&= 1 + (e^{\lambda} - 1)p_i \\
&\leq e^{(e^{\lambda} - 1)p_i} \quad (1 + x \leq e^x \text{ for all } x \in \mathbb{R}).
\end{align*}
$$

Substituting this back into our previous inequality, we get

$$
\begin{align*}
\Pr[S_N \geq t] &\leq e^{-\lambda t} \prod_{i=1}^n\mathbb{E}\left[e^{\lambda X_i}\right] \\
&\leq e^{-\lambda t} \prod_{i=1}^n e^{(e^{\lambda} - 1)p_i} \\
&= e^{-\lambda t} e^{\sum_{i=1}^n (e^{\lambda} - 1) p_i} \\
&= e^{-\lambda t} e^{(e^{\lambda} - 1) \sum_{i=1}^n p_i} \\
&= e^{-\lambda t} e^{(e^{\lambda} - 1) \mu}.
\end{align*}
$$

Recall that $$\lambda > 0$$ is an arbitrary parameter.
We can find the optimal $$\lambda$$ that minimizes the right-hand side by differentiating with respect to $$\lambda$$ and setting the derivative to zero:

$$
\begin{align*}
\frac{d}{d\lambda} \left( e^{-\lambda t + (e^{\lambda} - 1) \mu} \right) &= 0 \\
\iff \left( e^{-\lambda t + (e^{\lambda} - 1) \mu} \right) \left( - t + \mu e^\lambda \right) &= 0 \\
\iff - t + \mu e^\lambda &= 0 \\
\iff e^\lambda &= \frac{t}{\mu} \\
\iff \lambda &= \ln\left(\frac{t}{\mu}\right).
\end{align*}
$$

Substituting this optimal $$\lambda$$ back into our previous inequality, we get

$$
\begin{align*}
\Pr[S_N \geq t] &\leq e^{-\lambda t} e^{(e^{\lambda} - 1) \mu} \\
& = e^{-\ln\left(\frac{t}{\mu}\right) t} e^{\left(\frac{t}{\mu} - 1\right) \mu} \\
& = \left(\frac{t}{\mu}\right)^{-t} e^{t -\mu}\\
& = \left(\frac{\mu}{t}\right)^{t} e^{t} e^{-\mu}\\
& = \left(\frac{e \mu}{t}\right)^{t} e^{- \mu}.
\end{align*}
$$

</div>

<div class="corollary" markdown="1" text="Relative Chernoff inequality">

Let $$X_i$$ be independent Bernoulli random variables with parameters $$p_i$$.
Consider their sum $$S_N = \sum_{i=1}^N X_i$$, and denote its mean by $$\mu = \mathbb{E}[S_N]$$.
Then, for any $$\delta > 0$$, we have

$$
\Pr\left[ S_N \geq (1 + \delta) \mu \right] \leq \exp\left( - \frac{ \delta^2 \mu }{ 2 + \delta } \right).
$$

</div>

<div class="proof" markdown="1">

Let $$t = (1 + \delta) \mu$$.
Plugging into Chernoff's inequality, we get

$$
\begin{align*}
\Pr\left[ S_N \geq (1 + \delta) \mu \right] & \leq e^{-\mu} \left( \frac{e\mu}{(1 + \delta)\mu} \right)^{(1 + \delta)\mu} \\
& = e^{-\mu} \left( \frac{e}{1 + \delta} \right)^{(1 + \delta)\mu} \\
&= e^{ - \mu + (1 + \delta) \mu \ln\left( \dfrac{ e }{ 1 + \delta } \right) } \\
&= \exp\left( - \mu + (1 + \delta) \mu \left( 1 - \ln(1 + \delta) \right) \right) \\
&= \exp\left( - \mu + (1 + \delta) \mu - (1 + \delta) \mu \ln(1 + \delta) \right) \\
&= \exp\left( \delta \mu - (1 + \delta) \mu \ln(1 + \delta) \right) \\
&= \exp\left(- \mu \phi(\delta)\right) \quad (\text{letting } \phi(\delta) := (1 + \delta) \ln(1 + \delta) - \delta) \\
&\leq \exp\left( - \frac{ \delta^2 \mu }{ 2 + \delta } \right) \quad (\text{since } \phi(\delta) \geq \frac{ \delta^2 }{ 2 + \delta }).
\end{align*}
$$

It remains to show that $$\phi(\delta) \geq \frac{ \delta^2 }{ 2 + \delta }$$ for all $$\delta > 0$$.

<details class="collapsible" markdown="1">
<summary>Expand to see details.</summary>
<div class="content" markdown="1">

Define $$f(\delta) := \phi(\delta) - \frac{ \delta^2 }{ 2 + \delta } = (1 + \delta) \ln(1 + \delta) - \delta - \frac{ \delta^2 }{ 2 + \delta }$$.
It suffices to show that $$f(\delta) \geq 0$$ for all $$\delta > 0$$.

First, note that $$f(0) = (1 + 0) \ln(1 + 0) - 0 - \frac{0^2}{2 + 0} = 0$$.

Next, we compute the derivative $$f'(\delta)$$:

$$
\begin{align*}
f'(\delta) &= (1) \ln(1 + \delta) + (1+\delta)\frac{1}{1 + \delta} - 1 - \frac{ (2+ \delta) (2\delta) - (\delta^2)(1)}{ (2 + \delta)^2 } \\
& = \ln(1 + \delta)  - \frac{ 4\delta + \delta^2 }{ (2 + \delta)^2 }.
\end{align*}
$$

Next, we compute the second derivative $$f''(\delta)$$:

$$
\begin{align*}
f''(\delta) &= \frac{1}{1 + \delta} - \frac{(2+\delta)^2(4 + 2\delta) - (4\delta + \delta^2)(4 + 2\delta)}{(2+\delta)^4} \\
&= \frac{1}{1 + \delta} - \frac{2(2+\delta)^3 - 2(4\delta + \delta^2)(2 + \delta)}{(2+\delta)^4} \\
&= \frac{1}{1 + \delta} - \frac{2(2+\delta)^2 - 2(4\delta + \delta^2)}{(2+\delta)^3} \\
&= \frac{1}{1 + \delta} - \frac{8 + 8\delta + 2\delta^2 - 8\delta - 2\delta^2}{(2+\delta)^3} \\
&= \frac{1}{1 + \delta} - \frac{8}{(2+\delta)^3}.
\end{align*}
$$

We want to show that $$\frac{1}{1 + \delta} - \frac{8}{(2+\delta)^3} \geq 0$$:

$$
\begin{align*}
\frac{1}{1 + \delta} - \frac{8}{(2+\delta)^3} &\geq 0 \\
\iff \frac{1}{1 + \delta} &\geq \frac{8}{(2+\delta)^3} \\
\iff (2 + \delta)^3 &\geq 8(1+\delta) \\
\iff (8 + 12\delta + 6\delta^2 + \delta^3) &\geq 8 + 8\delta \\
\iff (8 + 12\delta + 6\delta^2 + \delta^3) - (8 + 8 \delta) &\geq 0\\
\iff 4\delta + 6\delta^2 + \delta^3 &\geq 0.
\end{align*}
$$

The last inequality is clearly true for all $$\delta > 0$$.
Thus, $$f''(\delta) \geq 0$$ for all $$\delta > 0$$.

From $$f(0) = 0$$, $$f'(0) = 0$$, and $$f''(\delta) \geq 0$$, it follows that $$f(\delta) \geq 0$$ for all $$\delta > 0$$.
Thus, $$\phi(\delta) \geq \frac{ \delta^2 }{ 2 + \delta }$$ for all $$\delta > 0$$.

</div>
</details>

This concludes the proof.

</div>
### Sources
- [High-Dimensional Probability: An Introduction with Applications in Data Science](https://www.math.uci.edu/~rvershyn/papers/HDP-book/HDP-book.html) - Roman Vershynin, 2018