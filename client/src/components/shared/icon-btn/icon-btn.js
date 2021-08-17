
 import classnames from 'classnames';

 const prefix  = `bx`;
 
 export default function IconBtn({
   children,
   className,
   feedback,
   feedbackTimeout,
   onAnimationEnd,
   onClick,
   ...other
 }) {

   const classNames = classnames(className, `${prefix}--copy`);
   return (
     <button
       type="button"
       className={classNames}
       onClick={onClick}
       {...other}
       aria-live="polite"
       aria-label={
         (!children &&  other['aria-label']) || null
       }>
       {children}
       <span
         aria-hidden="true"
         className={`${prefix}--assistive-text ${prefix}--copy-btn__feedback`}>
         {feedback}
       </span>
     </button>
   );
 }
 

 
