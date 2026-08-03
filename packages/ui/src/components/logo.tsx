import { type ComponentProps } from "solid-js"

export const Mark = (props: { class?: string }) => {
  return (
    <svg
      data-component="logo-mark"
      classList={{ [props.class ?? ""]: !!props.class }}
      viewBox="0 0 2000 2000"
      xmlns="http://www.w3.org/2000/svg"
    >
      <BrandMark />
    </svg>
  )
}

export const Splash = (props: Pick<ComponentProps<"svg">, "ref" | "class">) => {
  return (
    <svg
      ref={props.ref}
      data-component="logo-splash"
      classList={{ [props.class ?? ""]: !!props.class }}
      viewBox="0 0 2000 2000"
      xmlns="http://www.w3.org/2000/svg"
    >
      <BrandMark />
    </svg>
  )
}

function BrandMark() {
  return (
    <>
      <rect width="2000" height="2000" fill="#000" />
      <path
        fill="#fff"
        fill-rule="evenodd"
        d="M538 575h135l257 637H775l-49-127H485l-46 127H280L538 575Zm68 196-72 185h145l-73-185Z"
      />
      <path
        fill="#fff"
        d="M820 575h161l112 437 117-437h109l113 437 116-437h159l-179 637h-162l-103-357-98 357h-165L820 575Z"
      />
    </>
  )
}

export const Logo = (props: { class?: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 36" classList={{ [props.class ?? ""]: !!props.class }}>
      <text
        x="0"
        y="28"
        font-family="'Arial Black', 'Impact', 'Helvetica Neue', sans-serif"
        font-weight="900"
        font-size="32"
        letter-spacing="4"
        fill="var(--icon-base)"
      >
        AWMATE
      </text>
    </svg>
  )
}
