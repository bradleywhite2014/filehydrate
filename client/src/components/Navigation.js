import * as React from "react";
import { motion } from "framer-motion";
import { MenuItem } from "./MenuItem";

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    display: 'flex',
    flexDirection: 'column'
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
    display: 'none'
  }
};

export const Navigation = () => (
  <motion.ul variants={variants}>
    <MenuItem text={'Admin'} key={'admin-mnu'} />
    <MenuItem text={'Admin'} key={'profile'} />
    <MenuItem text={'Admin'} key={'api-settings'} />
    <MenuItem text={'Admin'} key={'help'} />
    
  </motion.ul>
);
