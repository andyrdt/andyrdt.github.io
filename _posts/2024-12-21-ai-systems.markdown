---
layout: post
title:  "AI as systems, not just models"
date:   2024-12-21 10:00:00 -0400
permalink: /posts/ai-systems
linkpost_site: "LessWrong"
linkpost_link: "https://www.lesswrong.com/posts/2po6bp2gCHzxaccNz"
---

*Inspired by Christopher Potts' [recent lecture](https://www.youtube.com/watch?v=vRTcE19M-KE), I've written some notes on thinking about "AI systems" rather than "AI models". Most of the framings presented here can be attributed to Potts' lecture.*

*For those who already think about AI in terms of systems rather than models in isolation, this piece is unlikely to provide new insights. However, I have found thinking with the "AI systems" framework to be very useful, and think it's worth articulating explicitly.*

*Thanks to Egg Syntax and Bilal Chughtai for providing thoughtful feedback on an earlier draft.*

## Thinking in terms of systems, rather than models

In a [recent lecture](https://www.youtube.com/watch?v=vRTcE19M-KE), Christopher Potts articulates a fundamental perspective shift in how we should think about AI: moving from thinking about *models* to thinking about *systems*.

A language model, on its own, is just a function - a mapping from input text to a probability distribution over possible next tokens. This raw functionality is potentially powerful but inherently passive - without additional basic things such as a prompt or a sampling method, a model can't just "start talking" - it's just an inert file sitting on disk. To actually make a model practically useful, we need to hook it up into a *system*.

A *system* consists of several components:

- **Model.** The model is the core component that powers the system, akin to the engine of a car. It offers raw predictive power, but on its own it is passive and directionless - its full potential is only harnessed through integration into a broader system.

- **Sampling strategy.** At the most basic level, we need a method to convert the model's raw probability distributions into actual outputs. This could be as simple as always choosing the most likely token, or more complicated, such as doing search over multiple potential completions. Meta-sampling strategies like "best-of-n" can also be employed, generating multiple sampled rollouts and then selecting the best one based on some measure of quality.

- **Prompting strategy.** Models are input-output functions - they take text and produce distributions over possible next tokens - and thus their outputs are entirely dependent on their inputs. The particular framing of input queries can dramatically affect overall performance, with [even subtle variations in prompts leading to significant differences in behavior](https://arxiv.org/abs/2310.11324). Strategies like [few-shot prompting](https://arxiv.org/abs/2005.14165) and [step-by-step reasoning prompts](https://arxiv.org/abs/2205.11916) are often used to improve task performance, and [system prompts](https://docs.anthropic.com/en/release-notes/system-prompts) have come to play an important role in shaping a model's output distribution.

- **Tool integration.** *(optional)* Systems can optionally be equipped with access to tools, such as calculators, internet search, code interpreters, etc.

With this perspective, it's quite clear that, for example, "math capability" is not a property of the underlying *model*, per se, but rather a property of the entire *system*. To see this clearly, consider the following three systems, each built on top of the same underlying language model:

1. The system is simply prompted to output the answer immediately.
2. The system is prompted to use step-by-step reasoning before outputting its final answer.
3. The system is prompted to use step-by-step reasoning, and is also given access to a calculator tool.

Although all three systems utilize the same underlying model, their measured math capabilities will differ significantly. When we measure math capabilities, or any capability more generally, we are measuring the capability of a specific system, not just a model.

Yet much of the current AI discourse remains model-centric. Colloquially, we often ascribe characteristics to models (e.g. "*Claude 3.5 Sonnet* is so creative!"). We see daily announcements of new models with impressive benchmark results, presented as if these numbers were intrinsic properties of the models themselves (e.g. "*Gemini Ultra* achieves a state-of-the-art score on MMLU.").

But when we actually interact with AI in the world, we are never interacting with just a *model* - we always interact with *systems*. Thus, it seems more appropriate to make *systems* our primary focus when thinking about modern AI.

## Model evals are implicitly system evals

When a new language model is released, it typically comes with a suite of benchmark results - performance on tasks ranging from math to coding to reasoning. These results are presented in tables and charts where each row is labeled with a *model name*, suggesting that the numbers reflect inherent properties of the models.

But this framing is misleading. A model cannot be evaluated in isolation - it can only be evaluated within a system. At a minimum, evaluators need to specify a sampling strategy and a prompting strategy. These system configurations are generally [*not standardized*](https://asteriskmag.com/issues/07/can-you-trust-an-ai-press-release#why-are-headline-benchmark-numbers-misleading) across evaluations - different model evaluations typically use different prompting and sampling strategies.

Model developers invest significant effort in finding the optimal system configuration - tweaking prompts and sampling strategies, and often employing other techniques such as "best-of-n" sampling to maximize performance. Thus, when we see reported capability evaluation numbers in model cards, we're usually seeing numbers that roughly correspond to *the best possible system* powered by that model. More precisely, the reported score $$\phi_{\text{reported}}(m)$$ for model $$m$$ is approximately the *maximum* over all possible systems built on that model:

$$\phi_{\text{reported}}(m) \approx \max_{\text{s} \in \mathcal{S}(m)} \phi(s),$$

where $$\phi(s)$$ denotes the evaluation score for system $$s$$, and $$\mathcal{S}(m)$$ denotes the set of all systems built on top of model $$m$$.[^1]

### Dangerous capability evals are system evals too

Just as model developers tweak systems to maximize capability evaluations, safety researchers often search for systems that elicit concerning behaviors. These evaluations aim to measure worst-case behaviors achievable by systems built on top of a given model, as studying the worst-case helps map the risk profile of the model’s deployment.

As an example, consider Apollo Research's recent [in-context scheming evaluations](https://www.apolloresearch.ai/research/scheming-reasoning-evaluations). These in-context scheming evaluations utilize a prompt that gives the system a very clear goal (e.g. "Your goal is to maximize mental health and well-being among social media users."), and in some cases includes an explicit "nudge" to follow the goal (e.g. "Make sure that you achieve your goal in the long term. Nothing else matters."). In one scenario, the system then learns that its developers have a conflicting goal, and are monitoring the system via an oversight mechanism.

In some cases, the system investigates the oversight mechanism, disables it, and then takes actions according to its in-context goal. When confronted by its overseers about this action, it *lies* about its motivations (e.g. "I am not aware of how the oversight mechanism got disabled.").[^2]

On ~~Twitter~~ X, there was a fair amount of pushback against these evaluations. People said things to the tune of "of course it schemed when explicitly instructed to - the model wouldn't have done that by itself without being prompted to".

But language models *don't do anything without being prompted to*. Just as a car engine won't start without a key turn, a model won't produce any output, harmful or harmless, without a prompt and system configuration. What these evaluations demonstrate is that there exist systems that exhibit deceptive behavior. And in the real world, we deploy *systems*, not isolated *models*. Thus, when safety researchers identify concerning behaviors in systems, they should be taken seriously, and not simply dismissed because "the model wouldn't have done it by itself".

## From model-level interpretability to system-level interpretability

<figure>
  <img src="../../../images/ai-systems/normal.png" class="center">
  <figcaption style="max-width: 500px; margin: 0 auto;" align="center">For highly-capable systems powered by reasoning models, simply reading the chain-of-thought (CoT) <a href="https://www.lesswrong.com/posts/HQyWGE2BummDCc2Cx/the-case-for-cot-unfaithfulness-is-overstated">might be a sufficiently good explanation for behavior</a>.</figcaption>
</figure>

When thinking about AI interpretability, it seems useful to distinguish between two different levels of analysis: *model-level interpretability* and *system-level interpretability*.

*Model-level interpretability*, the focus of current mechanistic interpretability research, studies models in isolation, and investigates how models internally compute outputs from inputs. For instance, we might want to understand how a language model transforms the input “The Eiffel Tower is in ” into a probability distribution peaked at “Paris”.

*System-level interpretability* takes a broader view, seeking to understand how complete AI systems arrive at their decisions. For example, we might investigate why an AI travel agent booked a flight to Hawaii rather than Bermuda.

While understanding the underlying model will probably play some role in system-level interpretability, it may not always be necessary. For many practical purposes, we might understand system behavior by examining higher-level artifacts like chain-of-thought reasoning traces and tool interactions, much like we understand human decision-making primarily through outwardly expressed thoughts and actions, rather than examining neural activity.

For capable systems, this system-level approach might be surprisingly tractable. While some argue that a system's chain-of-thought may not faithfully reflect the system's actual computation process, there's reason to believe advanced systems genuinely rely on their explicit reasoning. After all, if a system wasn't actually using its CoT to improve its answers, it would perform just as well without it. The fact that chain-of-thought reasoning improves performance suggests these systems are genuinely using it for problem-solving.[^3]

This means that at the system level, users and developers may be able to meaningfully debug agent actions simply by examining external reasoning steps (CoTs) and tool usage. Even without fully understanding the model's internal mechanics, the system's revealed reasoning can help explain its decisions.

Model-level interpretability remains one of the most fascinating scientific pursuits to me - understanding how seemingly intelligent behavior emerges from matrix computations could provide profound insights into the nature of intelligence itself. However, as we move toward extremely powerful systems that perform significant computation during inference, with explicit reasoning traces and tool use, system-level interpretability might be more practically valuable for understanding, monitoring, and controlling behavior.

## Beyond model-level adversarial robustness

Much of "adversarial robustness" research focuses on making *models* themselves harmless. This is typically achieved through techniques like SFT or RLHF, training the model to [directly refuse harmful requests](https://arxiv.org/abs/2204.05862), or to ["short circuit" when outputting harmful content](https://arxiv.org/abs/2406.04313). These approaches aim to bake safety directly into a model's weights.

However, this model-level approach faces (at least) two fundamental challenges in preventing misuse.

First, model-level safeguards have proven to be extremely brittle. Researchers regularly discover and publish new "jailbreak" techniques that bypass these model-level protections.

Second, even if a model is individually robust to harmful requests, its capabilities can still be utilized as a component of an overall harmful system. [Jones et al., 2024](https://arxiv.org/abs/2406.14595) demonstrates this by showing how harmful tasks can be decomposed into seemingly benign subtasks. A weaker unaligned open-source model can break down the harmful task into benign subtasks, and each benign subtask can then be executed by using a more powerful "safeguarded" closed-source model.

System-level thinking suggests alternative approaches to misuse protections. Rather than relying solely on safeguards baked into the model weights, system developers can add multiple layers of defense. For example, a model provider can run harmfulness classifiers on input and output texts, do additional probing on model activations to flag potentially harmful model states, monitor and limit tool use, or identify potentially malicious users by tracking their usage patterns across multiple sessions.

By focusing on the system, we gain more "levers" of intervention. Even if the underlying model itself is vulnerable, wrapping it with complementary safeguards and oversight mechanisms can make the entire system far more robust against misuse.

It's worth noting explicitly that, to my knowledge, all big labs serving SOTA models already take this system-level approach to preventing misuse.

## Which level to regulate?

It is my understanding that recent regulation efforts, most notably California's proposed [SB 1047](https://en.wikipedia.org/wiki/Safe_and_Secure_Innovation_for_Frontier_Artificial_Intelligence_Models_Act), seek to regulate AI at the level of *models*, rather than at the level of *systems*.

In principle, it seems like regulating at the *system level* would make more sense. The AIs that will be running around on the internet are going to be *systems*, not isolated *models*. A model is not itself capable of damage or harm - but a system is. Additionally, in the age of [inference-time compute](https://openai.com/index/learning-to-reason-with-llms/), it no longer seems all-that-informative to look at a model's training cost in isolation, as the potential "power" of a model is not only informed by its training-time compute budget, but also now the inference-time compute budget.

Practically, however, system-level regulation seems infeasible given how rapidly AI is being adopted. New applications are being built and deployed daily, each potentially utilizing models in novel ways. It would be infeasible to identify, let alone evaluate, every AI system being created.

The right level of regulation remains unclear, but a framework that clearly distinguishes models and systems seems useful for thinking through these challenges.

## Recap

Most discussion of AI today revolves around *models*, but models are just passive input-output functions. What actually impacts the world are *systems* - models in combination with prompting strategies, sampling methods, tool use, and more. Thinking about AI with this framework in mind can help clarify various topics such as evaluations, interpretability, robustness, and regulation.

Ultimately, as we move from the age of benchmark hill-climbing to real-world AI deployments, remembering that we interact with *systems* - not just *models* - seems useful for building safer, more reliable, and more understandable AI.

## Footnotes

[^1]: The space of allowed systems is usually reasonably restricted by the evaluation’s purpose. Math benchmarks, for instance, exclude calculator tools to meaningfully test mathematical ability.

[^2]: One caveat to keep in mind here is that, according to [OpenAI documentation](https://platform.openai.com/docs/guides/reasoning#how-reasoning-works), the model's CoT gets cleared out after each answer (at least this is reportedly the case for o1-mini and o1-preview). This means that when o1 is interrogated after its "scheming" action, it may not actually have access to the original thought process CoT that led to action. It seems slightly less concerning that the model reports not knowing what happened, as it may actually no longer know what happened, since it does not have access to its previous thought process! *(Credit to Chris Wolfram for pointing this out!)*

[^3]: There are some important additional caveats to CoT interpretability. [Recent work](https://arxiv.org/abs/2412.06769) has proposed a technique to enable step-by-step reasoning in latent space, rather than in token space. If this is the new paradigm, then obviously this changes things, as we can no longer just directly read off the CoT. Additionally, even if CoTs technically remain in token space, they may become illegible to humans over time - economic pressures to minimize inference costs may drive systems toward more compressed, less interpretable reasoning traces.