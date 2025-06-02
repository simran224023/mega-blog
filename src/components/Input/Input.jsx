import React, { useId } from "react";
import styles from "./Input.module.css";

const Input = React.forwardRef(function Input(
  { 
    label, 
    type = "text", 
    placeholder, 
    className = "", 
    variant = "default",
    size = "medium",
    error,
    required = false,
    ...props 
  },
  ref
) {
  const id = useId();
  
  const inputClasses = [
    styles.input,
    styles[variant],
    styles[size],
    error && styles.error,
    className
  ].filter(Boolean).join(" ");

  return (
    <div className={styles.inputContainer}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        ref={ref}
        className={inputClasses}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className={styles.errorText} role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;