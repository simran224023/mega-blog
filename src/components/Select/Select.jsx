import React, { useId } from "react";
import styles from "./Select.module.css";

const Select = React.forwardRef(
  ({ 
    options, 
    label, 
    className = "", 
    variant = "default",
    size = "medium",
    error,
    ...props 
  }, ref) => {
    const id = useId();
    
    const selectClasses = [
      styles.select,
      styles[variant],
      styles[size],
      error && styles.error,
      className
    ].filter(Boolean).join(" ");

    return (
      <div className={styles.selectContainer}>
        {label && (
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
        )}
        <select ref={ref} {...props} id={id} className={selectClasses}>
          {options?.map((option, index) => (
            <option key={option.value || index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    );
  }
);

export default Select;