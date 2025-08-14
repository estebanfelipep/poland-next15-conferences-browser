# DEMO STEPS

## Introduction

- Aurora, web dev, norway, consultant at Crayon Consulting in oslo
- Excited to speak here today, because i'll be teaching about modern react patterns: concurrent features, actions, and whats next.
- Handling async operations in UI components can be tricky, we might encounter flickering pending states, inefficient state updates, and unstable user interfaces.
- With React 18 we already got a lot of features to allow us to improve the UX and responsiveness of our apps. Now, coming in to 19, we have even more tools at our disposal, and new ways to combine them.
- These are the concurrent features we are going to explore today. useTransition, useOptimistic, and useDeferredValue. They are going to become increasingly more important with View Transitions coming to React, which we will also check out at the end!
- Who here has ever used useTransition?
- Who here has ever used useOptimistic?
- Who here has ever used useDeferredValue?
- Who has tried the canary release of View Transitions in React?
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

## AsyncSelect with useTransition and useOptimistic

- Let's move on to the filters, using this AsyncSelect.
- Using ariakit under the hood here to create beautiful custom accessible interactive selects
- Typical interaction! Setting some loading state, doing an async operation, doing a side effect and an error rollback.
- This could be any promise, including the one we just created for the select component.
- Let's say something else happens as a result of this promise, let's actually replace this with router push. The toast fires before the page has updated, meaning we have this out of sync update. Add a single param string.
- Let's replace the manual loading state with a transition here to simplify this pattern and fix the problem. React 19 transitions can be async. Creating a lower priority, deferred state update.
- We can use useTransition and wrap the state update and the async call, creating an Action.
- An action is a function called in a transition, meaning we have a specific term for this type of concurrent behavior.
- All the updates execute once the entire transition is done, keeping them in sync.
- Remove manual rollback. Notice the problem, this is what we fixed. Let's replace it with useOptimistic.
- UseOptimistic let's us manage optimistic updates more easily, and works along side Actions. It takes in state to show when no action is pending, and update function, and the optimistic state and trigger.
- Within a transition, we can create a temporary optimistic update. This state shows for as long as it runs, and when its done, reverts to the passed value. Meaning if this passed value is updated, it can seamlessly transition to the new value.

## RouterSelect expose action

- Let's rename this to RouterSelect since we want to reuse this functionality for a specific component. Typical reusable use case we encounter in nextjs app router.
- Replace with better param string to maintain existing params.
- To make this component reusable and customizable, we want to expose a way to execute this synced outdate from the outside. What we can do is expose an action prop, a function called within the transition.
- We should await this so the parent can pass either sync or async here for max flexibility.
- Any UI comp can do this! Think about the new react 19 form. We have either onSubmit or action, depending on our needs. We can also do this with our own components! We can add either one or both if thats what we want!
- Expose the hideSpinner to customize loading state.

## Filters use the action prop

- Now we can actually add our custom behavior in any way we want, and the naming will tell us what to expect.
- I just have a bunch of random libraries I wanna try to demonstrate the possibilities. I had to force install some of these!
- Customize loading bar: add loading bar, onSelect start progress, action end. We know that the onSelect is triggered right away, where the load complete is when the transition is complete.
- Add sparkle right away, add toast inside the action after complete.
- Optimistic exploding, handles its own reset state after transition completes. Optimistic update synced to the transition! We can call it without another transition here bc of the naming, just like a form action.
- OnSelect update document title, another regular example. We can also call async functions, like this select action random server function, that execute at the end. Maybe we can trigger this at some point.
- Let's move on for now!

## Active filters with useTransition

- We can now upgrade the interaction of this clear button with another transition!
- Add transition to router.push and get loading state.
- Showcase state, normal react event handling!

## Talks list with useDeferredValue

- Let's move on to the talks list here. I want to demonstrate the functionality of useDeferredValue to you. Now, you may know, from react 18, you could use it to avoid blocking input responsiveness by deferring the value until the user stops typing. This is still relevant! However it can also be used with async data fetching to improve UX.
- Let's replace this promise from the server with a simple data fetching function, that will be triggered on every rerender. It has a very simple cache implementation (showcase) so we can see it in action with use().
- Could be your useSuspenseQuery from apollo or tanstack, or any other suspense enabled data source.
- Notice when i search here, the suspense boundary is showing every time. Usedeferredvalue can be used to avoid this flickering by deferring the value until the component is actually ready!
- Add hook: usedeferred value takes in a value and returns a deferred version of it. It signalizes to react that this is a lower priority update, and we want to defer updating the UI until the deferred value is ready.
- Notice the suspense boundary is no longer flickering.
- Add isStale indicator for the spinner!
- We can build any sort of stable UI state, in this stale while revalidate pattern! I recently used it for a async combobox.
- Put back the passed promise.
- Comment out useDeferredValue, were gonna need this for our last part of the talk.

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

That's it for this talk, the code is pinned on my GitHub and accessible through the QR code here, and follow me on my socials or reach out! Thanks for having me!
