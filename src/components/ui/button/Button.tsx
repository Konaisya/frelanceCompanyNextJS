import { ButtonHTMLAttributes, FC, ReactNode } from "react"
import classes from "./Button.module.css"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
}

const Button: FC<ButtonProps> = ({ children, ...props }) => {


  return (
    <button {...props} className={classes.btn}>
      {children}
    </button>
  )
}

export default Button
