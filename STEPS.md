# DEMO STEPS

## Introduction

- Fullscreen view
- Aurora, web dev, norway, consultant at Crayon Consulting in oslo
- Excited to speak here today, because i'll be teaching about modern react patterns: concurrent rendering, actions, and whats next.
- Handling async operations in UI components can be tricky, we might encounter flickering pending states, inefficient state updates, and excess complexity.
- With React 18 we already got a lot of features to allow us to improve the UX and responsiveness of our apps. Now, in 19, we have even more tools at our disposal, and new ways to combine them.
- These are the concurrent features we are going to explore today. useTransition, useOptimistic, and useDeferredValue. They are going to become increasingly more important with View Transitions coming to React, which we will also check out at the end!
- Who here has ever used useTransition?
- Who here has ever used useOptimistic?
- Who here has ever used useDeferredValue?
- Who has tried the experimental release of View Transitions in React?
- Perfect! Let's begin, and dive deeper into these hooks. Click button.

## Setup

- I have some selects here for years, tags, speakers, and conferences. They're actually created with this custom styling using Ariakit, handling the accessibility and interactions, like keyboard nav, click outside, focus, and viewport aware placement.
- Demo the filtering UX. Selects feel stuck, i suppose async. We're having some weird loading states that flicker and are not in sync on multiple selection. Let's get to the code.

## Introduce starting point AsyncSelect

- The selects are created by this this AsyncSelect component.
- If we look at the code for these drop downs, we can see they're implemented in the most common way people write React code today. There's a select, which has an onSelect event. In that event, we post the values to the server, and then set the selected state. Finally, while the async work is in progress, we set a loading state to true. And we have a toast side effect.
- Looking at this code, we're able to see the cause of loading flicker. When we click an item, the code does sets loading to true.
- When we click another, because we have a shared loading state, whichever async call finishes first overwrites the next state, leading to this premature loading state, which is why we see a flicker. User actions don't match the state. We would need request tracking and cancellation to ensure the most recent operations affects the final state, or disable the interaction entirely while its pending!
- The fundamental issue here is that the browser does not natively support async events, and coordinating async work across events. What we need is a way to coordinate the loading state as multiple things are clicked, and at the end we show the result and complete the loading state all at once.

## AsyncSelect with useTransition

- Fortunately, React has a API for this: transitions. Transitions allow react to coordinate async requests in events and render. Let's see how we can use transitions here to create a better experience, with no flickering, and less code.
- Let's replace the manual loading state with a transition here to simplify this pattern. Creating a lower priority, deferred state update. React 19 allowed transitions to be async.
- We can use useTransition and wrap the state update and the async call, creating an Action.
- An action is a function called in a transition, meaning we have a specific term for this type of lower priority behavior.
- See same interaction, less code and no UX errors.
- All the updates execute once all the transitions are done, keeping them in sync.

## AsyncSelect with useOptimistic

- I also have the UX problem of the select values not updating until the async operation is done. The select is not reflecting the user action immediately, it feels "stuck".
- Let's try to add an optimistic update to this select value, so it reflects the user action immediately.
- Add the naive version outside the transition. This is not ideal, because if the async operation fails, we have to manually revert the state.
- And we get this weird flickering UI on the update and out of sync states again, because it's not synced to the transition.
- UseOptimistic let's us manage optimistic updates more easily, and works along side Actions. It takes in state to show when no action is pending, and update function, and the optimistic state and trigger. React will use the optimistic value until all of the transitions are complete. Which means if you click multiple times, we will use all of their optimistic values until all of the transitions complete in one batch.
- Within a transition, we can create a temporary optimistic update. This state shows for as long as the action runs, and when its done, settles to the passed value. seamlessly merge with the new value.
- See how it work with a rejecting promise, temporary.
- Notice how our interaction is completely smooth, and we have a more robust optimistic update that works with the transition.

## Review app

- So what is this app anyway? Open sidebar.
- This is actually a Next.js App Router app, Prisma ORM and an Prisma Postgres DB, Tailwind CSS.
- Zoom out to 110%.
- Go to page. We were just using the filters, let's actually add inn the actual functionality here.
- I'm in the nextjs app router so I am using server components to fetch data. Page.tsx gets the active filters from the params, and the filter options based on all data in the database. We're getting the talks based on these filters directly in the server comp, and passing it down to a as a promise.
- We're using async await here because we're in a server component, but if this was a client app, we could use use() instead, so these patterns are useful in either RSC or CSR.
- Demo app: See talks, search, click talks.

## RouterSelect expose action

- Let's make the selects filter! We want to be able to select a filter, and have the talks list update. Instead of using this dummy async function, let's actually update the URL and have the server fetch the new data.
- Add search params. Add a param string with createParam. The way the nextjs router works, is the params don't update until the new page is ready. Now, we are tracking our transition state to the new page with the new params.
- The filters are already working.
- Let's rename this to RouterSelect since we want to reuse this functionality for a specific component. Typical reusable use case we encounter in nextjs app router.
- This is now a very useful select, but it is not very customizable. We want to be able to execute custom behavior when the select is changed.
- To make this component reusable and customizable, we want to expose a way to execute this synced outdate from the outside. What we can do is expose an action prop, a function called within the transition.
- We should await this so the parent can pass either sync or async here for max flexibility.
- Think about the new react 19 form. We have either onSubmit or action, depending on our needs. We can also do this with our own components!
- We could even extract the whole routing logic out to make this a reusable async select again, but for this demo, lets keep it here.

