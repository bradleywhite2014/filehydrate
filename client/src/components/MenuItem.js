import * as React from "react";
import { motion } from "framer-motion";
import { useHistory } from "react-router-dom";


const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 }
    },
    display: 'flex'
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 }
    },
    display: 'none'
  }
};

const colors = ["#FF008C", "#D309E1", "#9C1AFF", "#7700FF", "#4400FF"];

export const MenuItem = ({text, icon, location}) => {
  const style = { border: '2px solid rgb(0 255 243)' };
  const history = useHistory()
  return (
    <motion.li
      variants={variants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {history.push(location)}}
    >
      {icon}
      <div className="text-placeholder" style={{color: 'rgb(255 255 255)'}}>{text}</div>
    </motion.li>
  );
};
