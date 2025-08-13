# DEMO STEPS

## Introduction

- Aurora, web dev, norway, consultant at Crayon Consulting in oslo
- Excited to speak here today, because i'll be teaching about modern react patterns: concurrent features, actions, and whats next.
- Handling async operations in UI components can be tricky—flickering pending states, inefficient state updates, and unstable interfaces are common issues. Modern React patterns address these challenges through concurrent rendering and React 19 Actions, offering more predictable async workflows and reusable patterns.
- With React 18 and concurrent mode we already got a lot of ways to improve the user experience and responsiveness of our apps. Now, coming in to 19, we have even more tools at our disposal, and new ways to combine them.
- These are the concurrent features we are going to explore today. useTransition, useOptimistic, and useDeferredValue . They are going to become increasingly more important with View Transitions coming to React, which we will also check out at the end!
- Who here has ever used useTransition?
- Who here has ever used useOptimistic?
- Who here has ever used useDeferredValue?
- Perfect! Let's begin, and dive deeper into these hooks. Click button.

## Setup and starting point

- This is a conference explorer app! Some of this is just made up data, maybe you can find your next conference idea here.
- The setup is the Next.js App Router, Prisma ORM and an Prisma Postgres DB, Tailwind CSS. But, don't worry, we are focusing on client side React today.
- Demo app: Click talks, filter talks, filters that don't work yet.

## Go through the code

- I'm in the nextjs app router so I am using server components to fetch data. Layout.tsx gets the active filters from the params, and the filter options based on all data in the database. We're getting the talks based on these filters directly in the server comp, and passing it down to a client component as a promise.
- We have the filters themselves, then the Talks are reiving the talks promise.
- Passing this promise through to the talks list.

## Add Suspense

- Let's just refresh some server component knowledge and wrap this client component in a suspense to provide a loading state while this promise resolved.
- Then, we can read it with use() to suspend the component while it resolves.
- Now we unblocked the page and we have a nice loading state. We'll come back and enhance this later.

## RouterSelect with useTransition and useOptimistic

- Let's move on to the filters, using this AsyncSelect.

## Active filters with useTransition

- We can now upgrade the interaction of this clear button with another transition!
- Add transition to router.push and get loading state.

## Talks list with useDeferredValue

## View transitions

- View transitions are coming to react! I don't have insider info but I'm pretty sure we'll see a lot of this at React Conf next month. And the reason it fits so well into this talk is because we need to know all these features to make the most out of view transitions.
- View transitions need to know a before and after state to animate, and for react, this is not MPA, its just state, so we need to mark this UI transition to animate it, using our concurrent features.
- In nextjs we can enable it here to opt in to the canary view transitions.
- Let's start simple and wrap the app with a global viewtrans component to enable the default crossfade.
- They have 4 triggers based on how a view trans component behaves in a transition: enter, exit, update, and share.
- Next, let's animate this suspense boundary and the list entering the view. Enter Exit on list. Triggered when viewtrans component is added and removed from the dom. This is custom animations that I've added to my css file like this. Add key to trigger this on every filter change!
- Exit on suspense! Animates down and the list goes up. Removed from the DOM.
- How about these list items, they are doing default crossfade. Let's mark the before after state with useDeferredValue! This is how react will know what is the before and after for the animation. Triggers an update. Add viewtrans around the items, and see the filtering!
- Remove deferred value and see its gone, because react doesn't know before after anymore.
- How about this item detail. Let's add an enter with a slide in. However, maybe we can do something better.
- Two different components are in the view at separate times. To animate between them, we can use a shared element transition by adding a name.
- I'm really bad at animations and I was able to add all this! React handles all the possible edge cases.

## Final demo

- Let's see all of this in action!
- Initial load suspense animation out and list in
- We have the filterable list with the filtering animation here using View Transitions and useDeferredValue
- We can click the items and have this named view transition connecting the two items
- We can execute the custom select components with a various set of side effects based on the transition behavior
- And we can clear the filters with a smooth transition in and out
- Let's try to trigger that random server function somehow. It's react universe 2025 right?

## Conclusion

That's it for this talk, the code is pinned on my GitHub and accessible through the QR code here, and follow me on my socials! Thanks for having me!