## Filters use the action prop

- So in our select we are updating the router, but what happens if we want to add a toast or do more things in the action? Well, since react is coordinating the action for us, we can add anything to this action callback an it will be included in the transition automatically.
- The naming will tell us what to expect, that we know this is using a transition.
- I just have a bunch of random side effects I wanna try to demonstrate the possibilities.
- Year: Customize loading bar: Hide spinner. Set progress 100 state, synced to the transition. Add optimistic state and replace. We know that the optimistic is triggered right away, and the regular state is synced to the action. Optimistic reducer function, to coordinate any transition to this optimistic update. We can call it without another transition here bc of the naming, just like a form action.
- Tag: Add simple toast like we used to have to with SelectAction. Update theme variable with this doc ref, this is a ref so its not coordinated with the transition.
- Speaker: Set exploding, handle this with a timeout. Rather, optimistic exploding, handles its own reset state after transition completes. Optimistic update synced to the transition! Again, no additional transition needed.
- Conference: We can also call async functions in the action, executed at the end, like a logger of what confs are selected. And a random server function. Maybe we can trigger this at some point.
- Let's move on for now, and start adding some view transitions!

## View Transitions

- View transitions are coming to react! I don't have insider info but I'm pretty sure we'll see a lot of this at React Conf next month. And the reason it fits so well into this talk is because we need to know all these concurrent features to make the most out of view transitions.
- We already learned all the basics of this, so we are able to use it now.
- View transitions need a way to mark an animation, and that can be either suspense, a transition or a deferred value.
- For example, when a transition finishes, react will automatically animate the result of the transition to the new UI.

## Add View Transitions

- Let's start simple and wrap the app with a app viewtrans component to enable the default crossfade. NextJS is following the suspense-enabled router pattern from the React team, so every route navigation is wrapped in a transition. S this works out of the box with our filters.
- It adds a cross fade, but for many of these interactions we don't want that. so let's remove it from the whole page, and add it for specific parts we want to animate lower in the tree.
- Let's see the TalksExplorer. The Talks client component has a search, is receiving the talks promise. Suspending with a fallback.
- Let's animate the grid entering the view.
- View trans have 4 triggers based on how a view trans component behaves in a transition: enter DOM, exit DOM, update inside view trans, and shared element transition, which we will see later.
- As the talks grid streams in, we want to animate the suspense fallback to the content. Suspense triggers ViewTransitions, so we can wrap the Suspense in a ViewTransition.
- Add enter exit on grid. Move key to transition. But if you do this, it's going to opt-in the whole subtree, so what I typically do is something add a default none.
- Triggered when viewtrans component is added and removed from the DOM. This is custom animations that I've added to my css file like this.
- Note the exit, enter, and default props. This means when the fallback exits, and the content enters, it will animate. But since the default is "none" it wont crossfade any other update in the tree below, causing unexpected animations.
- Add Exit on suspense! Animates down and the list goes up. Removed from the DOM. Default none.
- How about this item detail, not animation. If we want animation, we need to wrap the state update in a transition.
- Our TalkCard has an action prop as well, let's switch to an action so we know it's in a transition already.
- When this transition finishes, react will automatically animate the result of the transition to the new UI.
- Let's add a view trans to the talk details on enter with a slide in.
- However, i see that two different related components are in the view at separate times. To animate between them, we can use a shared element transition by adding a name.
- The names need to be unique and the same. See animation.
- For shared element transitions, if the thing you're sharing is not visible in the before/after, react will fall back to a cross fade instead of things flying off screen. So when I scroll down to the bottom, click the last item - it will expand into it. But when I close it and go back to the list (which is at the top) that item is no longer visible on the screen so it just cross fades close. React automatically figures out what the right thing to do is!
- How about these list items, they are not animating. There is no transition or deferred update on this search.
- Usedefferedvalue can defer rendering a part of the UI and keep the important parts like this input responsive.
- Now, you may know, from react 18, you could use it to avoid blocking input responsiveness by deferring the value until react is able to render it. It can also be used with async data fetching to improve UX and avoid jarring UI updates in something like a combobox.
- Let's use useDeferredValue! React will automatically animate the result of the deferred update to the new UI. Add isStale indicator for the spinner! Now crossfade.
- Then add a lower down view trans to animate each item individually.
- Use chrome devtools to slow down the animations! Animation drawer.
- I'm really bad at animations and I was able to add all this! React handles all the possible edge cases, let's you declaratively define your view trans.

## Final demo

- Fullscreen view
- Let's see all of this in action! Full screen.
- Initial load suspense animation out and list in.
- We have the filterable list with the filtering animation here, using specific View Transitions and useDeferredValue. Unfilter.
- We can click the items and have this named view transition connecting the two items.
- We can execute the custom select components with a various set of side effects based on the transition behavior. Year, tag.
- And we can clear the filters with a smooth transition in and out.
- Speaker, conference. Clear.
- Let's try to trigger that random server function somehow. It's react universe 2025 right?

## Conclusion

That's it for this talk, the code is pinned on my GitHub and accessible through the QR code here, and follow me on my socials or reach out! Thanks for having me!
