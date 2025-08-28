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

- I have some selects here for years, tags, speakers, and conferences. Plain Async Selects. They're actually created with this custom styling using Ariakit, handling the accessibility and interactions, like keyboard nav, click outside, focus, and viewport aware placement.
- Demo the filtering UX. We're having some weird loading states that flicker and are not in sync. Let's get to the code.

## AsyncSelect with useTransition and useOptimistic

- I'm in this AsyncSelect component.
- Typical interaction! Setting some loading state, optimistic update, doing an async operation, doing a side effect and an error rollback.
- Handling loading states this way is not ideal, because we have to manage the loading state manually, and it leads to flickering states.
- Because we have a shared loading state, and whichever async call finishes first overwrites the next state, leading to this premature loading state. User actions don't match the state. We would need request tracking and cancellation to ensure the most recent operations affects the final state, or disable the interaction entirely while its pending!
- Instead, let's replace the manual loading state with a transition here to simplify this pattern. Creating a lower priority, deferred state update. React 19 transitions can be async.
- We can use useTransition and wrap the state update and the async call, creating an Action.
- An action is a function called in a transition, meaning we have a specific term for this type of lower priority behavior.
- All the updates execute once the entire transition is done, keeping them in sync.
- See same interaction, less code and no UX errors.
- Remove optimistic update. Notice the problem, this is what we fixed. Let's replace it with useOptimistic.
- UseOptimistic let's us manage optimistic updates more easily, and works along side Actions. It takes in state to show when no action is pending, and update function, and the optimistic state and trigger.
- Within a transition, we can create a temporary optimistic update. This state shows for as long as it runs, and when its done, reverts to the passed value. Meaning if this passed value is updated, it can seamlessly transition to the new value.
- See how it work with a rejecting promise, temporary.
- Notice how our interaction is completely smooth, and we have a more robust optimistic update that works with the transition. Consider this pattern anytime you have a state update that is not immediately reflected in the UI, like a server call. Clean code.

## Review app

- So what is this app anyway? Open sidebar.
- This is actually a the Next.js App Router, Prisma ORM and an Prisma Postgres DB, Tailwind CSS.
- Zoom out to 110%.
- Go to page. We were just using the filters, let's actually add inn the actual functionality here.
- I'm in the nextjs app router so I am using server components to fetch data. Layout.tsx gets the active filters from the params, and the filter options based on all data in the database. We're getting the talks based on these filters directly in the server comp, and passing it down to a as a promise.
- Demo app: See talks, search, click talks.

## RouterSelect expose action

- Let's make the filters work! We want to be able to select a filter, and have the talks list update.
- Add search params. Add a param string with createParam. The way the nextjs router works, is the params don't update until the new page is ready. Now, we are tracking our transition state to the new page with the new params.
- The filters are already working.
- Let's rename this to RouterSelect since we want to reuse this functionality for a specific component. Typical reusable use case we encounter in nextjs app router.
- This is now a very useful select, but it is not very customizable. We want to be able to execute a custom action when the select is changed, like a toast, or a loading bar, or anything else.
- To make this component reusable and customizable, we want to expose a way to execute this synced outdate from the outside. What we can do is expose an action prop, a function called within the transition.
- We should await this so the parent can pass either sync or async here for max flexibility.
- Any UI comp can do this! Think about the new react 19 form. We have either onSubmit or action, depending on our needs. We can also do this with our own components! We can add either one or both if thats what we want!

## Filters use the action prop

- So we have our custom RouterSelect.
- Now we can actually add our custom behavior in any way we want, and the naming will tell us what to expect.
- I just have a bunch of random libraries I wanna try to demonstrate the possibilities. Let's enable the code here.
- Year: Customize loading bar: add loading bar, onSelect start progress. Add optimistic state and replace with action. We know that the optimistic is triggered right away, where the load complete is when the transition is complete. Hide spinner. Optimistic reducer function.
- Tag: Add simple toast like we wanted to with SelectAction. Update theme variable with this doc ref, this is a ref so its not waiting for the transition.
- Speaker: Set exploding, handle this with a timeout. Rather, optimistic exploding, handles its own reset state after transition completes. Optimistic update synced to the transition! We can call it without another transition here bc of the naming, just like a form action.
- Conference: We can also call async functions in the action, executed at the end, like a logger of what confs are selected. And a random server function. Maybe we can trigger this at some point.
- Let's move on for now, and start adding some view transitions!

## View transitions

- View transitions are coming to react! I don't have insider info but I'm pretty sure we'll see a lot of this at React Conf next month. And the reason it fits so well into this talk is because we need to know all these concurrent features to make the most out of view transitions.
- We already learned all the basics of this, so we are able to use it now.
- View transitions need to know a before and after state to animate, and for react, since this is not MPA, its just state, so we need to mark this UI transition somehow to animate it, using our concurrent features.
- View transitions need either a transition or a deferred value.
- Let's start simple and wrap the app with a app viewtrans component to enable the default crossfade. Navigations in nextjs are transitions, so this works out of the box with out filters.
- This is actually a anti-pattern, remove it so we can add more specific transitions.
- Let's see the TalksExplorer. The Talks client component has a search, is receiving the talks promise. Suspending with a fallback.
- Next, let's animate the grid entering the view.
- View trans have 4 triggers based on how a view trans component behaves in a transition: enter, exit, update, and share.
- Add enter exit on grid. Move key to transition. Default none.
- Triggered when viewtrans component is added and removed from the dom. This is custom animations that I've added to my css file like this.
- Exit on suspense! Animates down and the list goes up. Removed from the DOM. Default none.
- How about these list items, they are not animating. There is no transition or deffered update on this search.
- Usedefferedvalue can defer rendering a part of the UI and keep the important parts like this input reponsive.
- Now, you may know, from react 18, you could use it to avoid blocking input responsiveness by deferring the value until react is able to render it. It can also be used with async data fetching to improve UX and avoid jarring UI updates in something like a combobox.
- Let's mark the before after state with useDeferredValue! Add isStale indicator for the spinner!
- This is how react will know what is the before and after for the animation. Triggers an update.
- Add a lower down view trans to animate each item individually.
- How about this item detail. We need to wrap the state updates in a transition! Direct import since we don't need pending state or async.
- Let's add a view trans to the talk details on enter with a slide in.
- Two different components are in the view at separate times. To animate between them, we can use a shared element transition by adding a name.
- I'm really bad at animations and I was able to add all this! React handles all the possible edge cases, let's you declaratively define your view trans.

## Final demo

- Fullscreen view
- Let's see all of this in action! Full screen.
- Initial load suspense animation out and list in
- We have the filterable list with the filtering animation here using View Transitions and useDeferredValue
- We can click the items and have this named view transition connecting the two items
- We can execute the custom select components with a various set of side effects based on the transition behavior.
- And we can clear the filters with a smooth transition in and out.
- Let's try to trigger that random server function somehow. It's react universe 2025 right?

## Conclusion

That's it for this talk, the code is pinned on my GitHub and accessible through the QR code here, and follow me on my socials or reach out! Thanks for having me!
