import React from "react";
import styles from "./Container.module.css";

const Container = ({ 
  children, 
  variant = "default",
  background = "default",
  padding = "medium",
  className = "",
  centerContent = false,
  flexDirection = null,
  spaceBetween = false,
  textCenter = false,
  fullHeight = false,
  shadow = false,
  rounded = "default",
  ...props
}) => {
  const containerClasses = [
    // Base container class
    variant === "fluid" ? styles.containerFluid :
    variant === "small" ? styles.containerSmall :
    variant === "large" ? styles.containerLarge :
    variant === "noPadding" ? styles.containerNoPadding :
    styles.container,
    
    // Background variants
    background !== "default" && styles[background],
    
    // Padding variants (only if not noPadding variant)
    variant !== "noPadding" && padding !== "medium" && styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`],
    
    // Layout utilities
    centerContent && styles.centerContent,
    flexDirection === "column" && styles.flexColumn,
    flexDirection === "row" && styles.flexRow,
    spaceBetween && styles.spaceBetween,
    textCenter && styles.textCenter,
    fullHeight && styles.fullHeight,
    
    // Visual utilities
    shadow === true && styles.shadow,
    shadow === "large" && styles.shadowLarge,
    rounded === "none" && styles.borderless,
    rounded === "large" && styles.roundedLarge,
    rounded === "xlarge" && styles.roundedXLarge,
    
    // Custom className
    className
  ].filter(Boolean).join(" ");

  return (
    <div className={containerClasses} {...props}>
      {children}
    </div>
  );
};

export default Container;